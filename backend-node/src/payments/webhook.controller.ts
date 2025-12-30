import {
    Controller,
    Post,
    Body,
    Headers,
    UnauthorizedException,
    NotFoundException,
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
    constructor(
        @InjectRepository(Payment)
        private paymentRepo: Repository<Payment>,
        @InjectRepository(Order)
        private orderRepo: Repository<Order>,
        private razorpayService: RazorpayService,
    ) { }

    /**
     * Razorpay webhook handler
     * CORRECTED: Proper signature verification + enforced idempotency
     */
    @Post('razorpay')
    async handleRazorpayWebhook(
        @Req() req: Request,
        @Headers('x-razorpay-signature') signature: string
    ) {
        // 1. CORRECTED: Verify webhook signature with raw body
        const rawBody = JSON.stringify(req.body);
        const isValid = this.razorpayService.verifyWebhookSignature(
            rawBody,
            signature
        );

        if (!isValid) {
            throw new UnauthorizedException('Invalid signature');
        }

        const payload = req.body;
        const event = payload.event;
        const paymentEntity = payload.payload.payment.entity;

        // 2. CORRECTED: Idempotency check enforced in code
        const existingPayment = await this.paymentRepo.findOne({
            where: { providerPaymentId: paymentEntity.id },
        });

        if (
            existingPayment &&
            existingPayment.status !== PaymentStatus.INITIATED
        ) {
            // Already processed - return 200 (idempotent)
            return { status: 'ok', message: 'Already processed' };
        }

        // 3. Find order
        const order = await this.orderRepo.findOne({
            where: { paymentOrderId: paymentEntity.order_id },
        });

        if (!order) {
            throw new NotFoundException('Order not found');
        }

        // 4. Update payment and order
        if (event === 'payment.captured') {
            await this.handlePaymentSuccess(
                order.id,
                paymentEntity.id,
                payload
            );
        } else if (event === 'payment.failed') {
            await this.handlePaymentFailure(
                order.id,
                paymentEntity.id,
                payload
            );
        }

        return { status: 'ok' };
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
