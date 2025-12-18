import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { AuthUser } from './auth-user.entity';

@Entity('login_audit_logs')
export class LoginAuditLog {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ nullable: true })  // Nullable for OTP events before user identified
    user_id: string;

    @Column({ type: 'text', nullable: false })
    ip_address: string;

    @Column({ type: 'text', nullable: false })
    user_agent: string;

    @Column({ nullable: false })
    success: boolean;

    @CreateDateColumn()
    created_at: Date;

    @ManyToOne(() => AuthUser, (user) => user.login_audit_logs, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: AuthUser;
}
