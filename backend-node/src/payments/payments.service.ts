import { Injectable, Logger } from '@nestjs/common';
import Razorpay from 'razorpay';
import * as crypto from 'crypto';

@Injectable()
export class PaymentsService {
    private readonly logger = new Logger(PaymentsService.name);
    private razorpay: Razorpay;

    constructor() {
        // Initialize Razorpay
        this.razorpay = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID || '',
            key_secret: process.env.RAZORPAY_KEY_SECRET || '',
        });

        if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
            this.logger.warn('Razorpay credentials not configured');
        }
    }

    /**
     * Create Razorpay order
     * Amount should be in rupees (will be converted to paise)
     */
    async createOrder(amount: number, orderId: string) {
        try {
            const razorpayOrder = await this.razorpay.orders.create({
                amount: Math.round(amount * 100), // Convert to paise
                currency: 'INR',
                receipt: orderId,
                notes: {
                    orderId,
                },
            });

            this.logger.log(`Razorpay order created: ${razorpayOrder.id} for order ${orderId}`);
            return razorpayOrder;
        } catch (error) {
            this.logger.error(`Failed to create Razorpay order: ${error.message}`);
            throw error;
        }
    }

    /**
     * Verify payment signature (client-side verification)
     * This is called after user completes payment
     */
    verifyPaymentSignature(
        razorpayOrderId: string,
        razorpayPaymentId: string,
        razorpaySignature: string,
    ): boolean {
        try {
            const text = `${razorpayOrderId}|${razorpayPaymentId}`;
            const generated = crypto
                .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || '')
                .update(text)
                .digest('hex');

            const isValid = generated === razorpaySignature;

            if (isValid) {
                this.logger.log(`Payment signature verified: ${razorpayPaymentId}`);
            } else {
                this.logger.warn(`Invalid payment signature: ${razorpayPaymentId}`);
            }

            return isValid;
        } catch (error) {
            this.logger.error(`Signature verification failed: ${error.message}`);
            return false;
        }
    }

    /**
     * Verify webhook signature (CRITICAL for security)
     * Razorpay sends webhooks for payment events
     */
    verifyWebhookSignature(body: string, signature: string): boolean {
        try {
            const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || '';

            if (!webhookSecret) {
                this.logger.error('Webhook secret not configured');
                return false;
            }

            const generated = crypto
                .createHmac('sha256', webhookSecret)
                .update(body)
                .digest('hex');

            const isValid = generated === signature;

            if (!isValid) {
                this.logger.warn('Invalid webhook signature');
            }

            return isValid;
        } catch (error) {
            this.logger.error(`Webhook verification failed: ${error.message}`);
            return false;
        }
    }

    /**
     * Fetch payment details from Razorpay
     */
    async getPaymentDetails(paymentId: string) {
        try {
            return await this.razorpay.payments.fetch(paymentId);
        } catch (error) {
            this.logger.error(`Failed to fetch payment: ${error.message}`);
            throw error;
        }
    }
}
