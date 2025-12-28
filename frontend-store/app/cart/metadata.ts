/**
 * Cart Page Metadata
 * SEO optimization for shopping cart
 */

import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Shopping Cart | HumanTee',
    description: 'Review your selected items and proceed to checkout. Free shipping on orders over ₹2000.',
    robots: {
        index: false, // Don't index cart pages
        follow: true,
    },
    openGraph: {
        title: 'Shopping Cart | HumanTee',
        description: 'Review your cart and checkout',
        type: 'website',
    },
};
