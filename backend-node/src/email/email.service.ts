import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import * as nodemailer from 'nodemailer';
import { EmailTemplateService } from './email-template.service';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter?: nodemailer.Transporter;
  private readonly provider = process.env.EMAIL_PROVIDER || 'SMTP';

  constructor(private readonly emailTemplateService: EmailTemplateService) {
    if (this.provider === 'SMTP') {
      this.transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASSWORD,
        },
      });
    }
  }

  async sendOTP(email: string, otp: string, name = 'User'): Promise<void> {
    const html = this.emailTemplateService.generateOTPEmail(name, otp);
    await this.sendEmail({
      to: email,
      subject: 'Your HumanTee Login Code',
      html,
    });
  }

  async sendWelcomeEmail(email: string, name?: string): Promise<void> {
    const greeting = name ? `Welcome, ${name}!` : 'Welcome to HumanTee!';
    await this.sendEmail({
      to: email,
      subject: 'Welcome to HumanTee 🎉',
      text: `${greeting}\n\nThanks for joining HumanTee.`,
    });
  }

  async sendEmail(options: {
    to: string;
    subject: string;
    html?: string;
    text?: string;
  }): Promise<void> {
    if (this.provider === 'SMTP') {
      await this.sendViaSMTP(options);
    } else {
      await this.sendViaApi(options);
    }
  }

  private async sendViaSMTP(options: any) {
    if (!this.transporter) throw new Error('SMTP transporter not initialized');

    await this.transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
    });

    this.logger.log(`SMTP email sent to ${options.to}`);
  }

  private async sendViaApi(options: any) {
    try {
      await axios.post(
        'https://api.brevo.com/v3/smtp/email',
        {
          sender: {
            name: 'HumanTee',
            email: process.env.EMAIL_FROM,
          },
          to: [{ email: options.to }],
          subject: options.subject,
          htmlContent: options.html,
          textContent: options.text,
        },
        {
          headers: {
            'api-key': process.env.BREVO_API_KEY,
            'Content-Type': 'application/json',
          },
          timeout: 5000,
        },
      );

      this.logger.log(`API email sent to ${options.to}`);
    } catch (err) {
      this.logger.error('Email API failed', err.response?.data || err.message);
      throw err;
    }
  }
}
