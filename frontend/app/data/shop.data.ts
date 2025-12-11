/**
 * Shop Products Data
 * Complete product catalog for the shop page
 */

import { Product } from '@/app/types/product.types';

export const shopProducts: Product[] = [
    {
        id: 1,
        title: "Midnight Core Tee",
        subtitle: "Heavyweight 280 GSM",
        price: "₹1,299",
        originalPrice: "₹1,999",
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1200&auto=format",
        badge: "bestseller",
        stock: 12,
    },
    {
        id: 2,
        title: "Quantum Crest Tee",
        subtitle: "Premium Cotton Blend",
        price: "₹1,499",
        originalPrice: "₹1,999",
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1200&auto=format",
        badge: "sale",
        stock: 3,
    },
    {
        id: 3,
        title: "Obsidian Logo Tee",
        subtitle: "Structured Fit",
        price: "₹1,199",
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1200&auto=format",
        badge: "new",
        stock: 8,
    },
    {
        id: 4,
        title: "Storm Fade Tee",
        subtitle: "Reactive Dye Wash",
        price: "₹1,699",
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1200&auto=format",
        stock: 15,
    },
    {
        id: 5,
        title: "Void Graphic Tee",
        subtitle: "Silkscreen Print",
        price: "₹1,799",
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1200&auto=format",
        stock: 6,
    },
    {
        id: 6,
        title: "Eclipse Minimal Tee",
        subtitle: "Ultra-Soft Fabric",
        price: "₹1,099",
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1200&auto=format",
        stock: 20,
    },
];

/**
 * Product Categories for filtering
 */
export const productCategories = [
    { id: 'all', label: 'All Products', count: shopProducts.length },
    { id: 'bestseller', label: 'Bestsellers', count: shopProducts.filter(p => p.badge === 'bestseller').length },
    { id: 'new', label: 'New Arrivals', count: shopProducts.filter(p => p.badge === 'new').length },
    { id: 'sale', label: 'On Sale', count: shopProducts.filter(p => p.badge === 'sale').length },
] as const;
