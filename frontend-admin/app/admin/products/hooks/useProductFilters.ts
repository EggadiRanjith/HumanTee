/**
 * useProductFilters Hook
 * Manages URL-based filter state for products
 */

'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useCallback } from 'react';

interface ProductFilters {
    search: string;
    category: string;
    status: 'active' | 'draft' | 'archived' | 'ALL';
    sortBy: 'name' | 'price' | 'stock';
    sortOrder: 'asc' | 'desc';
    page: number;
}

export function useProductFilters() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const filters: ProductFilters = {
        search: searchParams.get('search') || '',
        category: searchParams.get('category') || '',
        status: (searchParams.get('status') as any) || 'ALL',
        sortBy: (searchParams.get('sortBy') as any) || 'name',
        sortOrder: (searchParams.get('sortOrder') as any) || 'asc',
        page: parseInt(searchParams.get('page') || '1'),
    };

    const setFilters = useCallback((newFilters: Partial<ProductFilters>) => {
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

    const clearFilters = useCallback(() => {
        router.push(window.location.pathname);
    }, [router]);

    const activeFilterCount = [
        filters.search,
        filters.category,
        filters.status !== 'ALL' ? filters.status : null,
    ].filter(Boolean).length;

    return {
        filters,
        setFilters,
        clearFilters,
        activeFilterCount,
    };
}
