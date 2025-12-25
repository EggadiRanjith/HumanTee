/**
 * FeaturedProducts Settings Hook
 * Fetches featured section settings from API with config fallback
 */

"use client";

import { useState, useEffect } from "react";
import fallbackSettings from "@/config/fallback-settings.json";

interface FeaturedSettings {
    enabled: boolean;
    title: string;
    subtitle: string;
    actionText: string;
    actionHref: string;
    limit: number;
    showViewAll: boolean;
}

export function useFeaturedSettings() {
    const [settings, setSettings] = useState<FeaturedSettings>({
        enabled: fallbackSettings.homepage.featured_section.enabled,
        title: fallbackSettings.homepage.featured_section.title,
        subtitle: fallbackSettings.homepage.featured_section.subtitle,
        actionText: "View All",
        actionHref: "/shop",
        limit: 8,
        showViewAll: true,
    });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        async function fetchFeaturedSettings() {
            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
                const response = await fetch(`${apiUrl}/api/settings/featured`, {
                    cache: "no-store",
                });

                if (!response.ok) {
                    throw new Error(`API responded with status: ${response.status}`);
                }

                const data = await response.json();

                // Map API response to FeaturedSettings
                if (data) {
                    setSettings({
                        enabled: data.enabled ?? settings.enabled,
                        title: data.title || settings.title,
                        subtitle: data.subtitle || settings.subtitle,
                        actionText: data.actionText || settings.actionText,
                        actionHref: data.actionHref || settings.actionHref,
                        limit: data.limit || settings.limit,
                        showViewAll: data.showViewAll ?? settings.showViewAll,
                    });
                }
            } catch (err) {
                console.warn("⚠️ Failed to fetch featured settings, using config:", err);
                setError(err as Error);
                // Keep config settings (already set in initial state)
            } finally {
                setIsLoading(false);
            }
        }

        fetchFeaturedSettings();
    }, []);

    return { settings, isLoading, error };
}
