import { Controller, Get, Param, Logger } from '@nestjs/common';
import { SettingsService } from './settings.service';

@Controller('public/settings')
export class PublicSettingsController {
    private readonly logger = new Logger(PublicSettingsController.name);

    constructor(private readonly settingsService: SettingsService) { }

    /**
     * Get public settings (no auth required)
     * GET /public/settings
     * 
     * Note: Caching is handled by Redis at the service layer
     */
    @Get()
    async getPublicSettings() {
        try {
            // ✅ OPTIMIZED: Get all sections in ONE database query
            // Caching handled by service layer (Redis)
            const sections = await this.settingsService.getMultipleSections(
                ['homepage', 'header-footer', 'shipping', 'policies', 'product-info'],
                'production'
            );

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
}
