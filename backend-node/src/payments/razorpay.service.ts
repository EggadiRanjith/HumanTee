import { Injectable } from '@nestjs/common';
import Razorpay from 'razorpay';
import * as crypto from 'crypto';

/**
 * RazorpayService
 * Phase 6: Razorpay integration with corrected webhook verification
 */
@Injectable()
export class RazorpayService {
    private razorpay: any;
    private webhookSecret: string;
    private isConfigured: boolean;

    constructor() {
        const keyId = process.env.RAZORPAY_KEY_ID;
        const keySecret = process.env.RAZORPAY_KEY_SECRET;

        // Gracefully handle missing credentials
        if (!keyId || !keySecret) {
            console.warn('⚠️  Razorpay credentials not configured. Payment features will be unavailable.');
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
     */
    verifyWebhookSignature(rawBody: string, signature: string): boolean {
        if (!this.isConfigured || !this.webhookSecret) {
            console.warn('⚠️  Razorpay webhook secret not configured. Signature verification skipped.');
            return false;
        }

        const expected = crypto
            .createHmac('sha256', this.webhookSecret)
            .update(rawBody)
            .digest('hex');

        return expected === signature;
    }
}
