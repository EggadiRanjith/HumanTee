import {
    Controller,
    Get,
    Query,
    UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { AdminGuard } from '../auth/guards/admin.guard';
import { AdminAuditService } from './admin-audit.service';

@Controller('admin/audit-logs')
@UseGuards(JwtAuthGuard, AdminGuard)
export class AuditLogsController {
    constructor(private readonly auditService: AdminAuditService) { }

    /**
     * Get audit logs with filters
     * GET /admin/audit-logs?action=PRODUCT_UPDATED&userId=123
     */
    @Get()
    async getAuditLogs(
        @Query('action') action?: string,
        @Query('userId') userId?: string,
        @Query('startDate') startDate?: string,
        @Query('endDate') endDate?: string,
    ) {
        return this.auditService.getAuditLogs({
            action,
            userId,
            startDate,
            endDate,
            limit: 100,
        });
    }
}
