import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queryKeys';
import apiClient from '@/lib/api-client';

export function useAddresses(userId: string) {
    return useQuery({
        queryKey: queryKeys.addresses(userId),
        queryFn: async () => {
            const response = await apiClient.get('/shipping-addresses');
            return response.data;
        },
        enabled: !!userId,
        staleTime: 5 * 60 * 1000,
    });
}
