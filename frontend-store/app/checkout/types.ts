/**
 * Checkout Types
 * Complete type definitions for checkout flow
 */

export interface ShippingAddress {
    id?: string;
    fullName: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    phone: string;
    isDefault?: boolean;
}

export interface PaymentMethod {
    type: 'card' | 'upi' | 'netbanking' | 'cod';
    cardNumber?: string;
    cardHolderName?: string;
    expiryMonth?: string;
    expiryYear?: string;
    cvv?: string;
    upiId?: string;
    bankName?: string;
}

export interface CheckoutStep {
    id: number;
    name: string;
    path: string;
    isComplete: boolean;
}

export interface CheckoutState {
    currentStep: number;
    shippingAddress?: ShippingAddress;
    paymentMethod?: PaymentMethod;
    orderId?: string;
}

export interface OrderSummary {
    subtotal: number;
    discount: number;
    shipping: number;
    tax: number;
    total: number;
    itemCount: number;
}

export interface CheckoutError {
    type: 'validation' | 'payment' | 'network' | 'session';
    message: string;
    field?: string;
}
