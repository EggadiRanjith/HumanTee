import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { AdminJwtGuard } from '../auth/guards/admin-jwt.guard';
import { AdminGuard } from '../auth/guards/admin.guard';

@Controller('public-settings')
export class MaintenancePublicController {
    constructor(private readonly settingsService: SettingsService) { }

    @Get('maintenance')
    async getMaintenanceStatus() {
        const settings = await this.settingsService.getSection('maintenance');
        // Return default if not found
        return {
            enabled: settings?.enabled ?? false,
            title: settings?.title || "We'll Be Right Back",
            message: settings?.message || "We're making things even better. Check back soon.",
            estimatedTime: settings?.estimated_time || null,
            contactEmail: settings?.contact_email || 'support@humantee.com',
        };
    }
}

@Controller('admin/settings')
@UseGuards(AdminJwtGuard, AdminGuard)
export class MaintenanceAdminController {
    constructor(private readonly settingsService: SettingsService) { }

    @Post('maintenance')
    async updateMaintenanceSettings(
        @Body() data: Record<string, any>,
        @Req() req: any
    ) {
        const userId = req.user?.id;
        await this.settingsService.updateSection('maintenance', data, userId, 'Maintenance settings update');
        return { message: 'Maintenance settings updated successfully' };
    }
}
