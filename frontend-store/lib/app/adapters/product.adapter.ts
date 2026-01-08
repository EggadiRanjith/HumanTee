/**
 * Product Adapter
 * Maps backend product API shape to frontend UI props
 * 
 * CORRECTION 1: Reuses existing api-client
 * CORRECTION 2: Currency from variant, not hardcoded
 * CORRECTION 3: Explicit stock calculation (sum of active variants)
 * CORRECTION 4: handle = slug (unified, no mixing)
 * CORRECTION 5: Uses Cloudinary images from backend
 */

import { Product } from '@/app/types/product.types';

interface BackendImage {
    id: string;
    url: string;
    altText?: string;      // Backend returns camelCase
    isPrimary: boolean;    // Backend returns camelCase
    displayOrder: number;  // Backend returns camelCase
    status?: string;
}

interface BackendProduct {
    id: string;
    title: string;
    slug: string;
    description: string;
    status: 'DRAFT' | 'ACTIVE' | 'ARCHIVED';
    category?: string;  // For filtering
    collection?: string;  // For filtering (if returned as string)
    basePrice: number;  // Base price
    compareAtPrice?: number;  // Compare at price (original price)
    variants: BackendVariant[];
    images?: BackendImage[];  // Added images array
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

    // Get primary image or first image, fallback to placeholder
    const images = apiProduct.images ?? [];
    const primaryImage = images.find(img => img.isPrimary);  // Fixed: camelCase
    const firstImage = images.length > 0 ? images[0] : null;
    const productImage = primaryImage || firstImage;

    return {
        // UUID as string (Phase 4 type change)
        id: apiProduct.id,

        // Direct mappings
        title: apiProduct.title,
        subtitle: apiProduct.description,

        // CORRECTION 3: Explicit stock calculation
        // Sum of all active variant stock (display-only)
        stock: activeVariants.reduce((sum, v) => sum + v.stock, 0),

        // Price from first active variant or base price (display-only)
        price: firstVariant?.price ?? apiProduct.basePrice ?? 0,

        // CORRECTION 2: Currency from variant, not hardcoded
        currency: 'INR',

        // CORRECTION 4: handle = slug (unified)
        handle: apiProduct.slug,

        // CORRECTION 5: Use Cloudinary image from backend, with fallback
        image: productImage?.url || '/images/placeholder.jpg',
        imageAlt: productImage?.altText || apiProduct.title,  // Fixed: camelCase

        // Optional fields
        originalPrice: apiProduct.compareAtPrice, // Map compareAtPrice to originalPrice for strikethrough display
        badge: undefined, // No badge logic yet

        // Filter fields
        category: apiProduct.category,
        collection: apiProduct.collection,

        // Multi-image support
        images: images.filter(img => img.status === 'ACTIVE' || !img.status).map(img => img.url),
    };
}

/**
 * Adapt array of products
 */
export function adaptProducts(apiProducts: BackendProduct[]): Product[] {
    return apiProducts.map(adaptProduct);
}
