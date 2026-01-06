import {
    Controller,
    Get,
    Query,
    UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { AdminGuard } from '../auth/guards/admin.guard';
import { UserAuditService } from '../auth/user-audit.service';
import { LoginAuditService } from '../auth/login-audit.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserAuditLog } from '../entities/user-audit-log.entity';

@Controller('admin/user-audit-logs')
@UseGuards(JwtAuthGuard, AdminGuard)
export class AdminUserAuditController {
    constructor(
        private readonly userAuditService: UserAuditService,
        private readonly loginAuditService: LoginAuditService,
        @InjectRepository(UserAuditLog)
        private readonly auditLogRepository: Repository<UserAuditLog>,
    ) { }

    @Get()
    async getAllUserAuditLogs(@Query() query: any) {
        const page = parseInt(query.page) || 1;
        const limit = parseInt(query.limit) || 1000;
        const userId = query.userId;
        const eventType = query.eventType;
        const search = query.search;

        // Fetch user activity logs from user_audit_logs table
        const queryBuilder = this.auditLogRepository
            .createQueryBuilder('log')
            .orderBy('log.created_at', 'DESC');

        // Filter by user ID
        if (userId) {
            queryBuilder.andWhere('log.user_id = :userId', { userId });
        }

        // Filter by event type (skip if it's a login event type)
        if (eventType && eventType !== 'all' && !['USER_LOGIN', 'USER_LOGOUT', 'USER_TOKEN_REFRESH'].includes(eventType)) {
            queryBuilder.andWhere('log.event_type = :eventType', { eventType });
        }

        // Search by email or entity name
        if (search) {
            queryBuilder.andWhere(
                '(log.user_email ILIKE :search OR log.entity_name ILIKE :search)',
                { search: `%${search}%` }
            );
        }

        const [activityLogs, activityTotal] = await queryBuilder
            .skip((page - 1) * limit)
            .take(limit)
            .getManyAndCount();

        // Fetch user login events from login_audit_logs table
        const { logs: loginLogs } = await this.loginAuditService.getAllLoginLogs(limit, 0, 'USER');

        // Transform login logs to match user audit log format
        const transformedLoginLogs = loginLogs.map(log => ({
            id: log.id,
            userId: log.userId,
            userEmail: log.userEmail,
            eventType: log.eventType === 'LOGIN' ? 'USER_LOGIN' : log.eventType === 'LOGOUT' ? 'USER_LOGOUT' : 'USER_TOKEN_REFRESH',
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
        const combinedLogs = [...activityLogs, ...transformedLoginLogs]
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .slice(0, limit);

        return {
            logs: combinedLogs,
            total: activityTotal + loginLogs.length,
            page,
            totalPages: Math.ceil((activityTotal + loginLogs.length) / limit),
        };
    }

    @Get('stats')
    async getUserAuditStats() {
        const stats = await this.auditLogRepository
            .createQueryBuilder('log')
            .select('log.event_type', 'eventType')
            .addSelect('COUNT(*)', 'count')
            .groupBy('log.event_type')
            .getRawMany();

        const totalLogs = await this.auditLogRepository.count();
        const last24Hours = await this.auditLogRepository
            .createQueryBuilder('log')
            .where('log.created_at > NOW() - INTERVAL \'24 hours\'')
            .getCount();

        return {
            totalLogs,
            last24Hours,
            byEventType: stats,
        };
    }
}
