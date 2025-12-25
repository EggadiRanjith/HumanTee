/**
 * Banner Settings Hook
 * Fetches banner messages from API with fallback support
 */

"use client";

import { useState, useEffect } from "react";
import fallbackSettings from "@/config/fallback-settings.json";

interface BannerSettings {
    messages: string[];
}

export function useBannerSettings() {
    const [settings, setSettings] = useState<BannerSettings>({
        messages: fallbackSettings.homepage.banner.messages as string[],
    });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        async function fetchBannerSettings() {
            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
                const response = await fetch(`${apiUrl}/api/settings/banner`, {
                    cache: "no-store",
                });

                if (!response.ok) {
                    throw new Error(`API responded with status: ${response.status}`);
                }

                const data = await response.json();

                if (data?.messages && Array.isArray(data.messages)) {
                    setSettings({
                        messages: data.messages,
                    });
                }
            } catch (err) {
                console.warn("⚠️ Failed to fetch banner settings, using fallback:", err);
                setError(err as Error);
            } finally {
                setIsLoading(false);
            }
        }

        fetchBannerSettings();
    }, []);

    return { settings, isLoading, error };
}
