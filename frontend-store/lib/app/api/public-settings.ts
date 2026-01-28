/**
 * Public Settings API Client
 * Uses apiClient (single HTTP client). Caching via React Query in SettingsContext.
 */

import apiClient from '@/lib/api-client';

export const publicSettingsApi = {
    async getAll() {
        const res = await apiClient.get<{ data?: any }>('/public/settings');
        return res.data?.data ?? res.data;
    },

    /**
     * Get homepage settings (from all settings)
     */
    async getHomepage() {
        const allSettings = await this.getAll();
        return allSettings?.homepage || null;
    },

    /**
     * Get header-footer settings (from all settings)
     */
    async getHeaderFooter() {
        const allSettings = await this.getAll();
        return allSettings?.['header-footer'] || null;
    }
};
