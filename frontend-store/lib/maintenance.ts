/**
 * Maintenance Mode Utility
 * Checks if maintenance mode is enabled with caching
 */

// Cache for maintenance status (30 seconds TTL)
let maintenanceCache: {
    enabled: boolean;
    timestamp: number;
} | null = null;

const CACHE_TTL = 30000; // 30 seconds

/**
 * Check if maintenance mode is enabled
 * Uses 30-second cache to reduce API calls
 */
export async function isMaintenanceModeEnabled(): Promise<boolean> {
    const now = Date.now();

    // Return cached value if fresh
    if (maintenanceCache && (now - maintenanceCache.timestamp) < CACHE_TTL) {
        return maintenanceCache.enabled;
    }

    // Fetch fresh status from API
    try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
        const response = await fetch(`${apiUrl}/public-settings/maintenance`, {
            cache: 'no-store',
            next: { revalidate: 0 },
        });

        if (!response.ok) {
            // If API fails, assume maintenance is OFF (fail-open)
            return false;
        }

        const data = await response.json();
        const enabled = data.enabled ?? false;

        // Update cache
        maintenanceCache = {
            enabled,
            timestamp: now,
        };

        return enabled;
    } catch (error) {
        console.error('[Maintenance] Failed to check status:', error);
        // Fail-open: if API is down, allow access
        return false;
    }
}

/**
 * Invalidate maintenance cache (call after admin updates)
 */
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
