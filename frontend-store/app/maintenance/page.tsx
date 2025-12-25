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

async function getMaintenanceSettings() {
    try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

        // Fetch both settings in parallel for speed
        const [maintenanceRes, headerRes] = await Promise.all([
            fetch(`${apiUrl}/public-settings/maintenance`, { cache: 'no-store' }),
            fetch(`${apiUrl}/public-settings/header-footer`, { cache: 'no-store' })
        ]);

        if (!maintenanceRes.ok) {
            throw new Error('Failed to fetch maintenance settings');
        }

        const maintenanceData = await maintenanceRes.json();

        let brandName = 'HumanTee';
        let logoUrl = null;
        let tagline = 'Premium Handcrafted T-Shirts Since 1931';

        if (headerRes.ok) {
            const headerData = await headerRes.json();
            if (headerData?.brand_name) {
                brandName = headerData.brand_name;
            }
            if (headerData?.logo_url) {
                logoUrl = headerData.logo_url;
            }
            if (headerData?.tagline) {
                tagline = headerData.tagline;
            }
        }

        return {
            ...maintenanceData,
            brandName,
            logoUrl,
            tagline
        };
    } catch (error) {
        // Fallback settings if backend is down
        return {
            enabled: true,
            title: "We'll Be Right Back",
            message: "We're making things even better. Check back soon.",
            estimatedTime: null,
            contactEmail: 'support@humantee.com',
            brandName: 'HumanTee',
            logoUrl: null,
            tagline: 'Premium Handcrafted T-Shirts Since 1931'
        };
    }
}

export default async function MaintenancePage() {
    // Fetch settings on server side
    const settings = await getMaintenanceSettings();

    return <MaintenanceView initialSettings={settings} />;
}
