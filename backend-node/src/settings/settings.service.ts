import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import { Setting } from '../entities/setting.entity';
import { SettingHistory } from '../entities/setting-history.entity';
import { SettingsVersion } from '../entities/settings-version.entity';

@Injectable()
export class SettingsService {
    constructor(
        @InjectRepository(Setting)
        private readonly settingRepository: Repository<Setting>,
        @InjectRepository(SettingHistory)
        private readonly historyRepository: Repository<SettingHistory>,
        @InjectRepository(SettingsVersion)
        private readonly versionRepository: Repository<SettingsVersion>,
        private readonly entityManager: EntityManager,
    ) { }

    /**
     * Get all settings for a section
     */
    async getSection(section: string, environment: string = 'production'): Promise<Record<string, any>> {
        const settings = await this.settingRepository.find({
            where: {
                section,
                environment,
                isActive: true,
                isPublished: true,
            }
        });

        // Convert to object, removing section prefix from keys
        return settings.reduce((acc, setting) => {
            const shortKey = setting.key.replace(`${section}.`, '');
            acc[shortKey] = setting.value;
            return acc;
        }, {});
    }

    /**
     * Get multiple sections in ONE database query (optimized)
     */
    async getMultipleSections(sections: string[], environment: string = 'production'): Promise<Record<string, Record<string, any>>> {
        // Single query with IN clause
        const settings = await this.settingRepository
            .createQueryBuilder('setting')
            .where('setting.section IN (:...sections)', { sections })
            .andWhere('setting.environment = :environment', { environment })
            .andWhere('setting.isActive = :isActive', { isActive: true })
            .andWhere('setting.isPublished = :isPublished', { isPublished: true })
            .getMany();

        // Group by section
        return settings.reduce((acc, setting) => {
            if (!acc[setting.section]) {
                acc[setting.section] = {};
            }
            const shortKey = setting.key.replace(`${setting.section}.`, '');
            acc[setting.section][shortKey] = setting.value;
            return acc;
        }, {} as Record<string, Record<string, any>>);
    }

    /**
     * Update section settings (ATOMIC with validation and history)
     */
    async updateSection(
        section: string,
        data: Record<string, any>,
        userId?: string,
        reason?: string,
        environment: string = 'production'
    ): Promise<void> {
        // Run in atomic transaction
        await this.entityManager.transaction(async (manager) => {
            for (const [shortKey, value] of Object.entries(data)) {
                const fullKey = `${section}.${shortKey}`;

                // Find existing setting
                const existing = await manager.findOne(Setting, {
                    where: {
                        key: fullKey,
                        environment,
                        isActive: true
                    }
                });

                if (existing) {
                    // Save old value to history BEFORE updating
                    await manager.insert(SettingHistory, {
                        settingId: existing.id,
                        key: existing.key,
                        value: existing.value,
                        environment: existing.environment,
                        changedBy: userId,
                        adminId: userId, // Match legacy DB column
                        settings: data,   // Snapshot of current update
                        changeReason: reason,
                        previousVersion: existing.version,
                    });

                    // OPTIMISTIC LOCKING: Update only if version matches
                    const result = await manager.update(
                        Setting,
                        {
                            id: existing.id,
                            version: existing.version,
                        },
                        {
                            value,
                            section, // Ensure section is preserved/updated
                            version: existing.version + 1,
                            updatedAt: new Date(),
                        }
                    );

                    // Check if update succeeded (version conflict detection)
                    if (result.affected === 0) {
                        throw new ConflictException(
                            `Setting "${fullKey}" was modified by another process. Please refresh and try again.`
                        );
                    }
                } else {
                    // Create new setting
                    await manager.insert(Setting, {
                        key: fullKey,
                        value,
                        section, // Store section for filtering
                        environment,
                    });
                }
            }
        });

        // Cache invalidates automatically via database trigger
    }

    /**
     * Get setting history
     */
    async getHistory(key: string, environment: string = 'production', limit: number = 10): Promise<SettingHistory[]> {
        return this.historyRepository.find({
            where: { key, environment },
            order: { changedAt: 'DESC' },
            take: limit,
        });
    }

    /**
     * Rollback to previous version
     */
    async rollback(historyId: string, userId: string): Promise<void> {
        await this.entityManager.transaction(async (manager) => {
            // Find history entry
            const history = await manager.findOne(SettingHistory, {
                where: { id: historyId }
            });

            if (!history) {
                throw new NotFoundException('History entry not found');
            }

            // Find current setting
            const setting = await manager.findOne(Setting, {
                where: {
                    key: history.key,
                    environment: history.environment,
                    isActive: true
                }
            });

            if (setting) {
                // Save current state to history
                await manager.insert(SettingHistory, {
                    settingId: setting.id,
                    key: setting.key,
                    value: setting.value,
                    environment: setting.environment,
                    changedBy: userId,
                    changeReason: `Rollback to version from ${history.changedAt}`,
                    previousVersion: setting.version,
                });

                // Restore old value
                await manager.update(
                    Setting,
                    { id: setting.id },
                    {
                        value: history.value,
                        section: setting.section, // Preserve section
                        version: setting.version + 1,
                    }
                );
            }
        });
    }

    /**
     * Get global version (for cache invalidation)
     */
    async getGlobalVersion(): Promise<number> {
        const version = await this.versionRepository.findOne({
            where: { id: 1 }
        });
        return version?.version || 1;
    }

    /**
     * Get all settings (for export/debugging)
     */
    async getAll(environment: string = 'production'): Promise<Record<string, any>> {
        const settings = await this.settingRepository.find({
            where: {
                environment,
                isActive: true,
                isPublished: true,
            }
        });

        return settings.reduce((acc, setting) => {
            acc[setting.key] = setting.value;
            return acc;
        }, {});
    }

    /**
     * Get system features (audit logs, discounts, tickets)
     */
    async getSystemFeatures(environment: string = 'production'): Promise<any> {
        const features = await this.getSection('system', environment);

        // Return with defaults if not set (Disabled by default as per requirement)
        return {
            adminAuditLogsEnabled: features.adminAuditLogsEnabled ?? false,
            adminAuditLogsDisabledSince: features.adminAuditLogsDisabledSince ?? null,
            userAuditLogsEnabled: features.userAuditLogsEnabled ?? false,
            userAuditLogsDisabledSince: features.userAuditLogsDisabledSince ?? null,
            discountsEnabled: features.discountsEnabled ?? false,
            discountsDisabledSince: features.discountsDisabledSince ?? null,
            ticketsEnabled: features.ticketsEnabled ?? false,
            ticketsDisabledSince: features.ticketsDisabledSince ?? null,
            auditLogsEnabled: features.auditLogsEnabled ?? false, // Legacy fallback
        };
    }

    /**
     * Update system features
     */
    async updateSystemFeatures(
        data: Partial<any>,
        userId?: string,
        environment: string = 'production'
    ): Promise<void> {
        // Add timestamps for disabled features
        const updates: Record<string, any> = {};

        if (data.adminAuditLogsEnabled !== undefined) {
            updates.adminAuditLogsEnabled = data.adminAuditLogsEnabled;
            updates.adminAuditLogsDisabledSince = !data.adminAuditLogsEnabled ? new Date().toISOString() : null;
        }

        if (data.userAuditLogsEnabled !== undefined) {
            updates.userAuditLogsEnabled = data.userAuditLogsEnabled;
            updates.userAuditLogsDisabledSince = !data.userAuditLogsEnabled ? new Date().toISOString() : null;
        }

        if (data.auditLogsEnabled !== undefined) {
            updates.auditLogsEnabled = data.auditLogsEnabled;
            updates.auditLogsDisabledSince = !data.auditLogsEnabled ? new Date().toISOString() : null;
        }

        if (data.discountsEnabled !== undefined) {
            updates.discountsEnabled = data.discountsEnabled;
            updates.discountsDisabledSince = !data.discountsEnabled ? new Date().toISOString() : null;
        }

        if (data.ticketsEnabled !== undefined) {
            updates.ticketsEnabled = data.ticketsEnabled;
            updates.ticketsDisabledSince = !data.ticketsEnabled ? new Date().toISOString() : null;
        }

        await this.updateSection('system', updates, userId, 'System features updated', environment);
    }
}
