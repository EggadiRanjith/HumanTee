/**
 * Custom hook for Footer settings management
 * Handles settings fetch with proper error handling and fallback
 */

"use client";

import { useState, useEffect } from "react";
import { logError } from '@/lib/logger';
import { settingsApi } from "@/lib/api/settings";
import fallbackSettings from "@/config/fallback-settings.json";
import type { FooterSettings } from "../types";

export function useFooterSettings() {
    // Initialize with fallback settings
    const [settings, setSettings] = useState<FooterSettings>({
        brand_name: fallbackSettings['header-footer']?.brand_name || "HumanTee",
        logo_url: fallbackSettings['header-footer']?.logo_url || null,
        tagline: fallbackSettings['header-footer']?.tagline || "Premium Custom Apparel",
        social_links: fallbackSettings['header-footer']?.social_links || {
            instagram: "",
            maps: ""
        },
        contact: fallbackSettings['header-footer']?.contact || {
            email: "",
            phone: ""
        }
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
                    const hf = data['header-footer'];
                    const fb = fallbackSettings['header-footer'];

                    setSettings({
                        brand_name: hf.brand_name || fb?.brand_name || "HumanTee",
                        logo_url: hf.logo_url || fb?.logo_url || null,
                        tagline: hf.tagline || fb?.tagline || "Premium Custom Apparel",
                        social_links: hf.social_links || fb?.social_links || {
                            instagram: "",
                            maps: ""
                        },
                        contact: hf.contact || fb?.contact || {
                            email: "",
                            phone: ""
                        }
                    });
                }
                // If data is null/invalid, keep fallback settings from initial state
            })
            .catch((err) => {
                if (!mounted) return;
                setError(err);
                logError(err, 'Failed to load footer settings, using fallback');
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
