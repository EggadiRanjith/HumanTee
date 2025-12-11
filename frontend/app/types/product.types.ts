/**
 * Product Types
 * Shared interfaces for product data across the application
 */

export type BadgeVariant = 'sale' | 'bestseller' | 'new';

export interface Product {
    id: number;
    title: string;
    subtitle: string;
    price: string;
    originalPrice?: string;
    image: string;
    badge?: BadgeVariant;
    stock: number;
}

export interface StockInfo {
    level: 'low' | 'limited' | 'in-stock';
    count: number;
    label: string;
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
    details: string[];
    sizes: string[];
    images: string[];
}
