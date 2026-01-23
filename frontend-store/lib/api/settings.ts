import type { AppSettings } from '@/config/settings.types';
import fallbackSettings from '@/config/fallback-settings.json';

// Dynamic API URL helper
const getApiUrl = () => {
    return process.env.NEXT_PUBLIC_API_URL || 'https://humantee.onrender.com';
};

const API_URL = getApiUrl();

export const settingsApi = {
    /**
     * Get public settings (no auth required)
     * Returns settings with JSON fallback support
     */
    async getPublicSettings(): Promise<AppSettings | null> {
        try {
            const response = await fetch(`${API_URL}/public/settings`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                // COST OPTIMIZATION: Cache for 5 minutes to reduce backend load
                // Settings don't change frequently, safe to cache
                next: { revalidate: 300 }, // 5 minutes
            });

            if (!response.ok) {
                console.warn('Settings API failed, using fallback configuration');
                return fallbackSettings as unknown as AppSettings;
            }

            const result = await response.json();

            if (result.success) {
                // Merge API data with fallback to ensure all fields exist
                return {
                    ...fallbackSettings,
                    ...result.data,
                } as unknown as AppSettings;
            } else {
                console.warn('Settings API returned error, using fallback configuration');
                return fallbackSettings as unknown as AppSettings;
            }
        } catch (error) {
            console.error('Settings API error, using fallback configuration:', error);
            return fallbackSettings as unknown as AppSettings; // Return fallback on error
        }
    }
};
