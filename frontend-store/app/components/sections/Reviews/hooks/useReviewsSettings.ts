/**
 * Reviews Settings Hook
 * Fetches reviews from API with fallback support
 */

"use client";

import { useState, useEffect } from "react";
import fallbackSettings from "@/config/fallback-settings.json";
import { Review } from "@/app/types/review.types";

interface ReviewsSettings {
    enabled: boolean;
    title: string;
    items: Review[];
}

export function useReviewsSettings() {
    const [settings, setSettings] = useState<ReviewsSettings>({
        enabled: fallbackSettings.homepage.reviews.enabled,
        title: fallbackSettings.homepage.reviews.title,
        items: fallbackSettings.homepage.reviews.items as Review[],
    });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        async function fetchReviewsSettings() {
            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
                const response = await fetch(`${apiUrl}/api/settings/reviews`, {
                    cache: "no-store",
                });

                if (!response.ok) {
                    throw new Error(`API responded with status: ${response.status}`);
                }

                const data = await response.json();

                if (data) {
                    setSettings({
                        enabled: data.enabled ?? true,
                        title: data.title || "What Our Customers Say",
                        items: data.items || data.reviews || [],
                    });
                }
            } catch (err) {
                console.warn("⚠️ Failed to fetch reviews settings, using fallback:", err);
                setError(err as Error);
            } finally {
                setIsLoading(false);
            }
        }

        fetchReviewsSettings();
    }, []);

    return { settings, isLoading, error };
}
