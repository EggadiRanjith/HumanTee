/**
 * Product Details Data
 * Complete product information for product detail pages
 * TODO: Replace with API call to fetch product details from backend
 */

import { ProductDetail } from '@/app/types/product.types';

// Empty array - ready for API integration
export const productDetails: ProductDetail[] = [];

/**
 * Get product detail by ID
 * TODO: Replace with API call
 */
export function getProductDetail(id: number): ProductDetail | undefined {
    return productDetails.find(p => p.id === id);
}

