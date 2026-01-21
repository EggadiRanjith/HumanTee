import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { AdminAuditLog } from '../entities/admin-audit-log.entity';
import { SettingsCacheService } from '../settings/settings-cache.service';

/**
 * Admin Audit Service
 * Handles logging and retrieval of admin actions
 */
@Injectable()
export class AdminAuditService {
    constructor(
        @InjectRepository(AdminAuditLog)
        private readonly auditLogRepo: Repository<AdminAuditLog>,
        @Inject(forwardRef(() => SettingsCacheService))
        private readonly settingsCacheService: SettingsCacheService,
    ) { }

    /**
     * Log an admin action
     * ✅ NOW CHECKS IF FEATURE IS ENABLED BEFORE LOGGING!
     */
    async logAction(data: {
        adminId: string;
        adminEmail: string;
        eventType: string;
        entityType: string;
        entityId: string;
        entityName?: string;
        before?: any;
        after?: any;
        changes?: any;
        ipAddress: string;
        userAgent?: string;
    }): Promise<AdminAuditLog | null> {
        try {
            // ✅ CHECK IF ADMIN AUDIT LOGGING IS ENABLED
            const loggingEnabled = await this.settingsCacheService.isFeatureEnabled('admin_audit_logs_enabled');

            if (!loggingEnabled) {
                // Skip logging when disabled (saves DB costs)
                return null;
            }

            const log = this.auditLogRepo.create({
                admin_id: data.adminId,
                admin_email: data.adminEmail,
                event_type: data.eventType,
                entity_type: data.entityType,
                entity_id: data.entityId,
                entity_name: data.entityName,
                before: data.before,
                after: data.after,
                changes: data.changes,
                ip_address: data.ipAddress,
                user_agent: data.userAgent,
            });

            return await this.auditLogRepo.save(log);
        } catch (error) {
            // Log error but don't throw - audit logging should never break the main flow
            console.error('Failed to log admin audit action:', error);
            return null;
        }
    }

    /**
     * Get audit logs with filters
     */
    async getAuditLogs(filters: {
        action?: string;
        userId?: string;
        startDate?: string;
        endDate?: string;
        limit?: number;
    }): Promise<any[]> {
        const query = this.auditLogRepo.createQueryBuilder('log')
            .orderBy('log.created_at', 'DESC');

        // Filter by event type
        if (filters.action) {
            query.andWhere('log.event_type = :action', { action: filters.action });
        }

        // Filter by admin user
        if (filters.userId) {
            query.andWhere('log.admin_id = :userId', { userId: filters.userId });
        }

        // Filter by date range
        if (filters.startDate && filters.endDate) {
            query.andWhere('log.created_at BETWEEN :startDate AND :endDate', {
                startDate: new Date(filters.startDate),
                endDate: new Date(filters.endDate),
            });
        }

        // Limit results
        query.limit(filters.limit || 100);

        const logs = await query.getMany();

        // Transform to match frontend format
        const transformed = logs.map(log => ({
            id: log.id,
            adminEmail: log.admin_email,
            eventType: log.event_type,
            entityType: log.entity_type,
            entityId: log.entity_id,
            entityName: log.entity_name,
            before: log.before,
            after: log.after,
            changes: log.changes,
            ipAddress: log.ip_address,
            userAgent: log.user_agent,
            createdAt: log.created_at,
        }));

        return transformed;
    }

    /**
     * Calculate changes between before and after states
     */
    calculateChanges(before: any, after: any): any {
        const changes: any = {};

        // Get all unique keys from both objects
        const allKeys = new Set([
            ...Object.keys(before || {}),
            ...Object.keys(after || {}),
        ]);

        for (const key of allKeys) {
            const beforeValue = before?.[key];
            const afterValue = after?.[key];

            // Only log if values are different
            if (JSON.stringify(beforeValue) !== JSON.stringify(afterValue)) {
                changes[key] = {
                    from: beforeValue,
                    to: afterValue,
                };
            }
        }

        return Object.keys(changes).length > 0 ? changes : null;
    }
}
