/**
 * Product Domain - Selectors
 * Derived data calculations (NEVER stored in state)
 */

import type { ProductFormData, Variant } from './product.types';

// ============================================================================
// PRICING SELECTORS
// ============================================================================

export const selectProfit = (price?: number, cost?: number): number | null => {
    if (!price || !cost) return null;
    return price - cost;
};

export const selectProfitMargin = (price?: number, cost?: number): number | null => {
    if (!price || !cost || price === 0) return null;
    return ((price - cost) / price) * 100;
};

export const selectDiscountPercentage = (price?: number, compareAtPrice?: number): number | null => {
    if (!price || !compareAtPrice || compareAtPrice <= price) return null;
    return ((compareAtPrice - price) / compareAtPrice) * 100;
};

// ============================================================================
// INVENTORY SELECTORS
// ============================================================================

export const selectTotalStock = (
    inventoryMode: 'SINGLE' | 'VARIANT',
    singleStock: number,
    variants: Variant[]
): number => {
    if (inventoryMode === 'SINGLE') {
        return singleStock;
    }

    // Safety check: ensure variants is an array
    if (!Array.isArray(variants)) {
        return 0;
    }

    // Aggregate variant stock
    return variants.reduce((total, variant) => total + (variant.stock || 0), 0);
};

export const selectLowStockVariants = (
    variants: Variant[],
    threshold: number
): Variant[] => {
    // Safety check: ensure variants is an array
    if (!Array.isArray(variants)) {
        return [];
    }

    return variants.filter((variant) => variant.stock <= threshold);
};

// ============================================================================
// VARIANT SELECTORS
// ============================================================================

export const selectVariantCount = (variants: Variant[]): number => {
    return Array.isArray(variants) ? variants.length : 0;
};

export const selectVariantsBySKU = (variants: Variant[], sku: string): Variant | null => {
    if (!Array.isArray(variants)) {
        return null;
    }
    return variants.find((variant) => variant.sku === sku) || null;
};

// ============================================================================
// MEDIA SELECTORS
// ============================================================================

export const selectPrimaryImage = (
    images: Map<string, any>,
    primaryImageId?: string
): any | null => {
    if (!primaryImageId) {
        // Return first image if no primary set
        const firstImage = images.values().next().value;
        return firstImage || null;
    }
    return images.get(primaryImageId) || null;
};

export const selectActiveImages = (images: Map<string, any>): any[] => {
    const active: any[] = [];
    images.forEach((image) => {
        if (image.status === 'ACTIVE') {
            active.push(image);
        }
    });
    return active;
};

// ============================================================================
// SEO SELECTORS
// ============================================================================

export const selectMetaTitlePreview = (metaTitle?: string, productName?: string): string => {
    return metaTitle || productName || 'Product Title';
};

export const selectMetaDescriptionPreview = (
    metaDescription?: string,
    description?: string
): string => {
    return metaDescription || description?.substring(0, 160) || 'Product description...';
};

// ============================================================================
// VALIDATION SELECTORS
// ============================================================================

export const selectIsPublishable = (data: ProductFormData): boolean => {
    // Minimum requirements for publishing
    return !!(
        data.name &&
        data.description &&
        data.price > 0 &&
        data.slug &&
        (data.inventoryMode === 'VARIANT' || data.stock >= 0)
    );
};

export const selectHasUnsavedChanges = (
    basicInfoDirty: boolean,
    pricingDirty: boolean,
    variantsDirty: boolean,
    mediaDirty: boolean,
    inventoryDirty: boolean,
    seoDirty: boolean,
    organizationDirty: boolean
): boolean => {
    return (
        basicInfoDirty ||
        pricingDirty ||
        variantsDirty ||
        mediaDirty ||
        inventoryDirty ||
        seoDirty ||
        organizationDirty
    );
};
