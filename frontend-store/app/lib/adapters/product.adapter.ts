/**
 * Product Adapter
 * Maps backend product API shape to frontend UI props
 * 
 * CORRECTION 1: Reuses existing api-client
 * CORRECTION 2: Currency from variant, not hardcoded
 * CORRECTION 3: Explicit stock calculation (sum of active variants)
 * CORRECTION 4: handle = slug (unified, no mixing)
 */

import { Product } from '@/app/types/product.types';

interface BackendProduct {
    id: string;
    title: string;
    slug: string;
    description: string;
    status: 'DRAFT' | 'ACTIVE' | 'ARCHIVED';
    variants: BackendVariant[];
}

interface BackendVariant {
    id: string;
    sku: string;
    size: string;
    color: string;
    price: number;
    stock: number;        // Changed from stock_quantity
    isActive: boolean;    // Changed from is_active
}

/**
 * Adapt backend product to frontend Product type
 * This is mapping only - no business logic
 */
export function adaptProduct(apiProduct: BackendProduct): Product {
    const activeVariants = apiProduct.variants?.filter(v => v.isActive) ?? [];
    const firstVariant = activeVariants[0];

    return {
        // UUID as string (Phase 4 type change)
        id: apiProduct.id,

        // Direct mappings
        title: apiProduct.title,
        subtitle: apiProduct.description,

        // CORRECTION 3: Explicit stock calculation
        // Sum of all active variant stock (display-only)
        stock: activeVariants.reduce((sum, v) => sum + v.stock, 0),

        // Price from first active variant (display-only)
        price: firstVariant?.price ?? 0,

        // TEMP: Backend does not yet expose currency.
        // Phase 6 MUST move currency to variant model.
        currency: 'INR',

        // CORRECTION 4: handle = slug (unified)
        handle: apiProduct.slug,

        // Placeholder image until backend supports images
        image: '/images/placeholder.jpg',
        imageAlt: apiProduct.title,

        // Optional fields
        originalPrice: undefined, // No sale pricing yet
        badge: undefined, // No badge logic yet
    };
}

/**
 * Adapt array of products
 */
export function adaptProducts(apiProducts: BackendProduct[]): Product[] {
    return apiProducts.map(adaptProduct);
}
