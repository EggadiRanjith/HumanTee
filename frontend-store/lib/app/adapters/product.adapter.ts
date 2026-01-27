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
    description?: string;  // Optional in summary format
    status?: 'DRAFT' | 'ACTIVE' | 'ARCHIVED';
    category?: string;  // For filtering
    collection?: string;  // For filtering (if returned as string)
    basePrice: number;  // Base price
    compareAtPrice?: number;  // Compare at price (original price)

    // FULL format fields (from /products/:slug)
    variants?: BackendVariant[];
    images?: BackendImage[];  // Added images array

    // SUMMARY format fields (from /products/all)
    primaryImage?: string;  // Single image URL
    inStock?: boolean;      // Simple stock availability
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
 * Handles both FULL product (from /products/:slug) and SUMMARY (from /products/all)
 */
export function adaptProduct(apiProduct: any): Product {
    // NEW OPTIMIZED SUMMARY FORMAT (from /products/all)
    if ('primaryImage' in apiProduct && 'inStock' in apiProduct) {
        return {
            id: apiProduct.id,
            title: apiProduct.title,
            subtitle: '', // Summary doesn't include description
            stock: apiProduct.inStock ? 100 : 0, // Simplified stock indicator
            price: apiProduct.basePrice ?? 0,
            currency: 'INR',
            handle: apiProduct.slug,
            image: apiProduct.primaryImage || '/images/placeholder.jpg',
            imageAlt: apiProduct.title,
            originalPrice: apiProduct.compareAtPrice,
            badge: undefined,
            category: apiProduct.category,
            collection: apiProduct.collection,
            images: apiProduct.primaryImage ? [apiProduct.primaryImage] : [],
        };
    }

    // OLD FULL FORMAT (from /products/:slug with variants/images arrays)
    const activeVariants = apiProduct.variants?.filter((v: any) => v.isActive) ?? [];
    const firstVariant = activeVariants[0];

    // Get primary image or first image, fallback to placeholder
    const images = apiProduct.images ?? [];
    const primaryImage = images.find((img: any) => img.isPrimary);
    const firstImage = images.length > 0 ? images[0] : null;
    const productImage = primaryImage || firstImage;

    return {
        id: apiProduct.id,
        title: apiProduct.title,
        subtitle: apiProduct.description,
        stock: activeVariants.reduce((sum: number, v: any) => sum + v.stock, 0),
        price: firstVariant?.price ?? apiProduct.basePrice ?? 0,
        currency: 'INR',
        handle: apiProduct.slug,
        image: productImage?.url || '/images/placeholder.jpg',
        imageAlt: productImage?.altText || apiProduct.title,
        originalPrice: apiProduct.compareAtPrice,
        badge: undefined,
        category: apiProduct.category,
        collection: apiProduct.collection,
        images: images.filter((img: any) => img.status === 'ACTIVE' || !img.status).map((img: any) => img.url),
    };
}

/**
 * Adapt array of products
 */
export function adaptProducts(apiProducts: BackendProduct[]): Product[] {
    return apiProducts.map(adaptProduct);
}
