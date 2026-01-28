/**
 * Luxury Maintenance Mode Page
 * Displays when site is under maintenance. Uses shared getMaintenanceStatus.
 */

import { Metadata } from 'next';
import { getMaintenanceStatus } from '@/lib/maintenance';
import MaintenanceView from './MaintenanceView';

export const metadata: Metadata = {
    title: "We'll Be Right Back | HumanTee",
    description: "We're making things even better. Check back soon.",
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const DEFAULT_SETTINGS = {
    enabled: true,
    title: "We'll Be Right Back",
    message: "We're making things even better. Check back soon.",
    estimatedTime: null as string | null,
    contactEmail: 'support@humantee.com',
    brandName: 'HumanTee',
    logoUrl: null as string | null,
    tagline: 'Premium Handcrafted T-Shirts Since 1931',
};

export default async function MaintenancePage() {
    const data = await getMaintenanceStatus();
    const settings = { ...DEFAULT_SETTINGS, ...data };

    return <MaintenanceView initialSettings={settings} />;
}
