/**
 * Product-related type definitions
 * Shared across the application for type safety
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
    dotColor: string;
    textColor: string;
}

export interface BadgeConfig {
    variant: BadgeVariant;
    label: string;
    className: string;
}
