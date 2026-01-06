import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany, OneToOne } from 'typeorm';
import { RefreshToken } from './refresh-token.entity';
import { UserProfile } from './user-profile.entity';
import { OAuthAccount } from './oauth-account.entity';
import { Order } from './order.entity';
import { Ticket } from './ticket.entity';

@Entity('auth_users')
export class AuthUser {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true, nullable: false })
    email: string;

    @Column({ type: 'text', nullable: true })
    password_hash: string;

    @Column({ nullable: false })
    auth_provider: string;

    @Column({ default: true })
    is_active: boolean;

    @Column({ default: 'USER' })
    role: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @Column({ nullable: true })
    last_login_at: Date;

    @OneToMany(() => RefreshToken, (refreshToken) => refreshToken.user)
    refresh_tokens: RefreshToken[];

    @OneToMany(() => OAuthAccount, (oauthAccount) => oauthAccount.user)
    oauth_accounts: OAuthAccount[];

    @OneToOne(() => UserProfile, (profile) => profile.auth_user)
    profile: UserProfile;


    @OneToMany(() => Order, (order) => order.user)
    orders: Order[];

    @OneToMany(() => Ticket, (ticket) => ticket.user)
    tickets: Ticket[];
}
