/**
 * Low Stock Products Hook
 * Fetches products that are at or below their low stock threshold
 */

import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';

export interface LowStockProduct {
    id: string;
    name: string;
    slug: string;
    stock: number;
    threshold: number;
    status: string;
}

export function useLowStockProducts() {
    return useQuery<LowStockProduct[]>({
        queryKey: ['low-stock-products'],
        queryFn: async () => {
            const response = await apiClient.get('/admin/products/low-stock');
            return response.data || [];
        },
        staleTime: 60000, // 1 minute
        refetchInterval: 300000, // Refetch every 5 minutes
    });
}
