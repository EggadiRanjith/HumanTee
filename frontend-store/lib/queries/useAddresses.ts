import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queryKeys';
import apiClient from '@/lib/api-client';

/**
 * Single source of truth for GET /shipping-addresses.
 * Use everywhere addresses are needed; avoids duplicate API calls.
 */
export function useAddresses(userId: string) {
    return useQuery({
        queryKey: queryKeys.addresses(userId),
        queryFn: async () => {
            const response = await apiClient.get('/shipping-addresses');
            return response.data ?? [];
        },
        enabled: !!userId,
        staleTime: 30 * 60 * 1000,
        gcTime: 60 * 60 * 1000,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        placeholderData: (previousData) => previousData,
    });
}
