import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { EmailTemplateService } from './email-template.service';

@Injectable()
export class EmailService {
    private readonly logger = new Logger(EmailService.name);
    private transporter: nodemailer.Transporter;

    constructor(private readonly emailTemplateService: EmailTemplateService) {
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

    async sendOTP(email: string, otp: string, name: string = 'User'): Promise<void> {
        try {
            // Use luxury template for OTP email
            const html = this.emailTemplateService.generateOTPEmail(name, otp);

            await this.sendEmail({
                to: email,
                subject: 'Your HumanTee Login Code',
                html,
            });

            this.logger.log(`OTP email sent successfully to ${email}`);
        } catch (error) {
            this.logger.error(`Failed to send OTP email to ${email}:`, error);
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
