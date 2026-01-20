import { Controller, Post, Body, Headers, Logger, BadRequestException } from '@nestjs/common';
import { OrderService } from '../orders/order.service';
import { RazorpayService } from '../payments/razorpay.service';

/**
 * Razorpay Webhook Controller
 * Handles payment notifications from Razorpay
 * CRITICAL: This is a safety net for cases where frontend fails after payment
 */
@Controller('webhooks/razorpay')
export class RazorpayWebhookController {
    private readonly logger = new Logger(RazorpayWebhookController.name);

    constructor(
        private readonly orderService: OrderService,
        private readonly razorpayService: RazorpayService,
    ) { }

    /**
     * Razorpay Payment Success Webhook
     * POST /webhooks/razorpay/payment
     */
    @Post('payment')
    async handlePaymentWebhook(
        @Body() payload: any,
        @Headers('x-razorpay-signature') signature: string,
    ) {
        this.logger.log('📨 Received Razorpay webhook');

        // 1. Verify webhook signature
        const isValid = this.razorpayService.verifyWebhookSignature(
            JSON.stringify(payload),
            signature,
        );

        if (!isValid) {
            this.logger.error('❌ Invalid webhook signature');
            throw new BadRequestException('Invalid signature');
        }

        this.logger.log('✅ Webhook signature verified');

        // 2. Handle payment.captured event
        if (payload.event === 'payment.captured') {
            const payment = payload.payload.payment.entity;
            const razorpayOrderId = payment.order_id;
            const razorpayPaymentId = payment.id;
            const amount = payment.amount / 100; // Convert from paise

            this.logger.log(`💳 Payment captured: ${razorpayPaymentId} for order ${razorpayOrderId}`);

            // REPLAY PROTECTION: Check if webhook already processed
            const webhookKey = `webhook:processed:${razorpayPaymentId}`;
            try {
                const redisService = this.orderService['redisService'];
                if (redisService) {
                    const alreadyProcessed = await redisService.get(webhookKey);
                    if (alreadyProcessed) {
                        this.logger.warn(`⚠️ Webhook replay detected: ${razorpayPaymentId}`);
                        return { success: true, message: 'Already processed (replay detected)' };
                    }

                    // Mark as processed (24h TTL)
                    await redisService.set(webhookKey, { processedAt: new Date() }, 86400);
                }
            } catch (err) {
                // Redis unavailable - continue processing (graceful degradation)
                this.logger.warn('Redis unavailable for replay protection');
            }

            try {
                // 3. Check if order already exists by looking up via payment
                const existingOrder = await this.orderService['orderRepository']
                    .createQueryBuilder('order')
                    .leftJoinAndSelect('order.payment', 'payment')
                    .where('payment.providerOrderId = :razorpayOrderId', { razorpayOrderId })
                    .getOne();

                if (existingOrder) {
                    this.logger.log(`✅ Order already exists: ${existingOrder.orderNumber}`);
                    return { success: true, message: 'Order already processed' };
                }

                // 4. Order doesn't exist - this is the edge case!
                this.logger.warn(`⚠️  EDGE CASE: Payment succeeded but order not found for ${razorpayOrderId}`);
                this.logger.warn(`⚠️  This means frontend failed after payment. Attempting to retrieve prepared order data...`);

                // Retrieve prepared order data from Redis cache
                // The frontend stores this data when calling /orders/prepare
                try {
                    const redisService = this.orderService['redisService'];
                    if (!redisService) {
                        throw new Error('Redis service not available');
                    }

                    // Try to find cached prepared order data
                    // Key format: order:prep:{userId}:{idempotencyKey}
                    // Problem: We don't have userId or idempotency key from webhook
                    // Solution: Store a reverse mapping by razorpayOrderId
                    const cacheKey = `order:razorpay:${razorpayOrderId}`;
                    const preparedOrderData = await redisService.get(cacheKey);

                    if (!preparedOrderData) {
                        throw new Error('Prepared order data not found in cache');
                    }

                    this.logger.log(`✅ Retrieved prepared order data from cache`);

                    // Create the order using confirmOrder method
                    // Note: We need to generate a fake signature since we already verified the webhook
                    const order = await this.orderService.confirmOrder(
                        razorpayOrderId,
                        razorpayPaymentId,
                        '', // signature already verified by webhook
                        preparedOrderData as any,
                    );

                    this.logger.log(`✅ Order created from webhook: ${order.orderNumber}`);

                    return {
                        success: true,
                        message: 'Order created from webhook (recovery from frontend failure)',
                        orderNumber: order.orderNumber,
                    };

                } catch (recoveryError) {
                    // Recovery failed - log critical error
                    this.logger.error(`🚨 CRITICAL: Payment ${razorpayPaymentId} succeeded but order creation failed!`);
                    this.logger.error(`🚨 Error: ${recoveryError.message}`);
                    this.logger.error(`🚨 Manual intervention required. Contact customer and create order manually.`);
                    this.logger.error(`🚨 Razorpay Order ID: ${razorpayOrderId}, Amount: ₹${amount}`);

                    // Send alert (email, Slack, etc.)
                    // await this.alertService.sendCriticalAlert(...)

                    return {
                        success: false,
                        message: 'Order recovery failed. Manual intervention required.',
                        razorpayOrderId,
                        razorpayPaymentId,
                        error: recoveryError.message,
                    };
                }


            } catch (error) {
                this.logger.error(`❌ Error processing webhook: ${error.message}`);
                throw error;
            }
        }

        // 5. Handle payment.failed event
        if (payload.event === 'payment.failed') {
            const payment = payload.payload.payment.entity;
            this.logger.log(`❌ Payment failed: ${payment.id}`);

            // Log failed payment for analytics
            // No order creation needed

            return { success: true, message: 'Payment failure logged' };
        }

        return { success: true, message: 'Webhook processed' };
    }
}
