/**
 * Product Form Utilities
 * Helper functions for product form operations
 */

import { ProductFormData, ProductVariant, ValidationErrors } from '@/types/product-form.types';

/**
 * Generate URL-friendly slug from title
 */
export function generateSlug(title: string): string {
    return title
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '') // Remove special characters
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/-+/g, '-') // Replace multiple hyphens with single
        .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

/**
 * Generate SKU from product name and variant details
 */
export function generateSKU(
    productName: string,
    variant?: Partial<ProductVariant>
): string {
    const prefix = productName
        .split(' ')
        .map(word => word.charAt(0).toUpperCase())
        .join('')
        .substring(0, 3);

    const size = variant?.size ? `-${variant.size}` : '';
    const color = variant?.color ? `-${variant.color.substring(0, 3).toUpperCase()}` : '';
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();

    return `${prefix}${size}${color}-${random}`;
}

/**
 * Validate product form data
 */
export function validateProductForm(data: ProductFormData): ValidationErrors {
    const errors: ValidationErrors = {};

    // Basic Info
    if (!data.name || data.name.trim().length === 0) {
        errors.name = 'Product name is required';
    }

    if (!data.description || data.description.trim().length === 0) {
        errors.description = 'Product description is required';
    }

    // Pricing
    if (!data.price || data.price <= 0) {
        errors.price = 'Price must be greater than 0';
    }

    if (data.compareAtPrice && data.compareAtPrice <= data.price) {
        errors.compareAtPrice = 'Compare-at price must be greater than price';
    }

    if (data.costPerItem && data.costPerItem >= data.price) {
        errors.costPerItem = 'Cost per item should be less than selling price';
    }

    // Variants
    if (data.hasVariants && data.variants.length === 0) {
        errors.variants = 'At least one variant is required when variants are enabled';
    }

    if (data.hasVariants) {
        data.variants.forEach((variant, index) => {
            if (!variant.sku) {
                errors[`variant_${index}_sku`] = 'SKU is required for all variants';
            }
            if (!variant.size && !variant.color) {
                errors[`variant_${index}`] = 'Size or color is required for variant';
            }
        });
    }

    // Inventory
    if (!data.hasVariants && data.trackInventory && !data.sku) {
        errors.sku = 'SKU is required when tracking inventory';
    }

    // Shipping
    if (data.isPhysicalProduct && data.requiresShipping && !data.weight) {
        errors.weight = 'Weight is required for physical products that require shipping';
    }

    // SEO
    if (!data.slug || data.slug.trim().length === 0) {
        errors.slug = 'URL slug is required';
    }

    if (data.slug && !validateSlug(data.slug)) {
        errors.slug = 'URL slug can only contain lowercase letters, numbers, and hyphens';
    }

    if (data.metaTitle && data.metaTitle.length > 60) {
        errors.metaTitle = 'Meta title should be 60 characters or less';
    }

    if (data.metaDescription && data.metaDescription.length > 160) {
        errors.metaDescription = 'Meta description should be 160 characters or less';
    }

    return errors;
}

/**
 * Validate URL slug format
 */
export function validateSlug(slug: string): boolean {
    const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
    return slugRegex.test(slug);
}

/**
 * Calculate profit margin percentage
 */
export function calculateProfitMargin(price: number, cost: number): number {
    if (price <= 0 || cost <= 0) return 0;
    return ((price - cost) / price) * 100;
}

/**
 * Format weight in grams to readable string
 */
export function formatWeight(grams: number): string {
    if (grams < 1000) {
        return `${grams}g`;
    }
    return `${(grams / 1000).toFixed(2)}kg`;
}

/**
 * Format dimensions to readable string
 */
export function formatDimensions(
    length?: number,
    width?: number,
    height?: number
): string {
    if (!length || !width || !height) return 'Not specified';
    return `${length} × ${width} × ${height} cm`;
}

/**
 * Get initial form data with defaults
 */
export function getInitialFormData(): ProductFormData {
    return {
        // Basic Info
        name: '',
        description: '',
        productType: '',
        vendor: 'HumanTee',
        category: '',

        // Media
        images: [],

        // Pricing
        price: 0,
        currency: '₹',
        taxable: true,

        // Variants
        hasVariants: false,
        variants: [],

        // Inventory
        trackInventory: true,
        stock: 0,
        continueSellingWhenOutOfStock: false,

        // Shipping
        isPhysicalProduct: true,
        requiresShipping: true,

        // SEO
        slug: '',
        tags: [],

        // Organization
        status: 'DRAFT',
        collections: [],
        isFeatured: false,
        visibility: 'PUBLIC',
        salesChannels: ['online-store'],

        // Advanced
        features: [],
        relatedProducts: [],
    };
}

/**
 * Check if form has unsaved changes
 */
export function hasUnsavedChanges(
    current: ProductFormData,
    initial: ProductFormData
): boolean {
    return JSON.stringify(current) !== JSON.stringify(initial);
}
