import {
    Controller,
    Get,
    Query,
    UseGuards,
} from '@nestjs/common';
import { AdminJwtGuard } from '../auth/guards/admin-jwt.guard';
import { AdminGuard } from '../auth/guards/admin.guard';
import { AdminAuditService } from './admin-audit.service';
import { LoginAuditService } from './login-audit.service';

@Controller('admin/audit-logs')
@UseGuards(AdminJwtGuard, AdminGuard)
export class AuditLogsController {
    constructor(
        private readonly auditService: AdminAuditService,
        private readonly loginAuditService: LoginAuditService,
    ) { }

    /**
     * Get audit logs with filters
     * Combines admin actions from admin_audit_logs and login events from login_audit_logs
     * GET /admin/audit-logs?action=PRODUCT_UPDATED&userId=123
     */
    @Get()
    async getAuditLogs(
        @Query('action') action?: string,
        @Query('userId') userId?: string,
        @Query('startDate') startDate?: string,
        @Query('endDate') endDate?: string,
    ) {
        // Fetch admin actions from admin_audit_logs
        const adminLogs = await this.auditService.getAuditLogs({
            action,
            userId,
            startDate,
            endDate,
            limit: 100,
        });

        // Fetch login events from login_audit_logs (admin logins only)
        const { logs: loginLogs } = await this.loginAuditService.getAllLoginLogs(100, 0, 'ADMIN');

        // Transform login logs to match admin audit log format
        const transformedLoginLogs = loginLogs.map(log => ({
            id: log.id,
            adminEmail: log.userEmail,
            eventType: log.eventType === 'LOGIN' ? 'LOGIN_SUCCESS' : log.eventType,
            entityType: 'auth',
            entityId: log.userId,
            entityName: log.userEmail,
            before: null,
            after: {
                loginMethod: log.loginMethod,
                ipAddress: log.ipAddress,
                userAgent: log.userAgent,
                timestamp: log.createdAt,
            },
            changes: null,
            ipAddress: log.ipAddress,
            userAgent: log.userAgent,
            createdAt: log.createdAt,
        }));

        // Combine and sort by createdAt
        const combined = [...adminLogs, ...transformedLoginLogs]
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .slice(0, 100); // Limit to 100 total

        return combined;
    }
}
