/**
 * Featured Products Settings Hook
 * ✅ OPTIMIZED: Uses shared SettingsContext
 */

"use client";

import { useSettings } from "@/app/contexts/SettingsContext";
import fallbackSettings from "@/config/fallback-settings.json";

export function useFeaturedSettings() {
    const { settings, loading, error } = useSettings();

    // Featured products settings from API (no fallback needed - component handles empty state)
    const featured = settings?.homepage?.featured_products || {};

    return { settings: featured, loading, error };
}
