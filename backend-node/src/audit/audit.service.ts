import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { AuditLog } from './entities/audit-log.entity';
import { AuditEventType, AuditEntityType } from './audit-event.enum';

interface LogParams {
    adminId: string;
    adminEmail: string;
    eventType: AuditEventType;
    entityType: AuditEntityType;
    entityId?: string;
    before?: any;
    after?: any;
    ipAddress?: string;
    userAgent?: string;
}

/**
 * Audit Service
 * Core service for logging all admin actions
 * CRITICAL: This is the accountability layer
 */
@Injectable()
export class AuditService {
    constructor(
        @InjectRepository(AuditLog)
        private readonly auditLogRepo: Repository<AuditLog>,
    ) { }

    /**
     * Log an admin action
     * Automatically calculates diff between before/after states
     */
    async log(params: LogParams): Promise<AuditLog> {
        const changes = this.calculateDiff(params.before, params.after);

        const auditLog = this.auditLogRepo.create({
            admin_id: params.adminId,
            admin_email: params.adminEmail,
            event_type: params.eventType,
            entity_type: params.entityType,
            entity_id: params.entityId,
            before: params.before,
            after: params.after,
            changes,
            ip_address: params.ipAddress,
            user_agent: params.userAgent,
        });

        return this.auditLogRepo.save(auditLog);
    }

    /**
     * Calculate diff between before and after states
     * Returns only the fields that changed
     */
    private calculateDiff(before: any, after: any): any {
        if (!before || !after) {
            return null;
        }

        const changes: any = {};

        // Get all unique keys from both objects
        const allKeys = new Set([
            ...Object.keys(before),
            ...Object.keys(after),
        ]);

        for (const key of allKeys) {
            const beforeValue = before[key];
            const afterValue = after[key];

            // Skip if values are the same
            if (JSON.stringify(beforeValue) === JSON.stringify(afterValue)) {
                continue;
            }

            changes[key] = {
                from: beforeValue,
                to: afterValue,
            };
        }

        return Object.keys(changes).length > 0 ? changes : null;
    }

    /**
     * Get audit logs with filters
     */
    async findAll(filters: {
        adminId?: string;
        eventType?: AuditEventType;
        entityType?: AuditEntityType;
        entityId?: string;
        startDate?: Date;
        endDate?: Date;
        limit?: number;
        offset?: number;
    }): Promise<{ logs: AuditLog[]; total: number }> {
        const query = this.auditLogRepo.createQueryBuilder('audit_log');

        if (filters.adminId) {
            query.andWhere('audit_log.admin_id = :adminId', {
                adminId: filters.adminId,
            });
        }

        if (filters.eventType) {
            query.andWhere('audit_log.event_type = :eventType', {
                eventType: filters.eventType,
            });
        }

        if (filters.entityType) {
            query.andWhere('audit_log.entity_type = :entityType', {
                entityType: filters.entityType,
            });
        }

        if (filters.entityId) {
            query.andWhere('audit_log.entity_id = :entityId', {
                entityId: filters.entityId,
            });
        }

        if (filters.startDate && filters.endDate) {
            query.andWhere('audit_log.created_at BETWEEN :startDate AND :endDate', {
                startDate: filters.startDate,
                endDate: filters.endDate,
            });
        }

        query.orderBy('audit_log.created_at', 'DESC');

        const total = await query.getCount();

        if (filters.limit) {
            query.limit(filters.limit);
        }

        if (filters.offset) {
            query.offset(filters.offset);
        }

        const logs = await query.getMany();

        return { logs, total };
    }

    /**
     * Get audit logs for a specific entity
     */
    async getEntityHistory(
        entityType: AuditEntityType,
        entityId: string,
    ): Promise<AuditLog[]> {
        return this.auditLogRepo.find({
            where: {
                entity_type: entityType,
                entity_id: entityId,
            },
            order: {
                created_at: 'DESC',
            },
        });
    }

    /**
     * Get recent activity for an admin
     */
    async getAdminActivity(
        adminId: string,
        limit: number = 50,
    ): Promise<AuditLog[]> {
        return this.auditLogRepo.find({
            where: {
                admin_id: adminId,
            },
            order: {
                created_at: 'DESC',
            },
            take: limit,
        });
    }

    /**
     * Get audit log statistics
     */
    async getStatistics(startDate: Date, endDate: Date): Promise<any> {
        const logs = await this.auditLogRepo.find({
            where: {
                created_at: Between(startDate, endDate),
            },
        });

        const stats = {
            total: logs.length,
            byEventType: {} as Record<string, number>,
            byEntityType: {} as Record<string, number>,
            byAdmin: {} as Record<string, number>,
        };

        logs.forEach((log) => {
            // Count by event type
            stats.byEventType[log.event_type] =
                (stats.byEventType[log.event_type] || 0) + 1;

            // Count by entity type
            stats.byEntityType[log.entity_type] =
                (stats.byEntityType[log.entity_type] || 0) + 1;

            // Count by admin
            stats.byAdmin[log.admin_email] =
                (stats.byAdmin[log.admin_email] || 0) + 1;
        });

        return stats;
    }
}
