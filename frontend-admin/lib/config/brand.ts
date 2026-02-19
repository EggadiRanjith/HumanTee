/**
 * Brand configuration for admin panel
 * Fetches brand name from settings API with fallback
 */

const BRAND_FALLBACK = 'HumanTee';

export async function getBrandName(): Promise<string> {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/settings/header-footer`, {
            cache: 'force-cache',
            next: { revalidate: 3600 }, // Revalidate every hour
        });

        if (!response.ok) {
            return BRAND_FALLBACK;
        }

        const data = await response.json();
        return data?.brand_name || BRAND_FALLBACK;
    } catch (error) {
        return BRAND_FALLBACK;
    }
}

// Client-side hook for brand name
export function useBrandName() {
    return BRAND_FALLBACK; // For now, use fallback on client
    // TODO: Implement client-side fetching if needed
}

export const BRAND_CONFIG = {
    fallback: BRAND_FALLBACK,
    adminSuffix: 'Admin',
} as const;
