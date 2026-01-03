/**
 * useProductActions Hook
 * Manages product-related actions
 */

'use client';

import { useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';

export function useProductActions() {
    const queryClient = useQueryClient();

    const exportProducts = useCallback((products: any[]) => {
        const csv = [
            ['Name', 'SKU', 'Price', 'Stock', 'Status'].join(','),
            ...products.map(p => [
                p.name,
                p.sku || 'N/A',
                p.price,
                p.variants?.reduce((sum: number, v: any) => sum + (v.stockQuantity || 0), 0) || 0,
                p.status,
            ].join(','))
        ].join('\n');

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `products-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
    }, []);

    const refreshProducts = useCallback(() => {
        queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
    }, [queryClient]);

    const bulkUpdateStatus = useCallback(async (productIds: string[], status: string) => {
        // TODO: Implement bulk status update
        await refreshProducts();
    }, [refreshProducts]);

    return {
        exportProducts,
        refreshProducts,
        bulkUpdateStatus,
    };
}
