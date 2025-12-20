/**
 * Product Domain - Zod Validation Schemas
 * Runtime validation for all product data
 */

import { z } from 'zod';
import { SCHEMA_VERSION } from './product.types';

// ============================================================================
// IMAGE SCHEMA
// ============================================================================

export const productImageSchema = z.object({
    id: z.string().uuid(),
    url: z.string().url(),
    alt: z.string(),
    status: z.enum(['TEMP', 'ACTIVE']),
    expiresAt: z.date().optional(),
    uploadedAt: z.date(),
});

// ============================================================================
// VARIANT SCHEMA
// ============================================================================

export const variantSchema = z.object({
    id: z.string().uuid(),
    size: z.string().min(1, 'Size is required'),
    color: z.string().min(1, 'Color is required'),
    colorHex: z.string().regex(/^#[0-9A-F]{6}$/i, 'Invalid hex color'),
    sku: z.string().min(1, 'SKU is required'),
    skuLocked: z.boolean(),
    stock: z.number().int().min(0, 'Stock cannot be negative'),
    priceOverride: z.number().positive().optional(),
    weight: z.number().positive().optional(),
});

// ============================================================================
// PRODUCT FORM DATA SCHEMA
// ============================================================================

export const productFormDataSchema = z.object({
    // Basic Info
    name: z.string().min(1, 'Product name is required').max(200),
    description: z.string().min(1, 'Description is required'),
    productType: z.string(),
    category: z.string(),

    // Media
    images: z.map(z.string(), productImageSchema),
    imageOrder: z.array(z.string()),
    primaryImageId: z.string().optional(),

    // Pricing
    price: z.number().positive('Price must be greater than 0'),
    compareAtPrice: z.number().positive().optional(),
    costPerItem: z.number().positive().optional(),
    currency: z.string().default('INR'),
    taxable: z.boolean(),

    // Variants
    hasVariants: z.boolean(),
    variants: z.map(z.string(), variantSchema),
    variantOrder: z.array(z.string()),

    // Inventory
    inventoryMode: z.enum(['SINGLE', 'VARIANT']),
    trackInventory: z.boolean(),
    stock: z.number().int().min(0),
    sku: z.string().optional(),
    continueSellingWhenOutOfStock: z.boolean(),
    lowStockThreshold: z.number().int().min(0).optional(),

    // SEO
    slug: z.string().regex(/^[a-z0-9-]+$/, 'Slug must be lowercase with hyphens only'),
    metaTitle: z.string().max(60).optional(),
    metaDescription: z.string().max(160).optional(),
    tags: z.array(z.string()),

    // Organization
    status: z.enum(['DRAFT', 'ACTIVE', 'ARCHIVED']),
    isFeatured: z.boolean(),
    collections: z.array(z.string()),

    // Metadata
    version: z.number().int().min(0),
    updatedAt: z.date().optional(),
});

// ============================================================================
// PRODUCT DRAFT SCHEMA
// ============================================================================

export const productDraftSchema = z.object({
    id: z.string().uuid(),
    productId: z.string().uuid().optional(),
    userId: z.string(),
    schemaVersion: z.literal(SCHEMA_VERSION),
    data: productFormDataSchema,
    createdAt: z.date(),
    updatedAt: z.date(),
});

// ============================================================================
// VALIDATION HELPERS
// ============================================================================

export const validateSlug = (slug: string): boolean => {
    return /^[a-z0-9-]+$/.test(slug);
};

export const validateSKU = (sku: string): boolean => {
    return sku.length >= 3 && sku.length <= 50;
};

// ============================================================================
// TYPE EXPORTS
// ============================================================================

export type ProductImageSchema = z.infer<typeof productImageSchema>;
export type VariantSchema = z.infer<typeof variantSchema>;
export type ProductFormDataSchema = z.infer<typeof productFormDataSchema>;
export type ProductDraftSchema = z.infer<typeof productDraftSchema>;
