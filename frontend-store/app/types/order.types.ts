/**
 * Order Types
 * Type definitions for order data
 */

export type OrderStatus = 'delivered' | 'shipped' | 'processing' | 'pending' | 'cancelled' | 'confirmed';

export interface OrderItem {
    id: string;
    productId: string;
    productNameSnapshot: string;
    imageUrlSnapshot: string;
    variantId: string;
    variantLabelSnapshot: string;
    unitPrice: number;
    quantity: number;
    lineTotal: number;
}

export interface Address {
    fullName: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
}

export interface Payment {
    id: string;
    paymentMethod: string;
    status: string;
    amount: number;
}

export interface Order {
    id: string;
    orderNumber: string;
    createdAt: string;
    updatedAt?: string;
    status: OrderStatus;
    totalAmount: number;
    currency: string;
    items: OrderItem[];
    address?: Address;
    payments?: Payment[];
    trackingNumber?: string;
    shipmentStatus?: string;
    shippedAt?: string;
    deliveredAt?: string;
    subtotal?: number;
    shippingAmount?: number;
    taxAmount?: number;
    discountAmount?: number;
}
