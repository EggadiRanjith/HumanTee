/**
 * Product Form Types
 * Complete type definitions for the e-commerce product form
 */

export interface ProductImage {
    id: string;
    url: string;
    file?: File;
    altText: string;
    isPrimary: boolean;
    order: number;
}

export interface ProductVariant {
    id: string;
    sku: string;
    size: string;
    stock: number;
    price?: number; // Optional override
    weight?: number; // grams
}

export interface ProductFormData {
    // Basic Info
    name: string;
    description: string;
    descriptionHtml?: string;
    productType: string;
    vendor: string;
    category: string;

    // Media
    images: ProductImage[];

    // Pricing
    price: number;
    compareAtPrice?: number;
    costPerItem?: number;
    currency: string;
    taxable: boolean;

    // Variants
    hasVariants: boolean;
    variants: ProductVariant[];

    // Inventory
    trackInventory: boolean;
    stock: number;
    sku?: string;
    continueSellingWhenOutOfStock: boolean;
    lowStockThreshold?: number;
    reorderPoint?: number;

    // Shipping
    isPhysicalProduct: boolean;
    requiresShipping: boolean;
    weight?: number; // grams
    length?: number; // cm
    width?: number; // cm
    height?: number; // cm
    shippingClass?: string;
    hsCode?: string;

    // SEO
    slug: string;
    metaTitle?: string;
    metaDescription?: string;
    tags: string[];

    // Organization
    status: 'DRAFT' | 'ACTIVE' | 'ARCHIVED';
    collections: string[];
    isFeatured: boolean;
    visibility: 'PUBLIC' | 'PRIVATE' | 'PASSWORD';
    publishDate?: Date;
    salesChannels: string[];

    // Advanced
    features: string[];
    careInstructions?: string;
    material?: string;
    countryOfOrigin?: string;
    relatedProducts: string[];
    minOrderQuantity?: number;
    maxOrderQuantity?: number;
}

export interface ValidationErrors {
    [key: string]: string;
}

export type TabKey =
    | 'basic'
    | 'media'
    | 'pricing'
    | 'variants'
    | 'inventory'
    | 'shipping'
    | 'seo'
    | 'organization';

export interface TabConfig {
    key: TabKey;
    label: string;
    icon: string;
    hasErrors?: boolean;
}
