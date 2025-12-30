/**
 * Admin Settings Query Hooks
 * React Query hooks for settings data fetching
 */

import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queryKeys';
import { settingsApi } from '@/lib/api/settings';

export function useAdminSettings(section: string) {
    return useQuery({
        queryKey: queryKeys.settings(section),
        queryFn: async () => {
            const data = await settingsApi.getSection(section);
            return data;
        },
        enabled: !!section,
        staleTime: 5 * 60 * 1000, // 5 minutes - settings don't change often
    });
}
