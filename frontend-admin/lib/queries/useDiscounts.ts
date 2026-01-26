/**
 * Admin Discounts Query Hooks
 * React Query hooks for discounts data fetching
 */

import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queryKeys';
import { discountsApi } from '@/lib/api/discounts';

// Type definition for discount response
interface Discount {
    id: string;
    name: string;
    code: string;
    type: 'PERCENT' | 'FLAT';
    value: number;
    scope: 'GLOBAL' | 'PRODUCT' | 'GROUP';
    isActive: boolean;
    startDate: string;
    endDate: string | null;
    productsCount?: number;
    usageCount?: number;
    usageLimit?: number | null;
}

export function useAdminDiscounts() {
    return useQuery<Discount[]>({
        queryKey: queryKeys.discounts,
        queryFn: async (): Promise<Discount[]> => {
            const data = await discountsApi.getAll();
            return data;
        },
        staleTime: 5 * 60 * 1000, // 5 minutes - optimized like orders/customers
    });
}

export function useAdminDiscountDetail(discountId: string) {
    return useQuery({
        queryKey: queryKeys.discountDetail(discountId),
        queryFn: async () => {
            const data = await discountsApi.getOne(discountId);
            return data;
        },
        enabled: !!discountId,
        staleTime: 2 * 60 * 1000, // 2 minutes
    });
}
