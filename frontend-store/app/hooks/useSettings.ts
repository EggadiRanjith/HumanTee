/**
 * Centralized Settings Hook
 * Fetches ALL settings in ONE API call
 * Cached for 1 hour - settings rarely change
 */

import { useState, useEffect } from 'react';
import { publicSettingsApi } from '@/lib/app/api/public-settings';

// Type for all settings
interface AppSettings {
    hero?: any;
    featured?: any;
    reviews?: any;
    banner?: any;
    'header-footer'?: any;
    shop?: any;
    'product-info'?: any;
}

// In-memory cache (survives across component mounts)
let settingsCache: AppSettings | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour

/**
 * Hook to get ALL settings with automatic caching
 * Call this ONCE in app root, all components share the cache
 */
export function useSettings() {
    const [settings, setSettings] = useState<AppSettings>(settingsCache || {});
    const [isLoading, setIsLoading] = useState(!settingsCache);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const now = Date.now();

        // Use cache if fresh (< 1 hour old)
        if (settingsCache && (now - cacheTimestamp) < CACHE_DURATION) {
            setSettings(settingsCache);
            setIsLoading(false);
            return;
        }

        // Fetch fresh settings
        const fetchSettings = async () => {
            try {
                setIsLoading(true);
                const data = await publicSettingsApi.getAll();

                // Update cache
                settingsCache = data;
                cacheTimestamp = now;

                setSettings(data);
                setError(null);
            } catch (err) {
                setError(err as Error);
                console.error('Failed to fetch settings:', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchSettings();
    }, []);

    return { settings, isLoading, error };
}

/**
 * Hook to get specific section from cached settings
 * Use this in individual components
 */
export function useSectionSettings<T = any>(section: keyof AppSettings): {
    settings: T | null;
    isLoading: boolean;
    error: Error | null;
} {
    const { settings, isLoading, error } = useSettings();

    // Import fallback settings
    const fallbackSettings = require('@/config/fallback-settings.json');

    // Map section names to fallback paths
    const fallbackMap: Record<string, any> = {
        'hero': fallbackSettings.homepage?.hero,
        'featured': fallbackSettings.homepage?.featured_section,
        'reviews': fallbackSettings.homepage?.reviews,
        'banner': fallbackSettings.homepage?.banner,
        'header-footer': fallbackSettings['header-footer'],
        'shop': fallbackSettings.shop,
        'product-info': fallbackSettings['product-info'],
    };


    // Merge API settings with fallback (fallback provides defaults for missing fields)
    const apiSettings = settings[section];
    const fallback = fallbackMap[section];

    // If API has data, merge with fallback; otherwise use fallback only
    const sectionSettings = settings[section] || fallbackMap[section] || null;

    return {
        settings: sectionSettings as T,
        isLoading,
        error,
    };
}

/**
 * Manual cache refresh (call when settings updated in admin)
 */
export function refreshSettingsCache() {
    settingsCache = null;
    cacheTimestamp = 0;
}
