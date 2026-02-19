/**
 * Maintenance Mode Utility
 * Single module for maintenance checks – used by proxy, maintenance page, and callers.
 */

const getApiUrl = () =>
    process.env.NEXT_PUBLIC_API_URL || 'https://humantee.onrender.com';

export interface MaintenanceStatus {
    enabled: boolean;
    title?: string;
    message?: string;
    estimatedTime?: string | null;
    contactEmail?: string;
    brandName?: string;
    logoUrl?: string | null;
    tagline?: string;
    [k: string]: unknown;
}

// Cache for maintenance status (30 seconds TTL)
let maintenanceCache: { data: MaintenanceStatus; timestamp: number } | null = null;

const CACHE_TTL = 30_000; // 30 seconds

/**
 * Fetch maintenance status from API. Single implementation – no duplicate fetch logic.
 */
export async function fetchMaintenanceStatus(): Promise<MaintenanceStatus> {
    const response = await fetch(`${getApiUrl()}/public-settings/maintenance`, {
        cache: 'no-store',
    });

    if (!response.ok) {
        return { enabled: false };
    }

    const data = await response.json();
    return {
        enabled: data.enabled ?? false,
        title: data.title,
        message: data.message,
        estimatedTime: data.estimatedTime ?? null,
        contactEmail: data.contactEmail,
        brandName: data.brandName,
        logoUrl: data.logoUrl ?? null,
        tagline: data.tagline,
        ...data,
    };
}

/**
 * Check if maintenance mode is enabled. Uses 30s cache to reduce API calls.
 * Fail-open: if API errors, returns false.
 */
export async function isMaintenanceModeEnabled(): Promise<boolean> {
    const now = Date.now();

    if (maintenanceCache && now - maintenanceCache.timestamp < CACHE_TTL) {
        return maintenanceCache.data.enabled;
    }

    try {
        const data = await fetchMaintenanceStatus();
        maintenanceCache = { data, timestamp: now };
        return data.enabled;
    } catch (error) {
        return false;
    }
}

/**
 * Get full maintenance status for display (e.g. maintenance page). Uses 30s cache when available.
 */
export async function getMaintenanceStatus(): Promise<MaintenanceStatus> {
    const now = Date.now();

    if (maintenanceCache && now - maintenanceCache.timestamp < CACHE_TTL) {
        return maintenanceCache.data;
    }

    try {
        const data = await fetchMaintenanceStatus();
        maintenanceCache = { data, timestamp: now };
        return data;
    } catch (error) {
        return {
            enabled: true,
            title: "We'll Be Right Back",
            message: "We're making things even better. Check back soon.",
            estimatedTime: null,
            contactEmail: 'support@humantee.com',
            brandName: 'HumanTee',
            logoUrl: null,
            tagline: 'Premium Handcrafted T-Shirts Since 1931',
        };
    }
}

/** Invalidate maintenance cache (e.g. after admin updates). */
export function invalidateMaintenanceCache() {
    maintenanceCache = null;
}

/**
 * Check if user is admin (from JWT token)
 */
export function isAdmin(request: Request): boolean {
    // Get token from cookie or Authorization header
    const cookies = request.headers.get('cookie');
    const authHeader = request.headers.get('authorization');

    // For now, simple check - can be enhanced with JWT verification
    // This is a placeholder - actual implementation should verify JWT
    const hasAdminToken = cookies?.includes('admin_bypass=true') ||
        authHeader?.includes('admin');

    return hasAdminToken ?? false;
}
