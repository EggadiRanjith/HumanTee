/**
 * Cart Types
 * Complete type definitions for cart functionality
 */

export interface CartItem {
    id: string;
    productId: string;
    name: string;
    price: number;
    quantity: number;
    size: string;
    color?: string;
    imageUrl: string;
    stock: number;
    maxQuantity?: number;
}

export interface Discount {
    code: string;
    type: 'percentage' | 'fixed';
    value: number;
    minPurchase?: number;
    maxDiscount?: number;
    description?: string;
    expiresAt?: string;
}

export interface CartSummary {
    subtotal: number;
    discount: number;
    shipping: number;
    tax: number;
    total: number;
    itemCount: number;
}

export interface DiscountSuggestion {
    code: string;
    description: string;
    value: number;
    type: 'percentage' | 'fixed';
    minPurchase: number;
}

export interface CartError {
    type: 'stock' | 'price' | 'network' | 'validation';
    message: string;
    itemId?: string;
}

export interface LottieAnimation {
    v: string;
    fr: number;
    ip: number;
    op: number;
    w: number;
    h: number;
    nm: string;
    ddd: number;
    assets: any[];
    layers: any[];
}
