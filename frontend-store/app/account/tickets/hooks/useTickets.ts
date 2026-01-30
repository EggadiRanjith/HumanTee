/**
 * Tickets Hook
 * Manages ticket fetching and state
 */

"use client";

import { useState, useEffect } from 'react';
import apiClient from '@/lib/api-client';
import { logError } from '@/lib/logger';
import { Ticket, TicketFilters } from '../types';

export function useTickets(filters: TicketFilters = {}) {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const [totalPages, setTotalPages] = useState(1);
    const [retryCount, setRetryCount] = useState(0);

    useEffect(() => {
        const fetchTickets = async () => {
            setIsLoading(true);
            setError(null);

            try {
                // Simplified: Always fetch all user tickets
                // If orderId is provided, filter by that order's tickets
                const url = filters.orderId
                    ? `/tickets/order/${filters.orderId}`
                    : '/tickets';

                const response = await apiClient.get(url);
                setTickets(response.data.tickets || response.data);
                setTotalPages(response.data.totalPages || 1);
            } catch (err) {
                logError(err, 'Failed to fetch tickets');
                setError(err as Error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchTickets();
    }, [filters.orderId, retryCount]);

    const retry = () => {
        setRetryCount(prev => prev + 1);
    };

    return { tickets, isLoading, error, totalPages, retry };
}
