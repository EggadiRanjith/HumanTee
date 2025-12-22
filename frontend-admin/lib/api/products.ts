/**
 * Admin Products API Service
 * Connects frontend admin panel to backend API
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// ============================================================================
// TYPES
// ============================================================================

export interface ProductImage {
    url: string;
    altText?: string;
    isPrimary: boolean;
    order: number;
}

export interface ProductVariant {
    size: string;
    color: string;
    colorHex: string;
    sku: string;
    stock: number;
    priceOverride?: number;
    weight?: number;
}

export interface CreateProductRequest {
    name: string;
    description: string;
    productType: string;
    category: string;
    images: ProductImage[];
    price: number;
    compareAtPrice?: number;
    costPerItem?: number;
    currency?: string;
    taxable?: boolean;
    hasVariants: boolean;
    inventoryMode: 'SINGLE' | 'VARIANT';
    variants?: ProductVariant[];
    trackInventory: boolean;
    stock?: number;
    sku?: string;
    continueSellingWhenOutOfStock?: boolean;
    lowStockThreshold?: number;
    status?: 'DRAFT' | 'ACTIVE' | 'ARCHIVED';
    isFeatured?: boolean;
    collections?: string[];
}

export interface ProductResponse {
    id: string;
    name: string;
    slug: string;
    description: string;
    productType: string;
    category: string;
    basePrice: number;
    compareAtPrice?: number;
    costPerItem?: number;
    currency: string;
    taxable: boolean;
    inventoryMode: string;
    trackInventory: boolean;
    stock: number;
    sku?: string;
    continueSellingWhenOutOfStock: boolean;
    lowStockThreshold?: number;
    status: string;
    isFeatured: boolean;
    images: Array<{
        id: string;
        url: string;
        altText?: string;
        status: string;
        isPrimary: boolean;
        displayOrder: number;
        uploadedAt: Date;
    }>;
    variants: Array<{
        id: string;
        size: string;
        color: string;
        colorHex: string;
        sku: string;
        skuLocked: boolean;
        stock: number;
        priceOverride?: number;
        weight?: number;
        isActive: boolean;
    }>;
    collections: Array<{
        id: string;
        name: string;
        slug: string;
        position: number;
    }>;
    version: number;
    createdAt: Date;
    updatedAt: Date;
}

import apiClient from '../api-client';

// ============================================================================
// API FUNCTIONS
// ============================================================================

/**
 * Create a new product
 */
export async function createProduct(data: CreateProductRequest): Promise<ProductResponse> {
    const response = await apiClient.post('/admin/products', data);
    return response.data;
}

/**
 * Update an existing product
 */
export async function updateProduct(
    id: string,
    data: Partial<CreateProductRequest>
): Promise<ProductResponse> {
    const response = await apiClient.put(`/admin/products/${id}`, data);
    return response.data;
}

/**
 * Get a single product by ID
 */
export async function getProduct(id: string): Promise<ProductResponse> {
    const response = await apiClient.get(`/admin/products/${id}`);
    return response.data;
}

/**
 * Get all products (admin view - includes drafts)
 */
export async function getAllProducts(): Promise<ProductResponse[]> {
    const response = await apiClient.get('/admin/products');
    return response.data;
}

/**
 * Delete a product
 */
export async function deleteProduct(id: string): Promise<void> {
    await apiClient.delete(`/admin/products/${id}`);
}

/**
 * Get all collections
 */
export async function getCollections(): Promise<any[]> {
    const response = await apiClient.get('/admin/products/collections');
    return response.data;
}
