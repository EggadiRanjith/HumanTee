/**
 * Admin Customers Query Hooks
 * React Query hooks for customers data fetching
 */

import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queryKeys';
import apiClient from '@/lib/api-client';

interface CustomerFilters {
    search?: string;
    page?: number;
}

export function useAdminCustomers(filters: CustomerFilters = {}) {
    return useQuery({
        queryKey: ['customers', 'list', filters], // WORKAROUND: inline to bypass Turbopack cache bug
        queryFn: async () => {
            const response = await apiClient.get('/admin/users', {
                params: filters
            });
            return response.data;
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
        placeholderData: (previousData) => previousData,
    });
}

export function useAdminCustomerDetail(customerId: string) {
    return useQuery({
        queryKey: queryKeys.customerDetail(customerId),
        queryFn: async () => {
            const response = await apiClient.get(`/admin/users/${customerId}`);
            return response.data;
        },
        enabled: !!customerId,
        staleTime: 2 * 60 * 1000, // 2 minutes
    });
}
