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

    useEffect(() => {
        const fetchTickets = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const params = new URLSearchParams();

                // Handle orderId filter
                const url = filters.orderId
                    ? `/tickets/order/${filters.orderId}`
                    : '/tickets';

                // Only add filters if NOT fetching for a specific order
                // (order endpoint returns ALL tickets for that order)
                if (!filters.orderId) {
                    if (filters.status && filters.status !== 'all') {
                        params.append('status', filters.status);
                    }
                    if (filters.category && filters.category !== 'all') {
                        params.append('category', filters.category);
                    }
                    if (filters.search) {
                        params.append('search', filters.search);
                    }
                    if (filters.sortBy) {
                        params.append('sortBy', filters.sortBy);
                    }
                    if (filters.page) {
                        params.append('page', String(filters.page));
                    }
                    if (filters.limit) {
                        params.append('limit', String(filters.limit));
                    }
                }

                const queryString = params.toString();
                const fullUrl = queryString ? `${url}?${queryString}` : url;

                const response = await apiClient.get(fullUrl);
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
    }, [filters.orderId, filters.status, filters.category, filters.search, filters.sortBy, filters.page, filters.limit]);

    const retry = () => {
        setError(null);
        setIsLoading(true);
    };

    return { tickets, isLoading, error, totalPages, retry };
}
