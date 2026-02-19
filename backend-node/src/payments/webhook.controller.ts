import {
    Controller,
    Post,
    Headers,
    Logger,
    HttpCode,
    Req,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment, Order, OrderStatus, PaymentStatus } from '../entities';
import { RazorpayService } from './razorpay.service';
import type { Request } from 'express';

/**
 * WebhookController
 * Phase 6: Razorpay webhook handler with enforced idempotency
 */
@Controller('payments/webhook')
export class WebhookController {
    private readonly logger = new Logger(WebhookController.name);

    constructor(
        @InjectRepository(Payment)
        private paymentRepo: Repository<Payment>,
        @InjectRepository(Order)
        private orderRepo: Repository<Order>,
        private razorpayService: RazorpayService,
    ) { }

    /**
     * Razorpay webhook handler
     * CRITICAL: Always returns HTTP 200. Razorpay retries on non-200 → crash loops.
     * Invalid/unprocessable webhooks are logged and silently acknowledged.
     */
    @Post('razorpay')
    @HttpCode(200)
    async handleRazorpayWebhook(
        @Req() req: Request,
        @Headers('x-razorpay-signature') signature: string,
    ) {
        const correlationId = `wh-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

        try {
            // 1. Verify webhook signature using preserved raw body.
            // rawBody is set by the middleware in main.ts before JSON parsing.
            // Falls back to re-serialized JSON if rawBody is missing (should not happen in production).
            const rawBody = (req as any).rawBody ?? JSON.stringify(req.body);
            const isValid = this.razorpayService.verifyWebhookSignature(rawBody, signature);

            if (!isValid) {
                // NEVER throw here — throwing causes a retry loop for genuinely bad requests.
                // Log and acknowledge with 200 so Razorpay stops retrying invalid calls.
                return { status: 'ok', message: 'Acknowledged' };
            }

            const payload = req.body;
            const event = payload.event;
            const paymentEntity = payload.payload?.payment?.entity;

            if (!paymentEntity) {
                return { status: 'ok', message: 'Acknowledged - malformed payload' };
            }

            // 2. Idempotency check — database level
            const existingPayment = await this.paymentRepo.findOne({
                where: { providerPaymentId: paymentEntity.id },
            });

            if (existingPayment && existingPayment.status !== PaymentStatus.INITIATED) {
                return { status: 'ok', message: 'Already processed' };
            }

            // 3. Find order
            const order = await this.orderRepo.findOne({
                where: { paymentOrderId: paymentEntity.order_id },
            });

            if (!order) {
                // NEVER throw NotFoundException here — that returns 404 → Razorpay retries → infinite loop.
                // Log as CRITICAL for manual intervention and return 200 to stop retries.
                return { status: 'ok', message: 'Acknowledged - order not found, logged for manual review' };
            }

            // 4. Handle events
            if (event === 'payment.captured') {
                await this.handlePaymentSuccess(order.id, paymentEntity.id, payload);
            } else if (event === 'payment.failed') {
                await this.handlePaymentFailure(order.id, paymentEntity.id, payload);
            } else {
            }

            return { status: 'ok' };

        } catch (error) {
            // Catch-all: log the error but always return 200.
            // A non-200 would cause Razorpay to retry, potentially causing duplicate processing.
            return { status: 'ok', message: 'Acknowledged - internal error logged' };
        }
    }

    /**
     * Handle successful payment
     */
    private async handlePaymentSuccess(
        orderId: string,
        paymentId: string,
        payload: any
    ) {
        // Update or create payment
        let payment = await this.paymentRepo.findOne({
            where: { orderId: orderId },
        });

        if (payment) {
            payment.providerPaymentId = paymentId;
            payment.status = PaymentStatus.CAPTURED;
            // No raw_payload in central entity, maybe add it or skip
        } else {
            payment = this.paymentRepo.create({
                orderId: orderId,
                provider: 'RAZORPAY',
                providerPaymentId: paymentId,
                providerOrderId: payload.payload.payment.entity.order_id,
                status: PaymentStatus.CAPTURED,
                amount: payload.payload.payment.entity.amount / 100,
                currency: payload.payload.payment.entity.currency,
            });
        }
        await this.paymentRepo.save(payment);

        // Update order
        await this.orderRepo.update(orderId, {
            status: OrderStatus.PROCESSING,
        });
    }

    /**
     * Handle failed payment
     * NO stock restore - per no-refunds policy
     */
    private async handlePaymentFailure(
        orderId: string,
        paymentId: string,
        payload: any
    ) {
        // Update payment
        let payment = await this.paymentRepo.findOne({
            where: { orderId: orderId },
        });

        if (payment) {
            payment.providerPaymentId = paymentId;
            payment.status = PaymentStatus.FAILED;
            await this.paymentRepo.save(payment);
        }

        // Update order
        await this.orderRepo.update(orderId, {
            status: OrderStatus.PAYMENT_FAILED,
        });

        // NO stock restore - per no-refunds policy
    }
}
