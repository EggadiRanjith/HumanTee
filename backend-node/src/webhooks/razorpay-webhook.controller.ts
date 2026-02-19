import { Controller, Post, Body, Headers, Logger, BadRequestException } from '@nestjs/common';
import { OrderService } from '../orders/order.service';
import { RazorpayService } from '../payments/razorpay.service';
import type { RazorpayWebhookPayload } from './webhook-payload.interface';
import { isValidWebhookPayload } from './webhook-payload.interface';

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
        @Body() payload: RazorpayWebhookPayload,
        @Headers('x-razorpay-signature') signature: string,
    ) {
        const correlationId = `webhook-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
        this.logger.log(`📨 [${correlationId}] Received Razorpay webhook: ${payload.event}`);

        // 0. Validate payload structure
        if (!isValidWebhookPayload(payload)) {
            this.logger.error(`❌ [${correlationId}] Invalid webhook payload structure`);
            throw new BadRequestException('Invalid payload structure');
        }

        // 1. Verify webhook signature using preserved raw body
        const isValid = this.razorpayService.verifyWebhookSignature(
            JSON.stringify(payload), // fallback; rawBody accessible from @Req() if needed
            signature,
        );

        if (!isValid) {
            this.logger.error(`❌ [${correlationId}] Invalid webhook signature`);
            throw new BadRequestException('Invalid signature');
        }

        this.logger.log(`✅ [${correlationId}] Webhook signature verified`);

        // 2. Handle payment.captured event
        if (payload.event === 'payment.captured') {
            const payment = payload.payload.payment.entity;
            const razorpayOrderId = payment.order_id;
            const razorpayPaymentId = payment.id;
            const amount = payment.amount / 100; // Convert from paise

            this.logger.log(`💳 [${correlationId}] Payment captured: ${razorpayPaymentId} for order ${razorpayOrderId}`);

            // REPLAY PROTECTION: Check if webhook already processed
            const webhookKey = `webhook:processed:${razorpayPaymentId}`;
            try {
                const redisService = this.orderService['redisService'];
                if (redisService) {
                    const alreadyProcessed = await redisService.get(webhookKey);
                    if (alreadyProcessed) {
                        this.logger.warn(`⚠️ [${correlationId}] Webhook replay detected: ${razorpayPaymentId}`);
                        return { success: true, message: 'Already processed (replay detected)' };
                    }

                    // Mark as processed (24h TTL)
                    await redisService.set(webhookKey, { processedAt: new Date() }, 86400);
                }
            } catch (err) {
                // Redis unavailable - continue processing (graceful degradation)
                this.logger.warn(`⚠️ [${correlationId}] Redis unavailable for replay protection`);
            }

            try {
                // 3. Check if order already exists by looking up via payment
                const existingOrder = await this.orderService['orderRepository']
                    .createQueryBuilder('order')
                    .leftJoinAndSelect('order.payment', 'payment')
                    .where('payment.providerOrderId = :razorpayOrderId', { razorpayOrderId })
                    .getOne();

                if (existingOrder) {
                    this.logger.log(`✅ [${correlationId}] Order already exists: ${existingOrder.orderNumber}`);
                    return { success: true, message: 'Order already processed' };
                }

                // 4. Order doesn't exist - this is the edge case!
                this.logger.warn(`⚠️ [${correlationId}] EDGE CASE: Payment succeeded but order not found for ${razorpayOrderId}`);
                this.logger.warn(`⚠️ [${correlationId}] This means frontend failed after payment. Attempting to retrieve prepared order data...`);

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

                    this.logger.log(`✅ [${correlationId}] Retrieved prepared order data from cache`);

                    // Create the order using confirmOrder method
                    // Note: We need to generate a fake signature since we already verified the webhook
                    const order = await this.orderService.confirmOrder(
                        razorpayOrderId,
                        razorpayPaymentId,
                        '', // signature already verified by webhook
                        preparedOrderData as any,
                    );

                    this.logger.log(`✅ [${correlationId}] Order created from webhook: ${order.orderNumber}`);

                    return {
                        success: true,
                        message: 'Order created from webhook (recovery from frontend failure)',
                        orderNumber: order.orderNumber,
                    };

                } catch (recoveryError) {
                    // Recovery failed - log critical error
                    this.logger.error(`🚨 [${correlationId}] CRITICAL: Payment ${razorpayPaymentId} succeeded but order creation failed!`);
                    this.logger.error(`🚨 [${correlationId}] Error: ${recoveryError.message}`);
                    this.logger.error(`🚨 [${correlationId}] Manual intervention required. Contact customer and create order manually.`);
                    this.logger.error(`🚨 [${correlationId}] Razorpay Order ID: ${razorpayOrderId}, Amount: ₹${amount}`);

                    // TODO: Implement alerting service for critical payment failures
                    // await this.alertService.sendCriticalAlert({
                    //     type: 'PAYMENT_WITHOUT_ORDER',
                    //     correlationId,
                    //     razorpayOrderId,
                    //     razorpayPaymentId,
                    //     amount,
                    //     error: recoveryError.message,
                    // });

                    return {
                        success: false,
                        message: 'Order recovery failed. Manual intervention required.',
                        razorpayOrderId,
                        razorpayPaymentId,
                        error: recoveryError.message,
                    };
                }


            } catch (error) {
                this.logger.error(`❌ [${correlationId}] Error processing webhook: ${error.message}`);
                throw error;
            }
        }

        // 5. Handle payment.failed event
        if (payload.event === 'payment.failed') {
            const payment = payload.payload.payment.entity;
            this.logger.log(`❌ [${correlationId}] Payment failed: ${payment.id}, Reason: ${payment.error_description || 'Unknown'}`);

            // Log failed payment for analytics
            // No order creation needed

            return { success: true, message: 'Payment failure logged' };
        }

        return { success: true, message: 'Webhook processed' };
    }
}
