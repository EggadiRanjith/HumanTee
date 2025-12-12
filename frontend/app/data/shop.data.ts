/**
 * Shop Products Data
 * Complete product catalog for the shop page
 * TODO: Replace with API call to fetch products from backend
 */

import { Product } from '@/app/types/product.types';

// Empty array - ready for API integration
export const shopProducts: Product[] = [];

/**
 * Product Categories for filtering
 */
export const productCategories = [
    { id: 'all', label: 'All Products', count: 0 },
    { id: 'bestseller', label: 'Bestsellers', count: 0 },
    { id: 'new', label: 'New Arrivals', count: 0 },
    { id: 'sale', label: 'On Sale', count: 0 },
] as const;

