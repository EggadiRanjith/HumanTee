/**
 * useOrderFilters Hook
 * Manages URL-based filter state for orders
 * Pattern from frontend-store
 */

'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useCallback } from 'react';

type OrderStatus = 'pending_payment' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'payment_failed' | 'ALL';

interface OrderFilters {
    search: string;
    status: OrderStatus;
    sortBy: 'date' | 'total';
    sortOrder: 'asc' | 'desc';
    page: number;
}

export function useOrderFilters() {
    const searchParams = useSearchParams();
    const router = useRouter();

    // Extract current filters from URL
    const filters: OrderFilters = {
        search: searchParams.get('search') || '',
        status: (searchParams.get('status') as OrderStatus) || 'ALL',
        sortBy: (searchParams.get('sortBy') as 'date' | 'total') || 'date',
        sortOrder: (searchParams.get('sortOrder') as 'asc' | 'desc') || 'desc',
        page: parseInt(searchParams.get('page') || '1'),
    };

    // Update filters in URL
    const setFilters = useCallback((newFilters: Partial<OrderFilters>) => {
        const params = new URLSearchParams(searchParams.toString());

        Object.entries(newFilters).forEach(([key, value]) => {
            if (value && value !== 'ALL') {
                params.set(key, value.toString());
            } else {
                params.delete(key);
            }
        });

        router.push(`?${params.toString()}`);
    }, [searchParams, router]);

    // Clear all filters
    const clearFilters = useCallback(() => {
        router.push(window.location.pathname);
    }, [router]);

    // Count active filters
    const activeFilterCount = [
        filters.search,
        filters.status !== 'ALL' ? filters.status : null,
    ].filter(Boolean).length;

    return {
        filters,
        setFilters,
        clearFilters,
        activeFilterCount,
    };
}
