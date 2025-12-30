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

    async sendWelcomeEmail(email: string, name?: string): Promise<void> {
        const greeting = name ? `Welcome, ${name}!` : 'Welcome to HumanTee!';

        const mailOptions = {
            from: process.env.SMTP_FROM || `HumanTee <${process.env.SMTP_USER}>`,
            to: email,
            subject: 'Welcome to HumanTee! 🎉',
            text: `${greeting}\n\nThank you for joining HumanTee – where style meets comfort.\n\nWe're excited to have you as part of our community.\n\nStart shopping: ${process.env.FRONTEND_URL || 'http://localhost:3000'}\n\n- HumanTee Team`,
        };

        try {
            await this.transporter.sendMail(mailOptions);
            this.logger.log(`Welcome email sent to ${email.substring(0, 3)}***`);
        } catch (error) {
            this.logger.error(`Failed to send welcome email: ${error.message}`);
            // Don't throw - welcome email is nice-to-have, not critical
        }
    }

    async sendEmail(options: { to: string; subject: string; html?: string; text?: string }): Promise<void> {
        const mailOptions = {
            from: process.env.SMTP_FROM || `HumanTee <${process.env.SMTP_USER}>`,
            to: options.to,
            subject: options.subject,
            html: options.html,
            text: options.text,
        };

        try {
            await this.transporter.sendMail(mailOptions);
            this.logger.log(`Email sent to ${options.to}`);
        } catch (error) {
            this.logger.error(`Failed to send email: ${error.message}`);
            throw error;
        }
    }
}
