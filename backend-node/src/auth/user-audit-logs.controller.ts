import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { AdminGuard } from '../auth/guards/admin.guard';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { LoginAuditLog } from '../entities/login-audit-log.entity';

@Controller('admin/user-audit-logs')
@UseGuards(JwtAuthGuard, AdminGuard)
export class UserAuditLogsController {
    constructor(
        @InjectRepository(LoginAuditLog)
        private readonly loginAuditRepo: Repository<LoginAuditLog>,
    ) { }

    /**
     * Get user audit logs (login attempts)
     * GET /admin/user-audit-logs?dateRange=7d
     */
    @Get()
    async getUserAuditLogs(@Query('dateRange') dateRange: string = '7d') {
        const now = new Date();
        let startDate = new Date();

        switch (dateRange) {
            case '1d':
                startDate.setDate(now.getDate() - 1);
                break;
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

        const logs = await this.loginAuditRepo.find({
            where: {
                created_at: Between(startDate, now),
            },
            relations: ['user', 'user.profile'],
            order: {
                created_at: 'DESC',
            },
            take: 200, // Limit to last 200 logs
        });

        return logs;
    }
}
