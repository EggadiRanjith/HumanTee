'use client';
import { useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';

export function useTicketActions() {
    const queryClient = useQueryClient();

    const refreshTickets = useCallback(() => {
        queryClient.invalidateQueries({ queryKey: ['admin', 'tickets'] });
    }, [queryClient]);

    return { refreshTickets };
}
