/**
 * Orders Hook
 * Manages order fetching and state
 */

"use client";

import { useState, useEffect } from 'react';
import apiClient from '@/lib/api-client';
import { logError } from '@/lib/logger';
import { Order, OrderFilters } from '../types';

export function useOrders(filters: OrderFilters = {}) {
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        const fetchOrders = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const params = new URLSearchParams();

                if (filters.status && filters.status !== 'all') {
                    params.append('status', filters.status);
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

                const response = await apiClient.get(`/orders?${params.toString()}`);
                setOrders(response.data.orders || response.data);
                setTotalPages(response.data.totalPages || 1);
            } catch (err) {
                logError(err, 'Failed to fetch orders');
                setError(err as Error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchOrders();
    }, [filters.status, filters.search, filters.sortBy, filters.page, filters.limit]);

    const retry = () => {
        setError(null);
        setIsLoading(true);
    };

    return { orders, isLoading, error, totalPages, retry };
}
