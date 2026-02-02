import { Injectable } from '@nestjs/common';
import { SettingsService } from './settings.service';

@Injectable()
export class SettingsCacheService {
    private cache: Map<string, { value: any; expiresAt: number }> = new Map();
    private readonly CACHE_TTL = 30 * 60 * 1000; // 30 minutes

    constructor(private readonly settingsService: SettingsService) { }

    /**
     * Check if a feature is enabled
     * Caches result for 30 minutes to reduce DB queries
     * 
     * @param featureKey - Feature key (e.g., 'user_audit_logs_enabled')
     * @returns Promise<boolean> - True if enabled, false if disabled
     */
    async isFeatureEnabled(featureKey: string): Promise<boolean> {
        const cacheKey = `feature:${featureKey}`;
        const cached = this.cache.get(cacheKey);

        // Return cached value if still valid
        if (cached && cached.expiresAt > Date.now()) {
            return cached.value;
        }

        // Fetch from database
        try {
            const features = await this.settingsService.getSection('system'); // Updated to use system section
            const isEnabled = features?.[featureKey] ?? false; // Default to disabled as per requirement

            // Cache result
            this.cache.set(cacheKey, {
                value: isEnabled,
                expiresAt: Date.now() + this.CACHE_TTL
            });

            return isEnabled;
        } catch (error) {
            console.error(`Failed to check feature ${featureKey}, defaulting to disabled:`, error.message);
            return false; // Fail-safe: disable by default
        }
    }

    /**
     * Clear all feature cache
     * Called when features are updated
     */
    clearFeatureCache() {
        let cleared = 0;
        for (const key of this.cache.keys()) {
            if (key.startsWith('feature:')) {
                this.cache.delete(key);
                cleared++;
            }
        }
        console.log(`✅ Cleared ${cleared} feature cache entries`);
    }
}
