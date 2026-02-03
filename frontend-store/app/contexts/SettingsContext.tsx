'use client';

import { createContext, useContext, ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';
import { publicSettingsApi } from '@/lib/app/api/public-settings';
import { queryKeys } from '@/lib/queryKeys';

interface FeatureFlags {
    discountsEnabled: boolean;
    ticketsEnabled: boolean;
}

interface Settings {
    features?: FeatureFlags;
    [key: string]: any;
}

interface SettingsContextType {
    settings: Settings | null;
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
            const data = await publicSettingsApi.getAll();

            // Add default feature flags if not present
            if (!data.features) {
                data.features = {};
            }
            data.features.discountsEnabled = data.features?.discounts_enabled ?? true;
            data.features.ticketsEnabled = data.features?.tickets_enabled ?? true;

            return data;
        },
        staleTime: 5 * 60 * 1000, // 5 minutes - balanced freshness and performance
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
