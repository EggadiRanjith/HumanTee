import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
    JoinColumn,
    Index,
} from 'typeorm';
import { AuthUser } from '../../entities/auth-user.entity';
import type { StoreSettings } from '../settings.types';

/**
 * Settings History Entity
 * Immutable record of all settings changes
 */
@Entity('settings_history')
export class SettingsHistory {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'uuid' })
    admin_id: string;

    @Column({ type: 'jsonb' })
    settings: StoreSettings;

    @Column({ type: 'boolean', default: false })
    @Index('IDX_SETTINGS_HISTORY_IS_ACTIVE')
    is_active: boolean;

    @Column({ type: 'boolean', default: true })
    validation_passed: boolean;

    @Column({ type: 'boolean', default: true })
    test_passed: boolean;

    @Column({ type: 'text', nullable: true })
    notes?: string;

    @CreateDateColumn()
    @Index('IDX_SETTINGS_HISTORY_CREATED_AT')
    created_at: Date;

    @ManyToOne(() => AuthUser, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'admin_id' })
    admin: AuthUser;
}
