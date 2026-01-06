import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { AuthUser } from './auth-user.entity';

@Entity('login_audit_logs')
export class LoginAuditLog {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'uuid', name: 'user_id' })
    userId: string;

    @Column({ type: 'varchar', length: 255, name: 'user_email' })
    userEmail: string;

    @Column({ type: 'varchar', length: 20, name: 'user_type' })
    userType: string; // 'USER' or 'ADMIN'

    @Column({ type: 'varchar', length: 50, name: 'event_type' })
    eventType: string; // 'LOGIN', 'LOGOUT', 'TOKEN_REFRESH'

    @Column({ type: 'varchar', length: 50, nullable: true, name: 'login_method' })
    loginMethod: string; // 'OTP', 'Google', etc.

    @Column({ type: 'varchar', length: 45, name: 'ip_address' })
    ipAddress: string;

    @Column({ type: 'text', nullable: true, name: 'user_agent' })
    userAgent: string;

    @Column({ type: 'boolean', default: true })
    success: boolean;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @ManyToOne(() => AuthUser, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: AuthUser;
}
