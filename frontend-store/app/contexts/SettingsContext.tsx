'use client';

import { createContext, useContext, ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';
import { publicSettingsApi } from '@/lib/app/api/public-settings';
import { queryKeys } from '@/lib/queryKeys';

interface SettingsContextType {
    settings: any;
    loading: boolean;
    error: string | null;
}

const SettingsContext = createContext<SettingsContextType>({
    settings: null,
    loading: true,
    error: null
});

export function SettingsProvider({ children }: { children: ReactNode }) {
    // ✅ OPTIMIZED: Use React Query for persistent caching across page navigations
    const { data: settings, isLoading: loading, error } = useQuery({
        queryKey: queryKeys.settings,
        queryFn: async () => {
            console.log('🔄 Fetching settings from API...');
            const data = await publicSettingsApi.getAll();
            return data;
        },
        staleTime: Infinity, // Never consider data stale - settings rarely change
        gcTime: 24 * 60 * 60 * 1000, // 24 hours - keep in cache even when unused
        refetchOnMount: false, // Don't refetch on component mount
        refetchOnWindowFocus: false, // Don't refetch on window focus
        refetchOnReconnect: false, // Don't refetch on reconnect
        retry: 1, // Only retry once on failure
    });

    return (
        <SettingsContext.Provider value={{
            settings: settings || null,
            loading,
            error: error ? (error as Error).message : null
        }}>
            {children}
        </SettingsContext.Provider>
    );
}

export const useSettings = () => useContext(SettingsContext);
