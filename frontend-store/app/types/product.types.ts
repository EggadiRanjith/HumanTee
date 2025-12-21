/**
 * Product Types
 * Shared interfaces for product data across the application
 */

export type BadgeVariant = 'sale' | 'bestseller' | 'new';

export interface Product {
    id: string; // Phase 4: Changed to UUID string
    title: string;
    subtitle?: string;
    price: number;
    currency: string;
    originalPrice?: number;
    image: string;
    imageAlt?: string;
    badge?: BadgeVariant;
    stock: number;
    handle?: string;
}

export interface StockInfo {
    level: 'low' | 'limited' | 'in-stock';
    count: number;
    label: string;
    dotColor: string;
    textColor: string;
}

export interface BadgeConfig {
    variant: BadgeVariant;
    label: string;
    className: string;
}

/**
 * Extended Product Detail
 * For product detail pages with full information
 */
export interface ProductDetail extends Product {
    description: string;
    descriptionHtml?: string;
    details: string[];
    sizes: string[];
    images: string[];
    vendor?: string;
    productType?: string;
    variants: any[]; // Phase 8: Added for variant-specific stock and ID handling
}
