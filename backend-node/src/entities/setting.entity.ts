import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('settings')
export class Setting {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 255 })
    key: string;

    @Column({ type: 'jsonb' })
    value: any;

    @Column({ type: 'varchar', length: 20, default: 'production' })
    environment: string;

    @Column({ type: 'varchar', length: 50, nullable: true })
    section: string;

    @Column({ name: 'is_active', type: 'boolean', default: true })
    isActive: boolean;

    @Column({ name: 'is_published', type: 'boolean', default: true })
    isPublished: boolean;

    @Column({ type: 'integer', default: 1 })
    version: number;

    @Column({ type: 'text', nullable: true })
    description: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
