/**
 * Orders Page Metadata
 * Prevent indexing of private order history
 */

import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'My Orders',
    description: 'View your order history and track shipments',
    robots: {
        index: false,  // CRITICAL: Prevent indexing
        follow: false,
    },
};
