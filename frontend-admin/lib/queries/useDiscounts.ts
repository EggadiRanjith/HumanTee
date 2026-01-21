/**
 * Admin Discounts Query Hooks
 * React Query hooks for discounts data fetching
 */

import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queryKeys';
import { discountsApi } from '@/lib/api/discounts';

export function useAdminDiscounts() {
    return useQuery({
        queryKey: queryKeys.discounts,
        queryFn: async () => {
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
