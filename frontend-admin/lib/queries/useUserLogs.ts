/**
 * User Audit Logs Query Hook
 * React Query hook for user activity logs
 */

import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';

export function useUserAuditLogs() {
    return useQuery({
        queryKey: ['user-audit-logs'],
        queryFn: async () => {
            const response = await apiClient.get('/admin/user-audit-logs?limit=1000');
            return response.data.logs || [];
        },
        staleTime: 60 * 1000, // 1 minute
        placeholderData: (previousData) => previousData,
    });
}
