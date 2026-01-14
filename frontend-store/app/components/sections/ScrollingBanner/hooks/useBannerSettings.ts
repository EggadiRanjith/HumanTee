/**
 * Banner Settings Hook
 * ✅ OPTIMIZED: Uses shared SettingsContext
 */

"use client";

import { useSettings } from "@/app/contexts/SettingsContext";
import fallbackSettings from "@/config/fallback-settings.json";

export function useBannerSettings() {
    const { settings, loading, error } = useSettings();

    const messages = settings?.homepage?.banner_messages?.messages || fallbackSettings.homepage.banner.messages;

    return { messages, loading, error };
}
