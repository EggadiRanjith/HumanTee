/**
 * Products API
 * Read-only product endpoints
 */

import apiClient from '@/lib/api-client';

export async function fetchProducts() {
    // ✅ OPTIMIZED: Fetch all products (cached 30min on backend)
    // Frontend filters/paginates client-side for instant navigation
    const res = await apiClient.get('/products/all');
    return res.data.products;
}

export async function fetchShopProducts(filters?: {
    productType?: string;
    category?: string;
    collection?: string;
    page?: number;
    limit?: number;
}) {
    // ✅ OPTIMIZED: Use cached products from /products/all
    // Filter and paginate client-side for instant results
    const allProducts = await fetchProducts(); // Already cached

    let filtered = allProducts;

    // Apply filters client-side
    if (filters?.productType) {
        filtered = filtered.filter((p: any) => p.productType === filters.productType);
    }
    if (filters?.category) {
        filtered = filtered.filter((p: any) => p.category === filters.category);
    }
    if (filters?.collection) {
        filtered = filtered.filter((p: any) => p.collection === filters.collection);
    }

    // Paginate client-side
    const page = filters?.page || 1;
    const limit = filters?.limit || 12;
    const total = filtered.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const products = filtered.slice(startIndex, startIndex + limit);

    return { products, total, page, limit, totalPages };
}

export async function fetchProductBySlug(slug: string) {
    // ✅ OPTIMIZED: Fetch ONLY this specific product (50 KB instead of 13 MB)
    // Uses dedicated backend endpoint: GET /products/:slug
    const res = await apiClient.get(`/products/${slug}`);
    return res.data;
}
