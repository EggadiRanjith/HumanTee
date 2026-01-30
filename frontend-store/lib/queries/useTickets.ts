import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queryKeys';
import apiClient from '@/lib/api-client';

export function useTickets(userId: string, page: number = 1) {
    return useQuery({
        queryKey: queryKeys.tickets(userId, page),
        queryFn: async () => {
            const response = await apiClient.get(`/tickets?page=${page}&limit=10`);
            return response.data;
        },
        enabled: !!userId,
        placeholderData: (previousData) => previousData,
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: Infinity, // Keep tickets cached indefinitely to restore list when coming back from detail
    });
}

export function useTicketDetail(userId: string, ticketId: string) {
    return useQuery({
        queryKey: queryKeys.ticketDetail(userId, ticketId),
        queryFn: async () => {
            const response = await apiClient.get(`/tickets/${ticketId}`);
            return response.data;
        },
        enabled: !!userId && !!ticketId,
        staleTime: 2 * 60 * 1000, // 2 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes
    });
}
