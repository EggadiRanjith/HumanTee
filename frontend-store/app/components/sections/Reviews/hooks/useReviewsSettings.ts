/**
 * Reviews Settings Hook
 * ✅ OPTIMIZED: Uses shared SettingsContext
 */

"use client";

import { useSettings } from "@/app/contexts/SettingsContext";
import fallbackSettings from "@/config/fallback-settings.json";

export function useReviewsSettings() {
    const { settings, loading, error } = useSettings();

    // Group reviews settings into a shape that match other settings hooks
    const reviewsData = {
        items: settings?.homepage?.reviews?.reviews || fallbackSettings.homepage.reviews.items,
        enabled: settings?.homepage?.reviews_settings?.enabled ?? fallbackSettings.homepage.reviews.enabled,
        title: settings?.homepage?.reviews_settings?.title || "Customer Reviews"
    };

    return { settings: reviewsData, loading, error };
}
