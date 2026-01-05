import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { AuthUser } from './auth-user.entity';

/**
 * Admin Audit Log Entity
 * Tracks all admin actions for accountability
 * CRITICAL: This is the accountability layer
 */
@Entity('admin_audit_logs')
export class AdminAuditLog {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'uuid' })
    admin_id: string;

    @Column({ type: 'varchar', length: 255 })
    admin_email: string;

    @Column({ type: 'varchar', length: 100 })
    event_type: string; // PRODUCT_CREATED, ORDER_STATUS_CHANGED, etc.

    @Column({ type: 'varchar', length: 50 })
    entity_type: string; // product, order, customer, settings, etc.

    @Column({ type: 'varchar', length: 255 })
    entity_id: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    entity_name: string; // Human-readable identifier (SKU, name, ticket number, etc.)

    @Column({ type: 'jsonb', nullable: true })
    before: any; // State before change

    @Column({ type: 'jsonb', nullable: true })
    after: any; // State after change

    @Column({ type: 'jsonb', nullable: true })
    changes: any; // Specific changes { field: { from, to } }

    @Column({ type: 'varchar', length: 45 })
    ip_address: string;

    @Column({ type: 'text', nullable: true })
    user_agent: string;

    @CreateDateColumn()
    created_at: Date;

    @ManyToOne(() => AuthUser, { onDelete: 'SET NULL' })
    @JoinColumn({ name: 'admin_id' })
    admin: AuthUser;
}
