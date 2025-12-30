import {
    Controller,
    Get,
    Query,
    UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { AdminGuard } from '../auth/guards/admin.guard';
import { AnalyticsService } from './analytics.service';
import { RevenueType } from './analytics.types';

@Controller('admin/analytics')
@UseGuards(JwtAuthGuard, AdminGuard)
export class AnalyticsController {
    constructor(private readonly analyticsService: AnalyticsService) { }

    /**
     * Get analytics data
     * GET /admin/analytics?timeRange=7d
     */
    @Get()
    async getAnalytics(@Query('timeRange') timeRange: string = '7d') {
        // Convert timeRange to period
        const now = new Date();
        let startDate = new Date();

        switch (timeRange) {
            case '7d':
                startDate.setDate(now.getDate() - 7);
                break;
            case '30d':
                startDate.setDate(now.getDate() - 30);
                break;
            case '90d':
                startDate.setDate(now.getDate() - 90);
                break;
            default:
                startDate.setDate(now.getDate() - 7);
        }

        const period = {
            startDate,
            endDate: now,
            timezone: 'Asia/Kolkata', // TODO: Get from settings
        };

        return this.analyticsService.getDashboard(period, RevenueType.NET);
    }
}
