/**
 * Shop Settings Hook
 * Fetches shop configuration from API with config fallback
 */

"use client";

import { useState, useEffect } from "react";
import fallbackSettings from "@/config/fallback-settings.json";

interface SortOption {
    value: string;
    label: string;
}

interface ShopSettings {
    categories: string[];
    collections: string[];
    itemsPerPage: number;
    defaultSort: string;
    showFilters: boolean;
    sortOptions: SortOption[];
}

export function useShopSettings() {
    const [settings, setSettings] = useState<ShopSettings>({
        categories: fallbackSettings.shop.categories || [],
        collections: fallbackSettings.shop.collections || [],
        itemsPerPage: fallbackSettings.shop.items_per_page || 12,
        defaultSort: fallbackSettings.shop.default_sort || 'newest',
        showFilters: fallbackSettings.shop.show_filters ?? true,
        sortOptions: fallbackSettings.shop.sort_options || [
            { value: 'newest', label: 'Newest First' },
            { value: 'price_asc', label: 'Price: Low to High' },
            { value: 'price_desc', label: 'Price: High to Low' },
        ],
    });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        async function fetchShopSettings() {
            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
                const response = await fetch(`${apiUrl}/api/settings/shop`, {
                    cache: "no-store",
                });

                if (!response.ok) {
                    throw new Error(`API responded with status: ${response.status}`);
                }

                const data = await response.json();

                // Map API response to ShopSettings
                if (data) {
                    setSettings({
                        categories: data.categories || settings.categories,
                        collections: data.collections || settings.collections,
                        itemsPerPage: data.itemsPerPage || settings.itemsPerPage,
                        defaultSort: data.defaultSort || settings.defaultSort,
                        showFilters: data.showFilters ?? settings.showFilters,
                        sortOptions: data.sortOptions || settings.sortOptions,
                    });
                }
            } catch (err) {
                console.warn("⚠️ Failed to fetch shop settings, using config:", err);
                setError(err as Error);
                // Keep config settings (already set in initial state)
            } finally {
                setIsLoading(false);
            }
        }

        fetchShopSettings();
    }, []);

    return { settings, isLoading, error };
}
