import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queryKeys';
import apiClient from '@/lib/api-client';

export function useUser() {
    return useQuery({
        queryKey: queryKeys.user,
        queryFn: async () => {
            const response = await apiClient.get('/auth/me');
            return response.data;
        },
        staleTime: 5 * 60 * 1000,
    });
}
