/**
 * Custom hook for Footer settings management
 * ✅ OPTIMIZED: Uses shared SettingsContext (no individual API call)
 */

"use client";

import { useSettings } from "@/app/contexts/SettingsContext";
import fallbackSettings from "@/config/fallback-settings.json";
import type { FooterSettings } from "../types";

export function useFooterSettings() {
    const { settings, loading, error } = useSettings();

    // Extract header-footer settings with fallback
    const headerFooter = settings?.['header-footer'] || fallbackSettings['header-footer'];

    return {
        settings: {
            brand_name: headerFooter?.brand_name || "HumanTee",
            tagline: headerFooter?.tagline || "",
            logo_url: headerFooter?.logo_url || null,
            social_links: headerFooter?.social_links || {},
            contact: headerFooter?.contact || {},
        } as FooterSettings,
        isLoading: loading,
        error: error ? new Error(error) : null
    };
}
