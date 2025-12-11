/**
 * Product Details Data
 * Complete product information for product detail pages
 */

import { ProductDetail } from '@/app/types/product.types';

export const productDetails: ProductDetail[] = [
    {
        id: 1,
        title: "Midnight Core Tee",
        subtitle: "Heavyweight 280 GSM",
        price: "₹1,299",
        originalPrice: "₹1,999",
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1200&auto=format",
        badge: "bestseller",
        stock: 12,
        description: "Crafted from premium heavyweight cotton, this essential tee embodies the Humantee philosophy of understated luxury. A modern boxy silhouette, exceptional hand feel, and precise structure define this wardrobe staple.",
        details: [
            "280 GSM heavyweight cotton",
            "Premium garment dye finish",
            "Structured fit that holds shape",
            "Ethically sourced materials",
            "Made in Portugal",
        ],
        sizes: ["XS", "S", "M", "L", "XL", "XXL"],
        images: [
            "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1200&auto=format",
            "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=1200&auto=format",
            "https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=1200&auto=format",
            "https://images.unsplash.com/photo-1622445275463-afa2ab738c34?q=80&w=1200&auto=format",
        ],
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
        description: "An evolution in fabric technology meets timeless design. This premium tee features a proprietary cotton blend that adapts to your body temperature.",
        details: [
            "Advanced cotton blend technology",
            "Temperature regulating fabric",
            "Anti-wrinkle finish",
            "Sustainable production",
            "Made in Italy",
        ],
        sizes: ["XS", "S", "M", "L", "XL"],
        images: [
            "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1200&auto=format",
            "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=1200&auto=format",
        ],
    },
    {
        id: 3,
        title: "Obsidian Logo Tee",
        subtitle: "Structured Fit",
        price: "₹1,199",
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1200&auto=format",
        badge: "new",
        stock: 8,
        description: "Bold yet refined, the Obsidian Logo Tee makes a statement without compromising on comfort. Features our signature embossed logo.",
        details: [
            "Premium ring-spun cotton",
            "Embossed logo detail",
            "Reinforced shoulders",
            "Pre-shrunk fabric",
            "Made in Japan",
        ],
        sizes: ["S", "M", "L", "XL", "XXL"],
        images: [
            "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1200&auto=format",
            "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=1200&auto=format",
            "https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=1200&auto=format",
        ],
    },
    {
        id: 4,
        title: "Storm Fade Tee",
        subtitle: "Reactive Dye Wash",
        price: "₹1,699",
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1200&auto=format",
        stock: 15,
        description: "Each piece is unique. Our reactive dye process creates subtle color variations that evolve with wear, making every tee one of a kind.",
        details: [
            "Reactive dye wash finish",
            "Each piece unique",
            "Ultra-soft hand feel",
            "Colorfast technology",
            "Made in USA",
        ],
        sizes: ["XS", "S", "M", "L", "XL", "XXL"],
        images: [
            "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1200&auto=format",
            "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=1200&auto=format",
            "https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=1200&auto=format",
            "https://images.unsplash.com/photo-1622445275463-afa2ab738c34?q=80&w=1200&auto=format",
        ],
    },
];

/**
 * Get product detail by ID
 */
export function getProductDetail(id: number): ProductDetail | undefined {
    return productDetails.find(p => p.id === id);
}
