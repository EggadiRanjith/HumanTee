// @ts-nocheck
/**
 * React Query Provider
 * Wraps the app with QueryClientProvider for data fetching
 */

'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';

export function QueryProvider({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        staleTime: 5 * 60 * 1000, // 5 minutes - data stays fresh longer
                        gcTime: 10 * 60 * 1000, // 10 minutes - cache retention
                        retry: 1, // Only retry once on failure
                        refetchOnWindowFocus: false, // Don't refetch when switching tabs
                        refetchOnMount: false, // Don't refetch when component mounts
                        refetchOnReconnect: true, // Refetch on reconnect
                    },
                    mutations: {
                        retry: 1, // Retry mutations once
                        retryDelay: 1000,
                    },
                },
            })
    );

    return (
        <QueryClientProvider client={queryClient}>
            {children}
            {/* DevTools only in development */}
            {process.env.NODE_ENV === 'development' && (
                <ReactQueryDevtools initialIsOpen={false} position={"bottom-right" as const} />
            )}
        </QueryClientProvider>
    );
}
