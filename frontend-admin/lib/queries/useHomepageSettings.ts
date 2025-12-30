/**
 * Homepage Settings Query Hooks
 * React Query hooks for homepage settings data fetching and mutations
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queryKeys';
import { settingsApi } from '@/lib/api/settings';

export function useHomepageSettings() {
    return useQuery({
        queryKey: queryKeys.settings('homepage'),
        queryFn: async () => {
            const data = await settingsApi.getSection('homepage');
            return data;
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
}

export function useUpdateHomepageSettings() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (payload: any) => {
            await settingsApi.saveSection('homepage', payload);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.settings('homepage') });
        },
    });
}
