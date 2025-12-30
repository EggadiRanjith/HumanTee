/**
 * Analytics Query Hooks
 * React Query hooks for analytics data
 */

import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queryKeys';
import apiClient from '@/lib/api-client';

export function useAnalytics(timeRange: string = '7d') {
    return useQuery({
        queryKey: queryKeys.analytics(timeRange),
        queryFn: async () => {
            const response = await apiClient.get('/admin/analytics', {
                params: { timeRange }
            });
            return response.data;
        },
        staleTime: 2 * 60 * 1000, // 2 minutes
    });
}
