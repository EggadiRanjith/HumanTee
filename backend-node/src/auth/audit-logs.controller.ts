import {
    Controller,
    Get,
    Query,
    UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { AdminGuard } from '../auth/guards/admin.guard';

@Controller('admin/audit-logs')
@UseGuards(JwtAuthGuard, AdminGuard)
export class AuditLogsController {
    /**
     * Get audit logs
     * GET /admin/audit-logs?action=login&userId=123
     */
    @Get()
    async getAuditLogs(
        @Query('action') action?: string,
        @Query('userId') userId?: string,
        @Query('startDate') startDate?: string,
        @Query('endDate') endDate?: string,
    ) {
        // TODO: Implement actual audit logs when audit log system is built
        // For now, return empty array to prevent 404
        return [];
    }
}
