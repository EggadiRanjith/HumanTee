/**
 * Orders Filters Hook
 * Manages filter state with URL synchronization
 */

"use client";

import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useCallback } from 'react';
import { OrderFilters } from '../types';

export function useOrdersFilters() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    // Parse current filters from URL
    const filters: OrderFilters = {
        status: (searchParams.get('status') as any) || 'all',
        search: searchParams.get('search') || undefined,
        sortBy: (searchParams.get('sortBy') as any) || 'newest',
        page: parseInt(searchParams.get('page') || '1'),
        limit: 12,
    };

    // Update filters in URL
    const setFilters = useCallback((newFilters: Partial<OrderFilters>) => {
        const params = new URLSearchParams(searchParams.toString());

        Object.entries(newFilters).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '' && value !== 'all') {
                params.set(key, String(value));
            } else {
                params.delete(key);
            }
        });

        router.push(`${pathname}?${params.toString()}`, { scroll: false });
    }, [searchParams, router, pathname]);

    // Clear all filters
    const clearFilters = useCallback(() => {
        router.push(pathname, { scroll: false });
    }, [router, pathname]);

    // Check if any filters are active
    const hasActiveFilters = !!(
        (filters.status && filters.status !== 'all') ||
        filters.search ||
        (filters.sortBy && filters.sortBy !== 'newest')
    );

    return {
        filters,
        setFilters,
        clearFilters,
        hasActiveFilters,
    };
}
