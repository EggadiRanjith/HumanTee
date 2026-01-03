/**
 * Reviews Settings Hook
 * Fetches reviews from API with fallback support
 */

"use client";

import { useState, useEffect } from "react";
import { settingsApi } from "@/lib/api/settings";
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
                const data = await settingsApi.getPublicSettings();

                // Extract reviews from the unified settings response
                const reviewsData = data?.['homepage-reviews' as keyof typeof data] as any;
                if (reviewsData) {
                    setSettings({
                        enabled: reviewsData.enabled ?? true,
                        title: reviewsData.title || "What Our Customers Say",
                        items: reviewsData.items || reviewsData.reviews || [],
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
