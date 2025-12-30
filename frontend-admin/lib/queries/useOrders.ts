/**
 * Admin Orders Query Hooks
 * React Query hooks for orders data fetching
 */

import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queryKeys';
import apiClient from '@/lib/api-client';

interface OrderFilters {
    status?: string;
    search?: string;
    page?: number;
}

export function useAdminOrders(filters: OrderFilters = {}) {
    return useQuery({
        queryKey: queryKeys.orders(filters),
        queryFn: async () => {
            const response = await apiClient.get('/admin/orders', {
                params: {
                    status: filters.status !== 'ALL' ? filters.status : undefined,
                    search: filters.search,
                    page: filters.page || 1,
                }
            });
            return response.data;
        },
        staleTime: 30 * 1000, // 30 seconds for admin data
        placeholderData: (previousData) => previousData, // Prevents pagination flicker
    });
}

export function useAdminOrderDetail(orderId: string) {
    return useQuery({
        queryKey: queryKeys.orderDetail(orderId),
        queryFn: async () => {
            const response = await apiClient.get(`/admin/orders/${orderId}`);
            return response.data;
        },
        enabled: !!orderId,
        staleTime: 60 * 1000, // 1 minute
    });
}
