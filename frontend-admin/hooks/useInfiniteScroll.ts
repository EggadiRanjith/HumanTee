import { useInfiniteQuery } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';

export interface PaginationParams {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    sortBy?: string;
    sortOrder?: 'ASC' | 'DESC';
}

export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasMore: boolean;
}

/**
 * Infinite scroll hook for products
 * Automatically loads more items as user scrolls
 */
export function useInfiniteProducts(filters: Omit<PaginationParams, 'page'> = {}) {
    return useInfiniteQuery({
        queryKey: ['products', 'infinite', filters],
        queryFn: async ({ pageParam = 1 }) => {
            const response = await apiClient.get<PaginatedResponse<any>>('/admin/products', {
                params: {
                    page: pageParam,
                    limit: 20,
                    ...filters,
                },
            });
            return response.data;
        },
        getNextPageParam: (lastPage) => {
            return lastPage.hasMore ? lastPage.page + 1 : undefined;
        },
        initialPageParam: 1,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
}

/**
 * Infinite scroll hook for orders
 */
export function useInfiniteOrders(filters: Omit<PaginationParams, 'page'> = {}) {
    return useInfiniteQuery({
        queryKey: ['orders', 'infinite', filters],
        queryFn: async ({ pageParam = 1 }) => {
            const response = await apiClient.get<PaginatedResponse<any>>('/admin/orders', {
                params: {
                    page: pageParam,
                    limit: 20,
                    ...filters,
                },
            });
            return response.data;
        },
        getNextPageParam: (lastPage) => {
            return lastPage.hasMore ? lastPage.page + 1 : undefined;
        },
        initialPageParam: 1,
        staleTime: 2 * 60 * 1000, // 2 minutes (orders change more frequently)
    });
}

/**
 * Infinite scroll hook for customers
 */
export function useInfiniteCustomers(filters: Omit<PaginationParams, 'page'> = {}) {
    return useInfiniteQuery({
        queryKey: ['customers', 'infinite', filters],
        queryFn: async ({ pageParam = 1 }) => {
            const response = await apiClient.get<PaginatedResponse<any>>('/admin/customers', {
                params: {
                    page: pageParam,
                    limit: 20,
                    ...filters,
                },
            });
            return response.data;
        },
        getNextPageParam: (lastPage) => {
            return lastPage.hasMore ? lastPage.page + 1 : undefined;
        },
        initialPageParam: 1,
        staleTime: 10 * 60 * 1000, // 10 minutes
    });
}
