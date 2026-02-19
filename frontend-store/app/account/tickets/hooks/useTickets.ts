/**
 * Tickets Hook
 * ✅ OPTIMIZED: Migrated to React Query for cache management and invalidation
 */

"use client";

import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/app/contexts/AuthContext';
import apiClient from '@/lib/api-client';
import { logError } from '@/lib/logger';
import { Ticket, TicketFilters } from '../types';
import { queryKeys } from '@/lib/queryKeys';

export function useTickets(filters: TicketFilters = {}) {
    const { user } = useAuth();
    const userId = user?.id || '';

    const { data, isLoading, error, refetch } = useQuery({
        queryKey: filters.orderId
            ? queryKeys.ticketsByOrder(userId, filters.orderId)
            : queryKeys.allTickets(userId),
        queryFn: async () => {
            try {
                // Simplified: Always fetch all user tickets
                // If orderId is provided, filter by that order's tickets
                const url = filters.orderId
                    ? `/tickets/order/${filters.orderId}`
                    : '/tickets';

                const response = await apiClient.get(url);
                return {
                    tickets: response.data.tickets || response.data,
                    totalPages: response.data.totalPages || 1
                };
            } catch (err) {
                logError(err, 'Failed to fetch tickets');
                throw err;
            }
        },
        enabled: !!userId,
        staleTime: 30 * 1000, // 30 seconds - tickets don't change frequently
        gcTime: 5 * 60 * 1000, // 5 minutes - keep in cache for navigation
        retry: 2,
    });

    return {
        tickets: (data?.tickets || []) as Ticket[],
        totalPages: data?.totalPages || 1,
        isLoading,
        error: error as Error | null,
        retry: refetch
    };
}
