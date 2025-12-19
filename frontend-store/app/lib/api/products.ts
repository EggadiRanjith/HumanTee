/**
 * Products API
 * Read-only product endpoints
 */

import apiClient from '@/lib/api-client';

export async function fetchProducts() {
    const res = await apiClient.get('/products');
    return res.data.products;
}

export async function fetchProductBySlug(slug: string) {
    const res = await apiClient.get(`/products/${slug}`);
    return res.data;
}
