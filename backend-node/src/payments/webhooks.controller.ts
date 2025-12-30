import { Controller, Post, Req, Headers, Logger, HttpCode } from '@nestjs/common';
import type { RawBodyRequest } from '@nestjs/common';
import { Request } from 'express';
import { PaymentsService } from './payments.service';
import { OrderService } from '../orders/order.service';
import { WebhookRateLimit } from '../common/decorators/rate-limit.decorators';

@Controller('webhooks')
export class WebhooksController {
    private readonly logger = new Logger(WebhooksController.name);

    constructor(
        private paymentsService: PaymentsService,
        private orderService: OrderService,
    ) { }

    /**
     * Razorpay webhook endpoint
     * CRITICAL: This marks orders as PAID after payment confirmation
     */
    @Post('razorpay')
    @HttpCode(200) // CRITICAL: Always return 200
    @WebhookRateLimit() // 20 requests per minute
    async handleRazorpayWebhook(
        @Req() req: RawBodyRequest<Request>,
        @Headers('x-razorpay-signature') signature: string,
    ) {
        const correlationId = `webhook-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

        try {
            // Get raw body for signature verification
            const body = JSON.stringify(req.body);

            // Verify webhook signature (CRITICAL)
            if (!this.paymentsService.verifyWebhookSignature(body, signature)) {
                this.logger.error(`[${correlationId}] Invalid webhook signature`);
                return { received: true, error: 'Invalid signature' }; // Return 200!
            }

            const event = req.body.event;
            this.logger.log(`[${correlationId}] Webhook received: ${event}`);

            // Handle payment captured event
            if (event === 'payment.captured') {
                const payment = req.body.payload.payment.entity;
                const paymentId = payment.id;
                const orderId = payment.notes?.orderId;

                if (!orderId) {
                    this.logger.error('Order ID not found in webhook payload');
                    return { received: true };
                }

                // Mark order as PAID (only after webhook confirmation)
                await this.orderService.markOrderPaid(orderId, paymentId);
                this.logger.log(`[${correlationId}] Order ${orderId} marked as PAID via webhook`);
            }

            // Handle payment failed event
            if (event === 'payment.failed') {
                const payment = req.body.payload.payment.entity;
                const orderId = payment.notes?.orderId;

                if (orderId) {
                    await this.orderService.markOrderPaymentFailed(orderId);
                    this.logger.log(`[${correlationId}] Order ${orderId} marked as PAYMENT_FAILED via webhook`);
                }
            }

            return { received: true, processed: true };
        } catch (error) {
            this.logger.error(`[${correlationId}] Webhook processing failed: ${error.message}`);
            return { received: true, error: error.message }; // Return 200!
        }
    }
}
