/**
 * Audit Logs Query Hooks
 * React Query hooks for audit logs data
 */

import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queryKeys';
import apiClient from '@/lib/api-client';

interface AuditLogsFilters {
    action?: string;
    userId?: string;
    startDate?: string;
    endDate?: string;
}

export function useAuditLogs(filters: AuditLogsFilters = {}) {
    return useQuery({
        queryKey: queryKeys.auditLogs(filters),
        queryFn: async () => {
            const response = await apiClient.get('/admin/audit-logs', {
                params: filters
            });
            return response.data;
        },
        staleTime: 60 * 1000, // 1 minute
    });
}
