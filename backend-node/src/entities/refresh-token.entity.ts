import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { AuthUser } from './auth-user.entity';

@Entity('refresh_tokens')
export class RefreshToken {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ nullable: false })
    user_id: string;

    @Column({ type: 'text', nullable: false })
    token_hash: string;

    @Column({ nullable: false })
    expires_at: Date;

    @Column({ nullable: true })
    revoked_at: Date;

    @CreateDateColumn()
    created_at: Date;

    @ManyToOne(() => AuthUser, (user) => user.refresh_tokens, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: AuthUser;
}
