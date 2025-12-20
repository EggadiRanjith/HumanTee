import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import { SettingsHistory } from './entities/settings-history.entity';
import { SettingsValidator } from './settings.validator';
import { StoreSettings } from './settings.types';
import { AuditService } from '../audit/audit.service';
import { AuditEventType, AuditEntityType } from '../audit/audit-event.enum';

/**
 * Settings Service
 * Manages store configuration with validation and rollback
 * CRITICAL: Prevents production outages from bad configs
 */
@Injectable()
export class SettingsService {
    constructor(
        @InjectRepository(SettingsHistory)
        private readonly settingsHistoryRepo: Repository<SettingsHistory>,
        private readonly validator: SettingsValidator,
        private readonly auditService: AuditService,
    ) { }

    /**
     * Get current active settings
     */
    async getActiveSettings(): Promise<StoreSettings> {
        const active = await this.settingsHistoryRepo.findOne({
            where: { is_active: true },
            order: { created_at: 'DESC' },
        });

        if (!active) {
            throw new NotFoundException('No active settings found');
        }

        return active.settings;
    }

    /**
     * Update settings with validation and rollback support
     * CRITICAL: This is the safe way to change settings
     */
    async updateSettings(
        adminId: string,
        adminEmail: string,
        newSettings: StoreSettings,
        notes?: string,
        ipAddress?: string,
        userAgent?: string,
    ): Promise<SettingsHistory> {
        // 1. Get current settings
        const currentSettings = await this.getActiveSettings();

        // 2. Validate new settings
        const validation = await this.validator.validate(newSettings);
        if (!validation.valid) {
            throw new BadRequestException({
                message: 'Settings validation failed',
                errors: validation.errors,
            });
        }

        // 3. Test configuration
        const test = await this.validator.testConfiguration(newSettings);
        if (!test.success) {
            throw new BadRequestException({
                message: 'Settings test failed',
                error: test.error,
                details: test.details,
            });
        }

        // 4. Calculate diff
        const diff = this.validator.getDiff(currentSettings, newSettings);

        // 5. Save to history
        const newHistory = this.settingsHistoryRepo.create({
            admin_id: adminId,
            settings: newSettings,
            is_active: true,
            validation_passed: true,
            test_passed: true,
            notes,
        });

        const saved = await this.settingsHistoryRepo.save(newHistory);

        // 6. Deactivate previous settings
        await this.settingsHistoryRepo.update(
            {
                is_active: true,
                id: Not(saved.id),
            },
            { is_active: false },
        );

        // 7. Log to audit
        await this.auditService.log({
            adminId,
            adminEmail,
            eventType: AuditEventType.SETTINGS_UPDATED,
            entityType: AuditEntityType.SETTINGS,
            entityId: saved.id,
            before: currentSettings,
            after: newSettings,
            ipAddress,
            userAgent,
        });

        return saved;
    }

    /**
     * Rollback to a previous settings version
     * CRITICAL: Recovery mechanism for bad configs
     */
    async rollback(
        adminId: string,
        adminEmail: string,
        historyId: string,
        ipAddress?: string,
        userAgent?: string,
    ): Promise<SettingsHistory> {
        // 1. Get the history record
        const history = await this.settingsHistoryRepo.findOne({
            where: { id: historyId },
        });

        if (!history) {
            throw new NotFoundException('Settings history not found');
        }

        // 2. Get current settings for audit
        const currentSettings = await this.getActiveSettings();

        // 3. Re-validate (in case validation rules changed)
        const validation = await this.validator.validate(history.settings);
        if (!validation.valid) {
            throw new BadRequestException({
                message: 'Cannot rollback: settings no longer valid',
                errors: validation.errors,
            });
        }

        // 4. Create new history entry (rollback is a new version)
        const rollbackHistory = this.settingsHistoryRepo.create({
            admin_id: adminId,
            settings: history.settings,
            is_active: true,
            validation_passed: true,
            test_passed: true,
            notes: `Rollback to version ${historyId}`,
        });

        const saved = await this.settingsHistoryRepo.save(rollbackHistory);

        // 5. Deactivate current
        await this.settingsHistoryRepo.update(
            {
                is_active: true,
                id: Not(saved.id),
            },
            { is_active: false },
        );

        // 6. Log to audit
        await this.auditService.log({
            adminId,
            adminEmail,
            eventType: AuditEventType.SETTINGS_UPDATED,
            entityType: AuditEntityType.SETTINGS,
            entityId: saved.id,
            before: currentSettings,
            after: history.settings,
            ipAddress,
            userAgent,
        });

        return saved;
    }

    /**
     * Get settings history
     */
    async getHistory(limit: number = 50): Promise<SettingsHistory[]> {
        return this.settingsHistoryRepo.find({
            order: { created_at: 'DESC' },
            take: limit,
            relations: ['admin'],
        });
    }

    /**
     * Get specific history version
     */
    async getHistoryVersion(id: string): Promise<SettingsHistory> {
        const history = await this.settingsHistoryRepo.findOne({
            where: { id },
            relations: ['admin'],
        });

        if (!history) {
            throw new NotFoundException('Settings history not found');
        }

        return history;
    }

    /**
     * Preview settings diff
     * Shows what will change without applying
     */
    async previewChanges(newSettings: StoreSettings): Promise<{
        diff: Record<string, { from: any; to: any }>;
        validation: { valid: boolean; errors: string[] };
    }> {
        const currentSettings = await this.getActiveSettings();
        const diff = this.validator.getDiff(currentSettings, newSettings);
        const validation = await this.validator.validate(newSettings);

        return { diff, validation };
    }
}
