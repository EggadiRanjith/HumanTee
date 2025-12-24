const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export const settingsApi = {
    /**
     * Get public settings (no auth required)
     * Returns settings with fallback support
     */
    async getPublicSettings() {
        try {
            const response = await fetch(`${API_URL}/public/settings`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                cache: 'no-store', // Always fetch fresh data
            });

            if (!response.ok) {
                throw new Error('Failed to fetch settings');
            }

            const result = await response.json();

            if (result.success) {
                return result.data;
            } else {
                throw new Error(result.error || 'Settings fetch failed');
            }
        } catch (error) {
            console.error('Settings API error:', error);
            return null; // Return null to trigger fallback
        }
    }
};
