'use client';
import { useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';

export function useCustomerActions() {
    const queryClient = useQueryClient();

    const refreshCustomers = useCallback(() => {
        queryClient.invalidateQueries({ queryKey: ['admin', 'customers'] });
    }, [queryClient]);

    return { refreshCustomers };
}
