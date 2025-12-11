/**
 * Featured Products Data
 * Centralized product data for homepage featured section
 */

import { Product } from '@/app/types/product.types';

export const featuredProducts: Product[] = [
    {
        id: 1,
        title: "Midnight Core Tee",
        subtitle: "Heavyweight 280 GSM",
        price: "₹1,299",
        originalPrice: "₹1,999",
        image: "/images/products/drive-front.jpg",
        badge: "bestseller",
        stock: 12,
    },
    {
        id: 2,
        title: "Quantum Crest Tee",
        subtitle: "Embroidered Crest Edition",
        price: "₹1,499",
        originalPrice: "₹1,999",
        image: "/images/products/wild-beginings-front.jpg",
        badge: "sale",
        stock: 3,
    },
    {
        id: 3,
        title: "Obsidian Logo Tee",
        subtitle: "Structured Fit",
        price: "₹1,199",
        originalPrice: "₹1,999",
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800&auto=format",
        badge: "new",
        stock: 8,
    },
    {
        id: 4,
        title: "Storm Fade Tee",
        subtitle: "Reactive Dye Wash",
        price: "₹1,699",
        originalPrice: "₹1,999",
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800&auto=format",
        stock: 15,
    },
];
