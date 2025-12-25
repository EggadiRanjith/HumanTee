/**
 * Order Types
 * Complete type definitions for order data
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

    // Items
    items: OrderItem[];

    // Pricing
    subtotal: number;
    shippingAmount: number;
    taxAmount: number;
    discountAmount: number;
    totalAmount: number;

    // Shipping
    address: Address;
    trackingNumber?: string;

    // Payment
    payments: Payment[];
}

export interface OrderFilters {
    status?: OrderStatus | 'all';
    dateRange?: 'all' | 'last-30-days' | 'last-90-days' | 'this-year';
    search?: string;
    sortBy?: 'newest' | 'oldest' | 'price-high' | 'price-low';
    page?: number;
    limit?: number;
}
