import { Controller, Get, Param, Logger } from '@nestjs/common';
import { SettingsService } from './settings.service';

@Controller('public/settings')
export class PublicSettingsController {
    private readonly logger = new Logger(PublicSettingsController.name);

    constructor(private readonly settingsService: SettingsService) { }

    /**
     * Get public settings (no auth required)
     * GET /public/settings
     */
    @Get()
    async getPublicSettings() {
        try {
            // Get all public settings sections
            const homepage = await this.settingsService.getSection('homepage', 'production');
            const headerFooter = await this.settingsService.getSection('header-footer', 'production');
            const shipping = await this.settingsService.getSection('shipping', 'production');
            const policies = await this.settingsService.getSection('policies', 'production');
            const productInfo = await this.settingsService.getSection('product-info', 'production');

            return {
                success: true,
                data: {
                    'homepage': homepage,
                    'header-footer': headerFooter,
                    'shipping': shipping,
                    'policies': policies,
                    'product-info': productInfo
                }
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
