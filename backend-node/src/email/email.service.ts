import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
    private readonly logger = new Logger(EmailService.name);
    private transporter: nodemailer.Transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || 'smtp.gmail.com',
            port: parseInt(process.env.SMTP_PORT || '587'),
            secure: process.env.SMTP_SECURE === 'true',
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD,
            },
            connectionTimeout: 10000, // 10 seconds
            greetingTimeout: 10000,
        });
    }

    async sendOtpEmail(email: string, otp: string): Promise<void> {
        const mailOptions = {
            from: process.env.SMTP_FROM || `HumanTee <${process.env.SMTP_USER}>`,
            to: email,
            subject: 'Your HumanTee Login Code',
            text: `Your verification code is: ${otp}\n\nThis code will expire in 10 minutes.\n\nFor security, do not share this code with anyone.\n\n- HumanTee Team`,
            // Plain text fallback required for security
        };

        try {
            await this.transporter.sendMail(mailOptions);
            // Do NOT log OTP
            this.logger.log(`OTP email sent to ${email.substring(0, 3)}***`);
        } catch (error) {
            this.logger.error(`Failed to send OTP email: ${error.message}`);
            throw error;
        }
    }
}
