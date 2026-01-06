import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { AuthUser } from './auth-user.entity';

@Entity('user_audit_logs')
export class UserAuditLog {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'user_id', type: 'uuid' })
    userId: string;

    @Column({ name: 'user_email', type: 'varchar', length: 255 })
    userEmail: string;

    @Column({ name: 'event_type', type: 'varchar', length: 50 })
    eventType: string;

    @Column({ name: 'entity_type', type: 'varchar', length: 50 })
    entityType: string;

    @Column({ name: 'entity_id', type: 'varchar', length: 255, nullable: true })
    entityId: string | null;

    @Column({ name: 'entity_name', type: 'varchar', length: 255, nullable: true })
    entityName: string | null;

    @Column({ type: 'jsonb', nullable: true })
    before: any;

    @Column({ type: 'jsonb', nullable: true })
    after: any;

    @Column({ type: 'jsonb', nullable: true })
    changes: any;

    @Column({ name: 'ip_address', type: 'varchar', length: 45, nullable: true })
    ipAddress: string | null;

    @Column({ name: 'user_agent', type: 'text', nullable: true })
    userAgent: string | null;

    @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
    createdAt: Date;

    @ManyToOne(() => AuthUser)
    @JoinColumn({ name: 'user_id' })
    user: AuthUser;
}
