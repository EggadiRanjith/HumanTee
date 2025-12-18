import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn } from 'typeorm';
import { AuthUser } from './auth-user.entity';

@Entity('user_profiles')
export class UserProfile {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true, nullable: false })
    auth_user_id: string;

    @Column({ nullable: false })
    full_name: string;

    @Column({ nullable: true })
    phone: string;

    @Column({ type: 'text', nullable: true })
    avatar_url: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @OneToOne(() => AuthUser, (user) => user.profile, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'auth_user_id' })
    auth_user: AuthUser;
}
