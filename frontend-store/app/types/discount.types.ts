export interface ValidateDiscountRequest {
    code: string;
    cartTotal: number;
    items: Array<{
        productId: string;
        variantId: string;
        quantity: number;
        price: number;
    }>;
}

export interface AppliedDiscount {
    id: string;
    code: string;
    name: string;
    type: 'PERCENT' | 'FLAT';
    value: number;
    discountAmount: number;
    finalTotal: number;
}

export interface DiscountValidationResponse {
    valid: boolean;
    discount?: AppliedDiscount;
    error?: string;
    message?: string;
}
