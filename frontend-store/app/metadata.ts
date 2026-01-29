/**
 * Homepage Metadata
 * SEO optimization for the root page
 */

import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Premium Heavyweight Handcrafted T-Shirts | HumanTee',
    description: 'Heavyweight handcrafted t-shirts designed for everyday wear and long life. Limited designs, premium fabric, and free shipping above ₹2000.',
    keywords: ['heavyweight t-shirts', 'premium t-shirts', 'handcrafted apparel', 'durable tees', 'luxury everyday wear'],
    openGraph: {
        title: 'Premium Heavyweight Handcrafted T-Shirts | HumanTee',
        description: 'Built for comfort, durability, and everyday luxury.',
        type: 'website',
        url: 'https://www.humantee.in/',
        images: [
            {
                url: '/metaimages/seoimage.webp',
                width: 1200,
                height: 630,
                alt: 'HumanTee Premium Collection',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Premium Heavyweight Handcrafted T-Shirts | HumanTee',
        description: 'Everyday luxury tees made with premium heavyweight fabric.',
        images: ['/images/banner1.webp'],
    },
    alternates: {
        canonical: 'https://www.humantee.in/',
    },
};
