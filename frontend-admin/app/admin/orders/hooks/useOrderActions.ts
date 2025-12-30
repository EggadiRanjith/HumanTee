/**
 * useOrderActions Hook
 * Manages order-related actions (export, bulk operations, etc.)
 */

'use client';

import { useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';

export function useOrderActions() {
    const queryClient = useQueryClient();

    // Export orders to CSV
    const exportOrders = useCallback((orders: any[]) => {
        const csv = [
            ['Order Number', 'Customer', 'Email', 'Total', 'Status', 'Date'].join(','),
            ...orders.map(order => [
                order.orderNumber,
                order.address.fullName,
                order.address.email,
                order.totalAmount,
                order.status,
                new Date(order.createdAt).toLocaleDateString(),
            ].join(','))
        ].join('\n');

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `orders-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
    }, []);

    // Refresh orders data
    const refreshOrders = useCallback(() => {
        queryClient.invalidateQueries({ queryKey: ['admin', 'orders'] });
    }, [queryClient]);

    // Bulk update status (future implementation)
    const bulkUpdateStatus = useCallback(async (orderIds: string[], status: string) => {
        // TODO: Implement bulk status update API call
        console.log('Bulk update:', orderIds, status);
        await refreshOrders();
    }, [refreshOrders]);

    return {
        exportOrders,
        refreshOrders,
        bulkUpdateStatus,
    };
}
