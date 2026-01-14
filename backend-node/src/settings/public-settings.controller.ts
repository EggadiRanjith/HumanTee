import { Controller, Get, Param, Logger } from '@nestjs/common';
import { SettingsService } from './settings.service';

@Controller('public/settings')
export class PublicSettingsController {
    private readonly logger = new Logger(PublicSettingsController.name);

    // In-memory cache
    private settingsCache: { data: any; expires: number } | null = null;
    private readonly CACHE_TTL = 3600000; // 1 hour

    constructor(private readonly settingsService: SettingsService) { }

    /**
     * Get public settings (no auth required)
     * GET /public/settings
     */
    @Get()
    async getPublicSettings() {
        try {
            // ✅ Check cache first
            if (this.settingsCache && Date.now() < this.settingsCache.expires) {
                this.logger.debug('Returning cached settings');
                return {
                    success: true,
                    data: this.settingsCache.data
                };
            }

            // ✅ OPTIMIZED: Get all sections in ONE database query
            const sections = await this.settingsService.getMultipleSections(
                ['homepage', 'header-footer', 'shipping', 'policies', 'product-info'],
                'production'
            );

            // ✅ Cache the result
            this.settingsCache = {
                data: sections,
                expires: Date.now() + this.CACHE_TTL
            };

            this.logger.debug('Settings fetched from DB and cached');

            return {
                success: true,
                data: sections
            };
        } catch (error) {
            this.logger.error('Failed to load public settings:', error);
            return {
                success: false,
                error: 'Failed to load settings'
            };
        }
    }

    /**
     * Clear cache (call this after admin updates settings)
     * Internal use only
     */
    clearCache() {
        this.settingsCache = null;
        this.logger.log('Settings cache cleared');
    }
}
