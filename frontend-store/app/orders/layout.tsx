/**
 * Orders Layout - Server Component
 * Handles metadata for orders pages
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

export default function OrdersLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
