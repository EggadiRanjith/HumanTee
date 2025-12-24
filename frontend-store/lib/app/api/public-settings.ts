/**
 * Public Settings API Client
 * Fetches settings from public endpoints (no authentication required)
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const publicSettingsApi = {
    /**
     * Get all public settings
     */
    async getAll() {
        const response = await fetch(`${API_BASE_URL}/public/settings`, {
            next: { revalidate: 300 } // Cache for 5 minutes
        });

        if (!response.ok) {
            throw new Error('Failed to fetch settings');
        }

        const result = await response.json();
        return result.data;
    },

    /**
     * Get settings for a specific section
     * @param section - Section name (e.g., 'homepage', 'header-footer')
     */
    async getSection(section: string) {
        const response = await fetch(`${API_BASE_URL}/public/settings/${section}`, {
            next: { revalidate: 300 } // Cache for 5 minutes
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch ${section} settings`);
        }

        const result = await response.json();
        return result.data;
    },

    /**
     * Get homepage settings
     */
    async getHomepage() {
        return this.getSection('homepage');
    },

    /**
     * Get header/footer settings
     */
    async getHeaderFooter() {
        return this.getSection('header-footer');
    }
};
