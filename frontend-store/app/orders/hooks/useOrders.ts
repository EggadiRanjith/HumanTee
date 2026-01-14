/**
 * Orders Hook
 * ✅ OPTIMIZED: Uses React Query for caching and deduplication
 */

"use client";

import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';
import { logError } from '@/lib/logger';
import { Order, OrderFilters } from '../types';
import { queryKeys } from '@/lib/queryKeys';

export function useOrders(filters: OrderFilters = {}) {
    const { data, isLoading, error, refetch } = useQuery({
        queryKey: [...queryKeys.orders, filters],
        queryFn: async () => {
            try {
                const params = new URLSearchParams();

                if (filters.status && filters.status !== 'all') {
                    params.append('status', filters.status);
                }
                if (filters.search) {
                    params.append('search', filters.search);
                }
                if (filters.sortBy) {
                    params.append('sortBy', filters.sortBy);
                }
                if (filters.page) {
                    params.append('page', String(filters.page));
                }
                if (filters.limit) {
                    params.append('limit', String(filters.limit));
                }

                const response = await apiClient.get(`/orders?${params.toString()}`);
                return {
                    orders: response.data.orders || response.data,
                    totalPages: response.data.totalPages || 1
                };
            } catch (err) {
                logError(err, 'Failed to fetch orders');
                throw err;
            }
        },
        staleTime: 30 * 1000, // 30 seconds - orders don't change frequently
        retry: 2,
    });

    return {
        orders: data?.orders || [],
        totalPages: data?.totalPages || 1,
        isLoading,
        error: error as Error | null,
        retry: refetch
    };
}
