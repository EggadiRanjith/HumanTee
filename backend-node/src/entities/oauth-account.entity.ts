import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import { AuthUser } from './auth-user.entity';

@Entity('oauth_accounts')
@Index(['provider', 'provider_user_id'], { unique: true })
export class OAuthAccount {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ nullable: false })
    user_id: string;

    @Column({ nullable: false })
    provider: string;

    @Column({ type: 'text', nullable: false })
    provider_user_id: string;

    @Column({ nullable: false })
    email: string;

    @CreateDateColumn()
    created_at: Date;

    @ManyToOne(() => AuthUser, (user) => user.oauth_accounts, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: AuthUser;
}
