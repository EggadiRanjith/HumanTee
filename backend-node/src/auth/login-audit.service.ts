import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LoginAuditLog } from '../entities/login-audit-log.entity';

interface LogLoginParams {
    userId: string;
    userEmail: string;
    userType: 'USER' | 'ADMIN';
    eventType: 'LOGIN' | 'LOGOUT' | 'TOKEN_REFRESH';
    loginMethod?: string;
    ipAddress: string;
    userAgent?: string;
    success?: boolean;
}

@Injectable()
export class LoginAuditService {
    constructor(
        @InjectRepository(LoginAuditLog)
        private readonly loginAuditRepository: Repository<LoginAuditLog>,
    ) { }

    /**
     * Log a login/logout event for both users and admins
     */
    async logLogin(params: LogLoginParams): Promise<void> {
        try {
            const log = this.loginAuditRepository.create({
                userId: params.userId,
                userEmail: params.userEmail,
                userType: params.userType,
                eventType: params.eventType,
                loginMethod: params.loginMethod || null,
                ipAddress: params.ipAddress,
                userAgent: params.userAgent || null,
                success: params.success !== undefined ? params.success : true,
            } as any);

            await this.loginAuditRepository.save(log);
        } catch (error) {
            // Log error but don't throw - audit logging should never break the main flow
            console.error('Failed to log login audit:', error);
        }
    }

    /**
     * Get login logs for a specific user
     */
    async getUserLoginLogs(
        userId: string,
        limit: number = 50,
        offset: number = 0,
    ): Promise<{ logs: LoginAuditLog[]; total: number }> {
        const [logs, total] = await this.loginAuditRepository.findAndCount({
            where: { userId },
            order: { createdAt: 'DESC' },
            take: limit,
            skip: offset,
        });

        return { logs, total };
    }

    /**
     * Get all login logs (admin only)
     */
    async getAllLoginLogs(
        limit: number = 100,
        offset: number = 0,
        userType?: 'USER' | 'ADMIN',
    ): Promise<{ logs: LoginAuditLog[]; total: number }> {
        const where = userType ? { userType } : {};

        const [logs, total] = await this.loginAuditRepository.findAndCount({
            where,
            order: { createdAt: 'DESC' },
            take: limit,
            skip: offset,
        });

        return { logs, total };
    }
}
