import type { AppSettings } from '@/config/settings.types';
import fallbackSettings from '@/config/fallback-settings.json';

// Dynamic API URL helper
const getApiUrl = () => {
    if (typeof window === 'undefined') {
        return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    }
    const hostname = window.location.hostname;
    if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
        return `http://${hostname}:3001`;
    }
    return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
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
                cache: 'no-store', // Always fetch fresh data
            });

            if (!response.ok) {
                console.warn('Settings API failed, using fallback configuration');
                return fallbackSettings as AppSettings;
            }

            const result = await response.json();

            if (result.success) {
                // Merge API data with fallback to ensure all fields exist
                return {
                    ...fallbackSettings,
                    ...result.data,
                } as AppSettings;
            } else {
                console.warn('Settings API returned error, using fallback configuration');
                return fallbackSettings as AppSettings;
            }
        } catch (error) {
            console.error('Settings API error, using fallback configuration:', error);
            return fallbackSettings as AppSettings; // Return fallback on error
        }
    }
};
