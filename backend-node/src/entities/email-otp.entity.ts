import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from 'typeorm';

@Entity('email_otp_codes')
@Index(['email', 'used_at'])
@Index(['email', 'expires_at'])
@Index(['email', 'created_at'])
export class EmailOtp {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    email: string;

    @Column()
    otp_hash: string;

    @Column()
    expires_at: Date;

    @Column({ nullable: true })
    used_at: Date;

    @Column({ default: 0 })
    attempt_count: number;

    @CreateDateColumn()
    created_at: Date;
}
