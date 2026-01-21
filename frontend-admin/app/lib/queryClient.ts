import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            // Caching strategy
            staleTime: 2 * 60 * 1000,      // 2 minutes - data considered fresh
            gcTime: 5 * 60 * 1000,         // 5 minutes - garbage collection time

            // Retry configuration
            retry: 3,
            retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),

            // Refetching behavior
            refetchOnWindowFocus: false,   // Don't refetch on window focus (admin app)
            refetchOnReconnect: true,      // Refetch on reconnect
            refetchOnMount: true,          // Refetch on component mount

            // Network mode
            networkMode: 'online',
        },
        mutations: {
            retry: 1,
            networkMode: 'online',
        },
    },
})
