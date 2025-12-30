/**
 * Admin Products Query Hooks
 * React Query hooks for products data fetching
 */

import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queryKeys';
import { getAllProducts, getProduct } from '@/lib/api/products';

interface ProductFilters {
    category?: string;
    status?: string;
    search?: string;
}

export function useAdminProducts(filters: ProductFilters = {}) {
    return useQuery({
        queryKey: queryKeys.products(filters),
        queryFn: async () => {
            const data = await getAllProducts();

            // Apply filters
            let filtered = data;

            if (filters.category && filters.category !== 'ALL') {
                filtered = filtered.filter((p: any) => p.category === filters.category);
            }

            if (filters.status && filters.status !== 'ALL') {
                filtered = filtered.filter((p: any) => p.status === filters.status);
            }

            if (filters.search) {
                const search = filters.search.toLowerCase();
                filtered = filtered.filter((p: any) =>
                    p.name.toLowerCase().includes(search) ||
                    p.sku?.toLowerCase().includes(search)
                );
            }

            return filtered;
        },
        staleTime: 60 * 1000, // 1 minute
    });
}

export function useAdminProductDetail(productId: string) {
    return useQuery({
        queryKey: queryKeys.productDetail(productId),
        queryFn: async () => {
            const product = await getProduct(productId);
            return product;
        },
        enabled: !!productId,
        staleTime: 2 * 60 * 1000, // 2 minutes
    });
}
