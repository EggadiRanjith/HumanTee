/**
 * Products API
 * Read-only product endpoints
 */

import apiClient from '@/lib/api-client';

export async function fetchProducts() {
    const res = await apiClient.get('/products');
    return res.data.products;
}

export async function fetchShopProducts(filters?: {
    productType?: string;
    category?: string;
    collection?: string;
}) {
    const params = new URLSearchParams();
    if (filters?.productType) params.append('productType', filters.productType);
    if (filters?.category) params.append('category', filters.category);
    if (filters?.collection) params.append('collection', filters.collection);

    const queryString = params.toString();
    const url = queryString ? `/products/shop?${queryString}` : '/products/shop';

    const res = await apiClient.get(url);
    return res.data.products;
}

export async function fetchProductBySlug(slug: string) {
    const res = await apiClient.get(`/products/${slug}`);
    return res.data;
}
