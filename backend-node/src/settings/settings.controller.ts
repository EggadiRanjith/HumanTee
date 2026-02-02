import { Controller, Get, Post, Body, Param, UseGuards, Req } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { SettingsCacheService } from './settings-cache.service';
import { AdminJwtGuard } from '../auth/guards/admin-jwt.guard';
import { AdminGuard } from '../auth/guards/admin.guard';
import { AdminAuditService } from '../auth/admin-audit.service';

@Controller('admin/settings')
@UseGuards(AdminJwtGuard, AdminGuard)
export class SettingsController {
    constructor(
        private readonly settingsService: SettingsService,
        private readonly settingsCacheService: SettingsCacheService,
        private readonly adminAuditService: AdminAuditService,
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

        // Get before state
        const before = await this.settingsService.getSection(section);

        await this.settingsService.updateSection(section, data, userId, 'Admin update');

        // Audit log
        await this.adminAuditService.logAction({
            adminId: userId,
            adminEmail: req.user?.email,
            eventType: 'SETTINGS_UPDATE',
            entityType: 'settings',
            entityId: section,
            entityName: `${section} settings`,
            before,
            after: data,
            changes: this.adminAuditService.calculateChanges(before, data),
            ipAddress: req.ip,
            userAgent: req.headers['user-agent'],
        });

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

    /**
     * Get system features (audit logs, discounts, tickets)
     * GET /admin/settings/system-features
     */
    @Get('system-features')
    async getSystemFeatures() {
        return this.settingsService.getSystemFeatures();
    }

    /**
     * Update system features
     * POST /admin/settings/system-features
     * Body: { auditLogsEnabled: true, discountsEnabled: false, ... }
     */
    @Post('system-features')
    async updateSystemFeatures(
        @Body() data: any,
        @Req() req: any
    ) {
        const userId = req.user?.id;

        // Get before state
        const before = await this.settingsService.getSystemFeatures();

        await this.settingsService.updateSystemFeatures(data, userId);

        // Audit log
        await this.adminAuditService.logAction({
            adminId: userId,
            adminEmail: req.user?.email,
            eventType: 'SYSTEM_FEATURES_UPDATE',
            entityType: 'settings',
            entityId: 'system-features',
            entityName: 'System Features',
            before,
            after: data,
            changes: this.adminAuditService.calculateChanges(before, data),
            ipAddress: req.ip,
            userAgent: req.headers['user-agent'],
        });

        return { message: 'System features updated successfully' };
    }
}
