import { QueryClient } from '@tanstack/react-query';

/**
 * React Query Configuration
 * Optimized for admin panel with proper caching and deduplication
 */
export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            // Cache configuration
            staleTime: 5 * 60 * 1000, // 5 minutes - data is fresh
            gcTime: 10 * 60 * 1000, // 10 minutes - keep in cache (formerly cacheTime)

            // Refetch configuration
            refetchOnWindowFocus: false, // Don't refetch on window focus (admin panel)
            refetchOnReconnect: true, // Refetch when internet reconnects
            refetchOnMount: false, // Don't refetch if data is fresh

            // Error handling
            retry: 1, // Retry failed requests once
            retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),

            // Performance
            networkMode: 'online', // Only run queries when online
        },
        mutations: {
            // Mutations should not retry automatically
            retry: 0,
            networkMode: 'online',
        },
    },
});
