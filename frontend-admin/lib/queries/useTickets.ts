/**
 * Admin Tickets Query Hooks
 * React Query hooks for tickets data fetching
 */

import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queryKeys';
import apiClient from '@/lib/api-client';

interface TicketFilters {
    status?: string;
    priority?: string;
    page?: number;
}

export function useAdminTickets(filters: TicketFilters = {}) {
    return useQuery({
        queryKey: queryKeys.tickets(filters),
        queryFn: async () => {
            const response = await apiClient.get('/admin/tickets', {
                params: filters
            });
            return response.data;
        },
        staleTime: 30 * 1000, // 30 seconds
        placeholderData: (previousData) => previousData,
    });
}

export function useAdminTicketDetail(ticketId: string) {
    return useQuery({
        queryKey: queryKeys.ticketDetail(ticketId),
        queryFn: async () => {
            const response = await apiClient.get(`/admin/tickets/${ticketId}`);
            return response.data;
        },
        enabled: !!ticketId,
        staleTime: 60 * 1000, // 1 minute
    });
}
