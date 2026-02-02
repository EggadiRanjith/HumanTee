import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('settings_history')
export class SettingHistory {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'setting_id', type: 'uuid' })
    settingId: string;

    @Column({ type: 'varchar', length: 255 })
    key: string;

    @Column({ type: 'jsonb' })
    value: any;

    @Column({ type: 'varchar', length: 20 })
    environment: string;

    @Column({ name: 'changed_by', type: 'uuid', nullable: true })
    changedBy: string;

    @Column({ name: 'admin_id', type: 'uuid', nullable: true })
    adminId: string;

    @Column({ type: 'jsonb', nullable: true })
    settings: any;

    @Column({ name: 'change_reason', type: 'text', nullable: true })
    changeReason: string;

    @Column({ name: 'previous_version', type: 'integer' })
    previousVersion: number;

    @CreateDateColumn({ name: 'changed_at' })
    changedAt: Date;
}
