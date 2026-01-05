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
     * Get advanced analytics data with comparison metrics
     * GET /admin/analytics?dateRange=30d
     */
    @Get()
    async getAnalytics(@Query('dateRange') dateRange: string = '30d') {
        // Convert dateRange to period
        const now = new Date();
        let startDate = new Date();

        switch (dateRange) {
            case '7d':
                startDate.setDate(now.getDate() - 7);
                break;
            case '30d':
                startDate.setDate(now.getDate() - 30);
                break;
            case '90d':
                startDate.setDate(now.getDate() - 90);
                break;
            case '1y':
                startDate.setFullYear(now.getFullYear() - 1);
                break;
            default:
                startDate.setDate(now.getDate() - 30);
        }

        const period = {
            startDate,
            endDate: now,
            timezone: 'Asia/Kolkata',
        };

        return this.analyticsService.getAdvancedAnalytics(period, RevenueType.NET);
    }
}
