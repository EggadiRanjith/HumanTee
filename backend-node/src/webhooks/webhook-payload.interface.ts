/**
 * Razorpay Webhook Payload Interfaces
 * Strict types for webhook event validation and type safety
 */

export type RazorpayWebhookEvent =
    | 'payment.captured'
    | 'payment.failed'
    | 'payment.authorized'
    | 'order.paid'
    | 'refund.created'
    | 'refund.processed';

export interface RazorpayPaymentEntity {
    id: string;                    // e.g., "pay_29QQoUBi66xm2f"
    entity: 'payment';
    amount: number;                // Amount in paise (e.g., 50000 = ₹500)
    currency: string;              // e.g., "INR"
    status: 'authorized' | 'captured' | 'failed';
    order_id: string;              // e.g., "order_29QQoS3ZH9O9ll"
    invoice_id?: string;
    international: boolean;
    method: 'card' | 'netbanking' | 'wallet' | 'emi' | 'upi';
    amount_refunded: number;
    refund_status?: 'null' | 'partial' | 'full';
    captured: boolean;
    description?: string;
    card_id?: string;
    bank?: string;
    wallet?: string;
    vpa?: string;
    email: string;
    contact: string;
    notes?: Record<string, string>;
    fee?: number;
    tax?: number;
    error_code?: string;
    error_description?: string;
    error_source?: string;
    error_step?: string;
    error_reason?: string;
    created_at: number;            // Unix timestamp
}

export interface RazorpayWebhookPayload {
    entity: 'event';
    account_id: string;
    event: RazorpayWebhookEvent;
    contains: string[];
    payload: {
        payment: {
            entity: RazorpayPaymentEntity;
        };
    };
    created_at: number;            // Unix timestamp
}

/**
 * Type guard to validate webhook payload structure
 */
export function isValidWebhookPayload(payload: any): payload is RazorpayWebhookPayload {
    return (
        payload &&
        payload.entity === 'event' &&
        typeof payload.event === 'string' &&
        payload.payload &&
        payload.payload.payment &&
        payload.payload.payment.entity &&
        typeof payload.payload.payment.entity.id === 'string' &&
        typeof payload.payload.payment.entity.order_id === 'string' &&
        typeof payload.payload.payment.entity.amount === 'number'
    );
}
