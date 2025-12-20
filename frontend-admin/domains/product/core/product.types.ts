/**
 * Product Domain - Core Types
 * Central type definitions for the entire product domain
 */

// ============================================================================
// SCHEMA VERSION
// ============================================================================
export const SCHEMA_VERSION = 1;

// ============================================================================
// CORE PRODUCT TYPES
// ============================================================================

export interface ProductImage {
    id: string;
    url: string;
    file?: File; // Optional File object for uploads
    altText: string; // Changed from 'alt' to 'altText' for consistency
    status: 'TEMP' | 'ACTIVE';
    expiresAt?: Date;
    uploadedAt: Date;
}

export interface Variant {
    id: string; // UUID
    size: string;
    color: string;
    colorHex: string;
    sku: string;
    skuLocked: boolean; // True after publish
    stock: number;
    priceOverride?: number;
    weight?: number;
}

export type ProductStatus = 'DRAFT' | 'ACTIVE' | 'ARCHIVED';
export type InventoryMode = 'SINGLE' | 'VARIANT';

// ============================================================================
// DOMAIN STORE INTERFACE
// ============================================================================

export interface DomainStore {
    isDirty: boolean;
    markClean: () => void;
    markDirty: () => void;
}

// ============================================================================
// PRODUCT DRAFT
// ============================================================================

export interface ProductDraft {
    id: string;
    productId?: string; // null for new products
    userId: string; // Owner
    schemaVersion: number;
    data: ProductFormData;
    createdAt: Date;
    updatedAt: Date;
}

// ============================================================================
// COMPLETE PRODUCT FORM DATA
// ============================================================================

export interface ProductFormData {
    // Basic Info
    name: string;
    description: string;
    productType: string;
    category: string;

    // Media
    images: Map<string, ProductImage>;
    imageOrder: string[];
    primaryImageId?: string;

    // Pricing
    price: number;
    compareAtPrice?: number;
    costPerItem?: number;
    currency: string;
    taxable: boolean;

    // Variants
    hasVariants: boolean;
    variants: Map<string, Variant>;
    variantOrder: string[];

    // Inventory
    inventoryMode: InventoryMode;
    trackInventory: boolean;
    stock: number; // Only editable in SINGLE mode
    sku?: string;
    continueSellingWhenOutOfStock: boolean;
    lowStockThreshold?: number;

    // SEO
    slug: string;
    metaTitle?: string;
    metaDescription?: string;
    tags: string[];

    // Organization
    status: ProductStatus;
    isFeatured: boolean;
    collections: string[];

    // Metadata
    version: number; // For optimistic locking
    updatedAt?: Date;
}

// ============================================================================
// VALIDATION ERRORS
// ============================================================================

export interface ValidationErrors {
    [key: string]: string;
}

// ============================================================================
// TAB CONFIGURATION
// ============================================================================

export type TabKey = 'basic' | 'media' | 'pricing' | 'variants' | 'inventory' | 'seo' | 'organization';

export interface TabConfig {
    key: TabKey;
    label: string;
    icon: string;
    hasErrors?: boolean;
}
