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
        queryKey: ['tickets', 'list', filters], // WORKAROUND: inline to bypass Turbopack cache bug
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
        queryKey: ['tickets', 'detail', ticketId], // WORKAROUND: inline to bypass Turbopack cache bug
        queryFn: async () => {
            const response = await apiClient.get(`/admin/tickets/${ticketId}`);
            // API returns { ticket: {...}, messages: [...] }
            // Combine them into single object for easier access
            return {
                ...response.data.ticket,
                messages: response.data.messages || []
            };
        },
        enabled: !!ticketId,
        staleTime: 60 * 1000, // 1 minute
    });
}
