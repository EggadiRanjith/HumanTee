import { Controller, Get, Post, Body, Param, UseGuards, Req } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { SettingsCacheService } from './settings-cache.service';
import { AdminJwtGuard } from '../auth/guards/admin-jwt.guard';
import { AdminGuard } from '../auth/guards/admin.guard';

@Controller('admin/settings')
@UseGuards(AdminJwtGuard, AdminGuard)
export class SettingsController {
    constructor(
        private readonly settingsService: SettingsService,
        private readonly settingsCacheService: SettingsCacheService,
    ) { }

    /**
     * Get all settings for a section
     * GET /admin/settings/header-footer
     */
    @Get(':section')
    async getSection(@Param('section') section: string) {
        return this.settingsService.getSection(section);
    }

    /**
     * Update section settings
     * POST /admin/settings/header-footer
     * Body: { brand_name: "...", logo_url: "...", ... }
     */
    @Post(':section')
    async updateSection(
        @Param('section') section: string,
        @Body() data: Record<string, any>,
        @Req() req: any
    ) {
        const userId = req.user?.id;
        await this.settingsService.updateSection(section, data, userId, 'Admin update');

        // Clear feature cache when features are updated
        if (section === 'features') {
            this.settingsCacheService.clearFeatureCache();
        }

        return { message: 'Settings updated successfully' };
    }

    /**
     * Get setting history
     * GET /admin/settings/history/header-footer.brand_name
     */
    @Get('history/:key')
    async getHistory(@Param('key') key: string) {
        return this.settingsService.getHistory(key);
    }

    /**
     * Rollback to previous version
     * POST /admin/settings/rollback/:historyId
     */
    @Post('rollback/:historyId')
    async rollback(
        @Param('historyId') historyId: string,
        @Req() req: any
    ) {
        const userId = req.user?.id;
        await this.settingsService.rollback(historyId, userId);
        return { message: 'Rolled back successfully' };
    }

    /**
     * Get all settings (for debugging)
     * GET /admin/settings
     */
    @Get()
    async getAll() {
        return this.settingsService.getAll();
    }
}
