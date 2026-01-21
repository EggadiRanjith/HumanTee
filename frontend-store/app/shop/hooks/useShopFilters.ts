/**
 * Shop Filters Hook
 * Manages filter state via URL query parameters
 * Enables shareable links and browser history support
 */

"use client";

import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useCallback, useMemo } from 'react';

export interface ShopFilters {
    category?: string;
    collection?: string;
    sort?: string;
    page?: number;
}

export function useShopFilters() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    // Parse current filters from URL
    const filters: ShopFilters = useMemo(() => ({
        category: searchParams.get('category') || undefined,
        collection: searchParams.get('collection') || undefined,
        sort: searchParams.get('sort') || undefined,
        page: parseInt(searchParams.get('page') || '1'),
    }), [searchParams]);

    // Update filters in URL (replace, don't push - prevents double-back issue)
    const setFilters = useCallback((newFilters: Partial<ShopFilters>) => {
        const params = new URLSearchParams(searchParams.toString());

        // Update or remove each filter
        Object.entries(newFilters).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                params.set(key, String(value));
            } else {
                params.delete(key);
            }
        });

        // Replace URL (doesn't add to history stack)
        router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    }, [searchParams, router, pathname]);

    // Clear all filters
    const clearFilters = useCallback(() => {
        router.replace(pathname, { scroll: false });
    }, [router, pathname]);

    // Check if any filters are active
    const hasActiveFilters = !!(filters.category || filters.collection || filters.sort);

    // Get active filter count
    const activeFilterCount = [filters.category, filters.collection, filters.sort].filter(Boolean).length;

    return {
        filters,
        setFilters,
        clearFilters,
        hasActiveFilters,
        activeFilterCount,
    };
}
