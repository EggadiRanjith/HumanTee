import { Entity, Column, PrimaryColumn, UpdateDateColumn } from 'typeorm';

@Entity('settings_version')
export class SettingsVersion {
    @PrimaryColumn({ type: 'integer', default: 1 })
    id: number;

    @Column({ type: 'bigint', default: 1 })
    version: number;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
