import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('email_otp_codes')
export class EmailOtpCode {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ nullable: false })
    email: string;

    @Column({ type: 'text', nullable: false })
    otp_hash: string;

    @Column({ nullable: false })
    expires_at: Date;

    @Column({ nullable: true })
    used_at: Date;

    @CreateDateColumn()
    created_at: Date;
}
