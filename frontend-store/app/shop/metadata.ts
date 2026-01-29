/**
 * Shop Page Metadata
 * SEO optimization for shop/collection page
 */

import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Shop Premium T-Shirts | HumanTee',
    description: 'Browse our exclusive collection of handcrafted premium t-shirts. Free shipping on orders over ₹2000. Since 1931.',
    keywords: ['premium t-shirts', 'handcrafted clothing', 'luxury tees', 'custom t-shirts', 'HumanTee'],
    openGraph: {
        title: 'Shop Premium T-Shirts | HumanTee',
        description: 'Browse our exclusive collection of handcrafted premium t-shirts',
        type: 'website',
        url: 'https://humantee.com/shop',
        images: [
            {
                url: '/images/shop-og.jpg',
                width: 1200,
                height: 630,
                alt: 'HumanTee Shop Collection',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Shop Premium T-Shirts | HumanTee',
        description: 'Browse our exclusive collection of handcrafted premium t-shirts',
        images: ['/images/shop-og.jpg'],
    },
    alternates: {
        canonical: 'https://www.humantee.in/shop',
    },
};
