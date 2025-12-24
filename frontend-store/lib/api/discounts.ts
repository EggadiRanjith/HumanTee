import apiClient from '@/lib/api-client';
import type { ValidateDiscountRequest, AppliedDiscount } from '@/app/types/discount.types';

export interface DiscountSuggestion {
    id: string;
    code: string;
    name: string;
    type: 'PERCENT' | 'FLAT';
    value: number;
    savings: number;
    description: string;
    expiresAt: string | null;
    isBest?: boolean;
    scope: string;
    minOrderAmount: number;
}

export const discountsApi = {
    /**
     * Validate a discount code against the current cart
     */
    async validateCode(data: ValidateDiscountRequest): Promise<AppliedDiscount> {
        try {
            const response = await apiClient.post('/discounts/validate', data);

            if (!response.data.valid) {
                throw new Error(response.data.message || 'Invalid discount code');
            }

            return response.data.discount;
        } catch (error: any) {
            // Format backend error messages for user display
            if (error.response?.data?.message) {
                throw new Error(error.response.data.message);
            }
            throw new Error('Failed to validate discount code');
        }
    },

    /**
     * Get discount suggestions for cart
     */
    async getSuggestions(data: ValidateDiscountRequest): Promise<DiscountSuggestion[]> {
        try {
            const response = await apiClient.post('/discounts/suggestions', data);
            return response.data.suggestions || [];
        } catch (error: any) {
            console.error('Failed to fetch discount suggestions:', error);
            return []; // Return empty array on error
        }
    }
};
