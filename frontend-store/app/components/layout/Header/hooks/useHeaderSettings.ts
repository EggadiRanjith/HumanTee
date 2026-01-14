/**
 * Custom hook for Header settings management
 * ✅ OPTIMIZED: Uses shared SettingsContext (no individual API call)
 */

"use client";

import { useSettings } from "@/app/contexts/SettingsContext";
import fallbackSettings from "@/config/fallback-settings.json";
import type { HeaderSettings } from "../types";

export function useHeaderSettings() {
    const { settings, loading, error } = useSettings();

    // Extract header-footer settings with fallback
    const headerFooter = settings?.['header-footer'] || fallbackSettings['header-footer'];

    return {
        settings: {
            brand_name: headerFooter?.brand_name || "HumanTee",
            logo_url: headerFooter?.logo_url || null,
        } as HeaderSettings,
        isLoading: loading,
        error: error ? new Error(error) : null
    };
}
