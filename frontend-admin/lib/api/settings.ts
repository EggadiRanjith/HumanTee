import apiClient from '../api-client';

export const settingsApi = {
    /**
     * Get settings for a section
     * @param section - Section name (e.g., 'header-footer', 'homepage')
     */
    async getSection(section: string) {
        const response = await apiClient.get(`/admin/settings/${section}`);
        return response.data;
    },

    /**
     * Save settings for a section
     * @param section - Section name
     * @param data - Settings data object
     */
    async saveSection(section: string, data: Record<string, any>) {
        const response = await apiClient.post(`/admin/settings/${section}`, data);
        return response.data;
    },

    /**
     * Get history for a specific setting
     * @param key - Full key (e.g., 'header-footer.brand_name')
     */
    async getHistory(key: string) {
        const response = await apiClient.get(`/admin/settings/history/${key}`);
        return response.data;
    },

    /**
     * Rollback to a previous version
     * @param historyId - History entry ID
     */
    async rollback(historyId: string) {
        const response = await apiClient.post(`/admin/settings/rollback/${historyId}`);
        return response.data;
    },

    /**
     * Get all settings (for debugging)
     */
    async getAll() {
        const response = await apiClient.get('/admin/settings');
        return response.data;
    }
};
