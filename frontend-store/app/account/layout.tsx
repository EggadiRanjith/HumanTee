/**
 * Account Layout - Server Component
 * Handles metadata for account pages
 */

import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'My Account',
    description: 'Manage your account settings and preferences',
    robots: {
        index: false,  // CRITICAL: Prevent indexing
        follow: false,
    },
};

export default function AccountLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
