/**
 * Hero Settings Hook
 * Fetches hero slides from API with fallback support
 */

"use client";

import { useState, useEffect } from "react";
import { HeroSlide, HeroSettings } from "../types";
import fallbackSettings from "@/config/fallback-settings.json";

export function useHeroSettings() {
    const [settings, setSettings] = useState<HeroSettings>({
        slides: fallbackSettings.homepage.hero.slides as HeroSlide[],
    });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        async function fetchHeroSettings() {
            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
                const response = await fetch(`${apiUrl}/api/settings/hero`, {
                    cache: "no-store",
                });

                if (!response.ok) {
                    throw new Error(`API responded with status: ${response.status}`);
                }

                const data = await response.json();

                // Map API response to HeroSettings
                if (data?.slides && Array.isArray(data.slides)) {
                    setSettings({
                        slides: data.slides,
                    });
                }
            } catch (err) {
                console.warn("⚠️ Failed to fetch hero settings, using fallback:", err);
                setError(err as Error);
                // Keep fallback settings (already set in initial state)
            } finally {
                setIsLoading(false);
            }
        }

        fetchHeroSettings();
    }, []);

    return { settings, isLoading, error };
}
