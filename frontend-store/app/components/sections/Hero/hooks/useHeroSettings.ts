/**
 * Custom hook for Hero settings management
 * ✅ OPTIMIZED: Uses shared SettingsContext (no individual API call)
 */

"use client";

import { useSettings } from "@/app/contexts/SettingsContext";
import fallbackSettings from "@/config/fallback-settings.json";
import { HeroSettings } from "../types";

export function useHeroSettings() {
    const { settings, loading, error } = useSettings();

    // Extract hero slides with fallback
    const heroSlides = settings?.homepage?.hero_slides?.slides || fallbackSettings.homepage.hero.slides;

    return {
        settings: {
            slides: heroSlides
        } as HeroSettings,
        loading,
        error
    };
}
