/**
 * Luxury Maintenance Mode Page
 * Displays when site is under maintenance
 */

import { Metadata } from 'next';
import MaintenanceView from './MaintenanceView';

export const metadata: Metadata = {
    title: "We'll Be Right Back | HumanTee",
    description: "We're making things even better. Check back soon.",
};

export default async function MaintenancePage() {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

    let settings = {
        enabled: true,
        title: "We'll Be Right Back",
        message: "We're making things even better. Check back soon.",
        estimatedTime: null,
        contactEmail: 'support@humantee.com',
        brandName: 'HumanTee',
        logoUrl: null,
        tagline: 'Premium Handcrafted T-Shirts Since 1931'
    };

    try {
        const response = await fetch(`${API_URL}/public-settings/maintenance`, {
            cache: 'no-store',
            // short timeout to prevent hanging the page if backend is down
            signal: AbortSignal.timeout(5000)
        } as any);

        if (response.ok) {
            const data = await response.json();
            settings = { ...settings, ...data };
        }
    } catch (error) {
        console.error('[MaintenancePage] Failed to fetch settings:', error);
        // Fail-closed stays enabled: true
    }

    return <MaintenanceView initialSettings={settings} />;
}
