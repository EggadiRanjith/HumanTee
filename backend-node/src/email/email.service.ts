import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import * as nodemailer from 'nodemailer';
import { EmailTemplateService } from './email-template.service';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter?: nodemailer.Transporter;

  constructor(private readonly emailTemplateService: EmailTemplateService) {
    // Initialize SMTP as fallback (for development)
    if (this.canUseSMTP()) {
      this.transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASSWORD,
        },
      });
      this.logger.log('✅ SMTP transport initialized (fallback)');
    }

    if (this.canUseBrevo()) {
      this.logger.log('✅ Brevo API available (primary)');
    }
  }

  private canUseBrevo(): boolean {
    return !!(
      process.env.BREVO_API_KEY &&
      process.env.EMAIL_FROM
    );
  }

  private canUseSMTP(): boolean {
    return !!(
      process.env.SMTP_HOST &&
      process.env.SMTP_PORT &&
      process.env.SMTP_USER &&
      process.env.SMTP_PASSWORD
    );
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
      text: `${greeting}\\n\\nThanks for joining HumanTee.`,
    });
  }

  async sendOrderConfirmation(order: any, email: string, name: string): Promise<void> {
    const orderNumber = order.orderNumber || order.id.substring(0, 8).toUpperCase();
    const totalAmount = parseFloat(order.totalAmount || 0);

    // Build shipping address string from order.address relation or embedded address object
    const addr = order.address || order.shippingAddress || {};
    const shippingAddress = `${addr.fullName || name}
${addr.addressLine1 || addr.address || ''}${addr.addressLine2 ? '\n' + addr.addressLine2 : ''}${addr.landmark ? '\n' + addr.landmark : ''}
${addr.city || ''}, ${addr.state || ''} ${addr.postalCode || ''}
${addr.country || 'India'}`.trim();

    // Map order items to template format
    // Handle both array formats: order.items (from DB with relations) or order.orderItems
    const orderItems = order.items || order.orderItems || [];
    const items = orderItems.map((item: any) => ({
      name: `${item.productNameSnapshot || item.productName || 'Product'}${item.variantLabelSnapshot ? ' - ' + item.variantLabelSnapshot : ''}`,
      quantity: item.quantity || 1,
      price: parseFloat(item.unitPrice || item.price || 0),
      imageUrl: item.imageUrlSnapshot || item.imageUrl || '',
    }));

    const subtotal = parseFloat(order.subtotal || items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0));
    const shipping = parseFloat(order.shippingAmount || 0);

    const html = this.emailTemplateService.generateOrderConfirmation(
      order.id,
      orderNumber,
      name,
      items,
      subtotal,
      shipping,
      totalAmount,
      shippingAddress
    );

    await this.sendEmail({
      to: email,
      subject: `Order Confirmation - #${orderNumber}`,
      html,
    });

    this.logger.log(`📧 Order confirmation sent to ${email} for order ${order.id || orderNumber}`);
  }

  async sendEmail(options: {
    to: string;
    subject: string;
    html?: string;
    text?: string;
  }): Promise<void> {
    // Priority 1: Try Brevo API (production)
    if (this.canUseBrevo()) {
      try {
        await this.sendViaBrevo(options);
        return;
      } catch (err) {
        this.logger.warn('Brevo API failed, trying SMTP fallback...', err.message);
      }
    }

    // Priority 2: Fallback to SMTP (development or Brevo failure)
    if (this.canUseSMTP()) {
      try {
        await this.sendViaSMTP(options);
        return;
      } catch (err) {
        this.logger.error('SMTP also failed!', err.message);
        throw new Error('All email delivery methods failed');
      }
    }

    // No email provider configured
    this.logger.error('❌ No email provider configured (Brevo or SMTP)');
    throw new Error('Email not configured');
  }

  private async sendViaSMTP(options: any) {
    if (!this.transporter) {
      throw new Error('SMTP transporter not initialized');
    }

    await this.transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.EMAIL_FROM,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
    });

    this.logger.log(`✅ SMTP email sent to ${options.to}`);
  }

  private async sendViaBrevo(options: any) {
    await axios.post(
      'https://api.brevo.com/v3/smtp/email',
      {
        sender: {
          name: 'HumanTee',
          email: process.env.EMAIL_FROM || 'noreply@humantee.com',
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

    this.logger.log(`✅ Brevo API email sent to ${options.to}`);
  }
}
