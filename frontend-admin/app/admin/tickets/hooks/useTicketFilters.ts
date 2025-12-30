'use client';
import { useSearchParams, useRouter } from 'next/navigation';
import { useCallback } from 'react';

export function useTicketFilters() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const filters = {
        search: searchParams.get('search') || '',
        status: searchParams.get('status') || 'ALL',
        priority: searchParams.get('priority') || 'ALL',
    };

    const setFilters = useCallback((newFilters: any) => {
        const params = new URLSearchParams(searchParams.toString());
        Object.entries(newFilters).forEach(([key, value]) => {
            if (value && value !== 'ALL') params.set(key, value.toString());
            else params.delete(key);
        });
        router.push(`?${params.toString()}`);
    }, [searchParams, router]);

    const clearFilters = useCallback(() => router.push(window.location.pathname), [router]);

    return { filters, setFilters, clearFilters };
}
