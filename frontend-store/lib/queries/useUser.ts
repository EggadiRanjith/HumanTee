import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queryKeys';
import apiClient from '@/lib/api-client';

interface UseUserOptions {
    enabled?: boolean;
}

/**
 * Single source of truth for GET /auth/me.
 * Use everywhere user profile is needed; avoids duplicate API calls.
 */
export function useUser(options?: UseUserOptions) {
    return useQuery({
        queryKey: queryKeys.user,
        queryFn: async () => {
            const response = await apiClient.get('/auth/me');
            return response.data;
        },
        enabled: options?.enabled !== false,
        staleTime: 30 * 60 * 1000,
        gcTime: 60 * 60 * 1000,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        placeholderData: (previousData) => previousData,
    });
}
