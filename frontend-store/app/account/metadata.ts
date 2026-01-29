/**
 * Account Page Metadata
 * Prevent indexing of private account dashboard
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
