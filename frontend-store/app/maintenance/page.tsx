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

export default function MaintenancePage() {
    // Hardcoded settings - no API calls
    const settings = {
        enabled: true,
        title: "We'll Be Right Back",
        message: "We're making things even better. Check back soon.",
        estimatedTime: null,
        contactEmail: 'support@humantee.com',
        brandName: 'HumanTee',
        logoUrl: null,
        tagline: 'Premium Handcrafted T-Shirts Since 1931'
    };

    return <MaintenanceView initialSettings={settings} />;
}
