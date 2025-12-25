import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queryKeys';
import apiClient from '@/lib/api-client';

export function useOrders(userId: string, page: number = 1) {
    return useQuery({
        queryKey: queryKeys.orders(userId, page),
        queryFn: async () => {
            const response = await apiClient.get(`/orders?page=${page}&limit=10`);
            return response.data;
        },
        enabled: !!userId,
        keepPreviousData: true, // Prevents pagination flicker
        staleTime: 5 * 60 * 1000,
    });
}

export function useOrderDetail(userId: string, orderId: string) {
    return useQuery({
        queryKey: queryKeys.orderDetail(userId, orderId),
        queryFn: async () => {
            const response = await apiClient.get(`/orders/${orderId}`);
            return response.data;
        },
        enabled: !!userId && !!orderId,
        staleTime: 10 * 60 * 1000,
    });
}
