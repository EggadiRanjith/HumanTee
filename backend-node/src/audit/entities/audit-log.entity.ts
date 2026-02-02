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
import { AuditEventType, AuditEntityType } from '../audit-event.enum';

/**
 * Audit Log Entity
 * Immutable record of all admin actions
 */
@Entity('audit_logs')
export class AuditLog {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'uuid' })
    @Index('IDX_AUDIT_LOGS_ADMIN_ID')
    admin_id: string;

    @Column({ type: 'varchar', length: 255 })
    admin_email: string;

    @Column({
        type: 'varchar',
        length: 50,
    })
    @Index('IDX_AUDIT_LOGS_EVENT_TYPE')
    event_type: AuditEventType;

    @Column({
        type: 'varchar',
        length: 50,
    })
    @Index('IDX_AUDIT_LOGS_ENTITY_TYPE')
    entity_type: AuditEntityType;

    @Column({ type: 'varchar', length: 255, nullable: true })
    @Index('IDX_AUDIT_LOGS_ENTITY_ID')
    entity_id?: string;

    @Column({ type: 'jsonb', nullable: true })
    before?: any;

    @Column({ type: 'jsonb', nullable: true })
    after?: any;

    @Column({ type: 'jsonb', nullable: true })
    changes?: any;

    @Column({ type: 'varchar', length: 45, nullable: true })
    ip_address?: string;

    @Column({ type: 'text', nullable: true })
    user_agent?: string;

    @CreateDateColumn()
    @Index('IDX_AUDIT_LOGS_CREATED_AT')
    created_at: Date;

    @ManyToOne(() => AuthUser, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'admin_id' })
    admin: AuthUser;
}
