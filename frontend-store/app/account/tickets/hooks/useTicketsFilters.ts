/**
 * Tickets Filters Hook
 * Manages filter state with URL synchronization
 */

"use client";

import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useCallback } from 'react';
import { TicketFilters } from '../types';

export function useTicketsFilters() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    // Parse current filters from URL
    const filters: TicketFilters = {
        status: (searchParams.get('status') as any) || 'all',
        category: (searchParams.get('category') as any) || 'all',
        search: searchParams.get('search') || undefined,
        sortBy: (searchParams.get('sortBy') as any) || undefined, // Don't set default
        page: searchParams.get('page') ? parseInt(searchParams.get('page')!) : undefined, // Optional
        orderId: searchParams.get('orderId') || undefined,
        limit: undefined, // Backend doesn't support limit param
    };

    // Update filters in URL
    const setFilters = useCallback((newFilters: Partial<TicketFilters>) => {
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
        (filters.category && filters.category !== 'all') ||
        filters.search
    );

    return {
        filters,
        setFilters,
        clearFilters,
        hasActiveFilters,
    };
}
