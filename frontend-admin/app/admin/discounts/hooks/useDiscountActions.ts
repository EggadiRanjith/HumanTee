'use client';
import { useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';

export function useDiscountActions() {
    const queryClient = useQueryClient();

    const refreshDiscounts = useCallback(() => {
        queryClient.invalidateQueries({ queryKey: ['admin', 'discounts'] });
    }, [queryClient]);

    return { refreshDiscounts };
}
