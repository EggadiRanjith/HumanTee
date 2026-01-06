import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/lib/toast';

interface OptimisticUpdateOptions<TData, TVariables> {
    queryKey: string[];
    mutationFn: (variables: TVariables) => Promise<TData>;
    onSuccess?: (data: TData) => void;
    onError?: (error: any) => void;
    updateFn?: (oldData: any, variables: TVariables) => any;
}

/**
 * Optimistic Update Hook
 * Updates UI immediately, rolls back on error
 * Provides better UX for admin actions
 */
export function useOptimisticUpdate<TData = any, TVariables = any>({
    queryKey,
    mutationFn,
    onSuccess,
    onError,
    updateFn,
}: OptimisticUpdateOptions<TData, TVariables>) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn,

        onMutate: async (variables) => {
            // Cancel outgoing refetches
            await queryClient.cancelQueries({ queryKey });

            // Snapshot previous value
            const previousData = queryClient.getQueryData(queryKey);

            // Optimistically update if updateFn provided
            if (updateFn && previousData) {
                const optimisticData = updateFn(previousData, variables);
                queryClient.setQueryData(queryKey, optimisticData);
            }

            // Return context with previous data
            return { previousData };
        },

        onError: (err, variables, context) => {
            // Rollback on error
            if (context?.previousData) {
                queryClient.setQueryData(queryKey, context.previousData);
            }

            toast.error('Action failed. Changes have been reverted.');
            onError?.(err);
        },

        onSuccess: (data) => {
            toast.success('Changes saved successfully');
            onSuccess?.(data);
        },

        onSettled: () => {
            // Refetch to ensure consistency
            queryClient.invalidateQueries({ queryKey });
        },
    });
}

/**
 * Optimistic Delete Hook
 * Removes item from list immediately, restores on error
 */
export function useOptimisticDelete<TData = any>(
    queryKey: string[],
    deleteFn: (id: string) => Promise<void>,
    options?: {
        onSuccess?: () => void;
        onError?: (error: any) => void;
    }
) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteFn,

        onMutate: async (id: string) => {
            await queryClient.cancelQueries({ queryKey });

            const previousData = queryClient.getQueryData(queryKey);

            // Remove item from list
            queryClient.setQueryData(queryKey, (old: any) => {
                if (Array.isArray(old)) {
                    return old.filter((item: any) => item.id !== id);
                }
                return old;
            });

            return { previousData };
        },

        onError: (err, id, context) => {
            if (context?.previousData) {
                queryClient.setQueryData(queryKey, context.previousData);
            }

            toast.error('Delete failed. Item has been restored.');
            options?.onError?.(err);
        },

        onSuccess: () => {
            toast.success('Item deleted successfully');
            options?.onSuccess?.();
        },

        onSettled: () => {
            queryClient.invalidateQueries({ queryKey });
        },
    });
}
