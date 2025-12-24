import { Controller, Get, Param } from '@nestjs/common';
import { SettingsService } from './settings.service';

@Controller('public/settings')
export class PublicSettingsController {
    constructor(private readonly settingsService: SettingsService) { }

    /**
     * Get public settings (no auth required)
     * GET /public/settings
     */
    @Get()
    async getPublicSettings() {
        try {
            // Get all public settings sections
            const headerFooter = await this.settingsService.getSection('header-footer', 'production');
            const shipping = await this.settingsService.getSection('shipping', 'production');
            const policies = await this.settingsService.getSection('policies', 'production');
            const productInfo = await this.settingsService.getSection('product-info', 'production');

            return {
                success: true,
                data: {
                    'header-footer': headerFooter,
                    'shipping': shipping,
                    'policies': policies,
                    'product-info': productInfo
                }
            };
        } catch (error) {
            console.error('Failed to load public settings:', error);
            return {
                success: false,
                error: 'Failed to load settings'
            };
        }
    }

    /**
     * Get specific section settings (no auth required)
     * GET /public/settings/:section
     * Example: GET /public/settings/homepage
     */
    @Get(':section')
    async getSection(@Param('section') section: string) {
        try {
            const data = await this.settingsService.getSection(section, 'production');
            return {
                success: true,
                data
            };
        } catch (error) {
            console.error(`Failed to load ${section} settings:`, error);
            return {
                success: false,
                error: `Failed to load ${section} settings`
            };
        }
    }
}
