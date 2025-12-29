import { Controller, Post, Req, Headers, UnauthorizedException, Logger } from '@nestjs/common';
import type { RawBodyRequest } from '@nestjs/common';
import { Request } from 'express';
import { PaymentsService } from './payments.service';
import { OrderService } from '../orders/order.service';

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
    async handleRazorpayWebhook(
        @Req() req: RawBodyRequest<Request>,
        @Headers('x-razorpay-signature') signature: string,
    ) {
        try {
            // Get raw body for signature verification
            const body = JSON.stringify(req.body);

            // Verify webhook signature (CRITICAL)
            if (!this.paymentsService.verifyWebhookSignature(body, signature)) {
                this.logger.error('Invalid webhook signature');
                throw new UnauthorizedException('Invalid signature');
            }

            const event = req.body.event;
            this.logger.log(`Webhook received: ${event}`);

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
                this.logger.log(`Order ${orderId} marked as PAID via webhook`);
            }

            // Handle payment failed event
            if (event === 'payment.failed') {
                const payment = req.body.payload.payment.entity;
                const orderId = payment.notes?.orderId;

                if (orderId) {
                    await this.orderService.markOrderPaymentFailed(orderId);
                    this.logger.log(`Order ${orderId} marked as PAYMENT_FAILED via webhook`);
                }
            }

            return { received: true };
        } catch (error) {
            this.logger.error(`Webhook processing failed: ${error.message}`);
            throw error;
        }
    }
}
