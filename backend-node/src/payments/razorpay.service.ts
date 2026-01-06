import { Injectable, Logger } from '@nestjs/common';
import Razorpay from 'razorpay';
import * as crypto from 'crypto';

/**
 * RazorpayService
 * Phase 6: Razorpay integration with corrected webhook verification
 */
@Injectable()
export class RazorpayService {
    private readonly logger = new Logger(RazorpayService.name);
    private razorpay: any;
    private webhookSecret: string;
    private isConfigured: boolean;

    constructor() {
        const keyId = process.env.RAZORPAY_KEY_ID;
        const keySecret = process.env.RAZORPAY_KEY_SECRET;

        // Gracefully handle missing credentials
        if (!keyId || !keySecret) {
            this.logger.warn('⚠️  Razorpay credentials not configured. Payment features will be unavailable.');
            this.isConfigured = false;
            this.razorpay = null;
            this.webhookSecret = '';
            return;
        }

        this.razorpay = new Razorpay({
            key_id: keyId,
            key_secret: keySecret,
        });
        this.webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || '';
        this.isConfigured = true;
    }

    /**
     * Create Razorpay order
     * Called AFTER transaction commit (CORRECTED)
     */
    async createOrder(amount: number, currency: string = 'INR'): Promise<string> {
        if (!this.isConfigured) {
            throw new Error('Razorpay is not configured. Please add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to .env');
        }

        const options = {
            amount: Math.round(amount * 100), // Convert to paise
            currency,
            receipt: `receipt_${Date.now()}`,
        };

        const order = await this.razorpay.orders.create(options);
        return order.id; // Razorpay order ID
    }

    /**
     * Verify webhook signature (CORRECTED)
     * Uses HMAC-SHA256 of raw body with webhook secret
     * NOT the same as checkout signature verification
     * SECURITY: Uses timing-safe comparison
     */
    verifyWebhookSignature(rawBody: string, signature: string): boolean {
        if (!this.isConfigured || !this.webhookSecret) {
            this.logger.warn('⚠️  Razorpay webhook secret not configured. Signature verification skipped.');
            return false;
        }

        const expected = crypto
            .createHmac('sha256', this.webhookSecret)
            .update(rawBody)
            .digest('hex');

        try {
            const expectedBuffer = Buffer.from(expected, 'hex');
            const providedBuffer = Buffer.from(signature, 'hex');

            if (expectedBuffer.length !== providedBuffer.length) {
                return false;
            }

            return crypto.timingSafeEqual(expectedBuffer, providedBuffer);
        } catch {
            return false;
        }
    }

    /**
     * Verify payment signature (Checkout)
     * Matches razorpay_order_id + "|" + razorpay_payment_id
     * SECURITY: Uses timing-safe comparison to prevent timing attacks
     */
    verifyPaymentSignature(orderId: string, paymentId: string, signature: string): boolean {
        const keySecret = process.env.RAZORPAY_KEY_SECRET;
        if (!keySecret) return false;

        const body = orderId + "|" + paymentId;
        const expectedSignature = crypto
            .createHmac('sha256', keySecret)
            .update(body.toString())
            .digest('hex');

        // CRITICAL: Timing-safe comparison to prevent signature guessing
        try {
            const expectedBuffer = Buffer.from(expectedSignature, 'hex');
            const providedBuffer = Buffer.from(signature, 'hex');

            if (expectedBuffer.length !== providedBuffer.length) {
                return false;
            }

            return crypto.timingSafeEqual(expectedBuffer, providedBuffer);
        } catch {
            return false;
        }
    }

    /**
     * Verify payment (alias for verifyPaymentSignature)
     * Used by confirmOrder to verify Razorpay payment
     */
    async verifyPayment(orderId: string, paymentId: string, signature: string): Promise<boolean> {
        return this.verifyPaymentSignature(orderId, paymentId, signature);
    }
}
