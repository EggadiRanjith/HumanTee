import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';


interface FeatureToggles {
    discounts_enabled: boolean;
    tickets_enabled: boolean;
    user_audit_logs_enabled: boolean;
    admin_audit_logs_enabled: boolean;
}

export function useFeatureToggles() {
    return useQuery({
        queryKey: ['settings', 'features'],
        queryFn: async () => {
            const response = await apiClient.get('/admin/settings/features');
            return response.data as FeatureToggles;
        },
        staleTime: 30 * 60 * 1000, // 30 minutes (matches settings cache policy)
        placeholderData: (previousData) => previousData,
    });
}

export function useUpdateFeatureToggles() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (features: FeatureToggles) => {
            const response = await apiClient.post('/admin/settings/features', features);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['settings', 'features'] });
        },
    });
}
