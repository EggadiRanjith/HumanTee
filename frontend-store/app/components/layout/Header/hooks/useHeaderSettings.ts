/**
 * Custom hook for Header settings management
 * Handles settings fetch with proper error handling and fallback
 */

"use client";

import { useState, useEffect } from "react";
import { settingsApi } from "@/lib/api/settings";
import fallbackSettings from "@/config/fallback-settings.json";
import type { HeaderSettings } from "../types";

export function useHeaderSettings() {
    // Initialize with fallback settings
    const [settings, setSettings] = useState<HeaderSettings>({
        brand_name: fallbackSettings['header-footer']?.brand_name || "HumanTee",
        logo_url: fallbackSettings['header-footer']?.logo_url || null,
    });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        let mounted = true;

        settingsApi
            .getPublicSettings()
            .then((data) => {
                if (!mounted) return;

                if (data?.['header-footer']) {
                    setSettings({
                        brand_name: data['header-footer'].brand_name || fallbackSettings['header-footer']?.brand_name || "HumanTee",
                        logo_url: data['header-footer'].logo_url || fallbackSettings['header-footer']?.logo_url || null,
                    });
                }
                // If data is null/invalid, keep fallback settings from initial state
            })
            .catch((err) => {
                if (!mounted) return;
                setError(err);
                console.error('Failed to load header settings, using fallback:', err);
                // Fallback already set in initial state
            })
            .finally(() => {
                if (!mounted) return;
                setIsLoading(false);
            });

        return () => {
            mounted = false;
        };
    }, []);

    return { settings, isLoading, error };
}
