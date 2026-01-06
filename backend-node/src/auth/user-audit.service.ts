import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserAuditLog } from '../entities/user-audit-log.entity';

interface LogActionParams {
    userId: string;
    userEmail: string;
    eventType: string;
    entityType: string;
    entityId?: string;
    entityName?: string;
    before?: any;
    after?: any;
    changes?: any;
    ipAddress?: string;
    userAgent?: string;
}

@Injectable()
export class UserAuditService {
    constructor(
        @InjectRepository(UserAuditLog)
        private readonly auditLogRepository: Repository<UserAuditLog>,
    ) { }

    /**
     * Log a user action
     */
    async logAction(params: LogActionParams): Promise<void> {
        try {
            const log = this.auditLogRepository.create({
                userId: params.userId,
                userEmail: params.userEmail,
                eventType: params.eventType,
                entityType: params.entityType,
                entityId: params.entityId || null,
                entityName: params.entityName || null,
                before: params.before || null,
                after: params.after || null,
                changes: params.changes || null,
                ipAddress: params.ipAddress || null,
                userAgent: params.userAgent || null,
            });

            await this.auditLogRepository.save(log);
        } catch (error) {
            // Log error but don't throw - audit logging should never break the main flow
            console.error('Failed to log user audit action:', error);
        }
    }

    /**
     * Get audit logs for a specific user
     */
    async getUserAuditLogs(
        userId: string,
        limit: number = 50,
        offset: number = 0,
    ): Promise<{ logs: UserAuditLog[]; total: number }> {
        const [logs, total] = await this.auditLogRepository.findAndCount({
            where: { userId },
            order: { createdAt: 'DESC' },
            take: limit,
            skip: offset,
        });

        return { logs, total };
    }

    /**
     * Calculate changes between before and after states
     */
    calculateChanges(before: any, after: any): any {
        if (!before || !after) return null;

        const changes: any = {};
        const allKeys = new Set([
            ...Object.keys(before || {}),
            ...Object.keys(after || {}),
        ]);

        for (const key of allKeys) {
            if (JSON.stringify(before[key]) !== JSON.stringify(after[key])) {
                changes[key] = {
                    from: before[key],
                    to: after[key],
                };
            }
        }

        return Object.keys(changes).length > 0 ? changes : null;
    }
}
