/**
 * SWR Data Fetching Hooks
 * Client-side data fetching with automatic caching and revalidation
 */

import useSWR from 'swr';
import type { Product } from '@/app/types/product.types';

// SWR configuration
const swrConfig = {
    revalidateOnFocus: false, // Don't refetch on window focus
    revalidateOnReconnect: false, // Don't refetch on reconnect
    dedupingInterval: 60000, // Dedupe requests within 1 minute
    focusThrottleInterval: 300000, // Throttle focus revalidation to 5 minutes
};

// Fetcher function for SWR
const fetcher = async (url: string) => {
    const res = await fetch(url);

    if (!res.ok) {
        const error = new Error('Failed to fetch data');
        throw error;
    }

    return res.json();
};

/**
 * Hook to fetch products with SWR caching
 */
export function useProducts() {
    const { data, error, isLoading, mutate } = useSWR<Product[]>(
        '/api/products',
        fetcher,
        swrConfig
    );

    return {
        products: data,
        isLoading,
        isError: error,
        refetch: mutate,
    };
}

/**
 * Hook to fetch a single product by ID with SWR caching
 */
export function useProduct(id: string | number) {
    const { data, error, isLoading, mutate } = useSWR(
        id ? `/api/products/${id}` : null,
        fetcher,
        swrConfig
    );

    return {
        product: data,
        isLoading,
        isError: error,
        refetch: mutate,
    };
}

/**
 * Hook to fetch featured products with SWR caching
 */
export function useFeaturedProducts() {
    const { data, error, isLoading } = useSWR<Product[]>(
        '/api/products/featured',
        fetcher,
        {
            ...swrConfig,
            dedupingInterval: 300000, // 5 minutes for featured (changes less often)
        }
    );

    return {
        products: data,
        isLoading,
        isError: error,
    };
}

/**
 * Preload data for instant navigation
 */
export function preloadProduct(id: string | number) {
    // This prefetches the data and caches it
    return fetcher(`/api/products/${id}`);
}
