import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';
import { queryKeys } from '@/lib/queryKeys';
import type { Order } from '@/app/types/order.types';

/**
 * Hook to fetch a single order by ID
 * Uses React Query for caching and deduplication
 */
export function useOrder(orderId: string) {
    return useQuery({
        queryKey: queryKeys.order(orderId),
        queryFn: async () => {
            const response = await apiClient.get<Order>(`/orders/${orderId}`);
            return response.data;
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes
        retry: 1,
        enabled: !!orderId, // Only fetch if orderId exists
    });
}
