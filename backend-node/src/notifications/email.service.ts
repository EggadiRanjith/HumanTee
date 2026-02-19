import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as nodemailer from 'nodemailer';
import * as handlebars from 'handlebars';
import * as fs from 'fs';
import * as path from 'path';
import { OrderNotification } from './entities/order-notification.entity';
import { Order, AuthUser } from '../entities';
import { NotificationType } from './enums/notification-type.enum';

/**
 * EmailService
 * Phase 7: Email notifications with persistent idempotency
 */
@Injectable()
export class EmailService {
    private readonly logger = new Logger(EmailService.name);
    private transporter: any;
    private templates: Map<string, HandlebarsTemplateDelegate> = new Map();

    constructor(
        @InjectRepository(OrderNotification)
        private notificationRepo: Repository<OrderNotification>,
    ) {
        // Initialize email transporter
        const smtpHost = process.env.SMTP_HOST;
        const smtpPort = process.env.SMTP_PORT;

        if (!smtpHost || !smtpPort) {
            this.transporter = null;
            return;
        }

        this.transporter = nodemailer.createTransport({
            host: smtpHost,
            port: parseInt(smtpPort),
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });

        // Precompile templates
        this.loadTemplates();
    }

    /**
     * Load and compile email templates
     */
    private loadTemplates() {
        const templatesDir = path.join(__dirname, 'templates');

        if (!fs.existsSync(templatesDir)) {
            return;
        }

        const templateFiles = ['order-confirmation.hbs', 'order-fulfilled.hbs'];

        for (const file of templateFiles) {
            const filePath = path.join(templatesDir, file);
            if (fs.existsSync(filePath)) {
                const source = fs.readFileSync(filePath, 'utf-8');
                const template = handlebars.compile(source);
                const name = file.replace('.hbs', '');
                this.templates.set(name, template);
            }
        }
    }

    /**
     * Send order confirmation email (CORRECTED: with idempotency)
     */
    async sendOrderConfirmation(order: Order, user: AuthUser): Promise<void> {
        if (!this.transporter) {
            return;
        }

        // CORRECTED: Check if already sent
        const existing = await this.notificationRepo.findOne({
            where: {
                orderId: order.id,
                type: NotificationType.ORDER_CONFIRMATION,
            },
        });

        if (existing) {
            return; // Idempotent - skip
        }

        // Get template
        const template = this.templates.get('order-confirmation');
        if (!template) {
            return;
        }

        // Render email
        const html = template({
            orderNumber: order.id.substring(0, 8).toUpperCase(),
            customerName: user.email,
            items: order.items?.map((item) => ({
                productTitle: item.productNameSnapshot,
                variantLabel: item.variantLabelSnapshot,
                quantity: item.quantity,
                priceSnapshot: parseFloat(item.unitPrice.toString()),
                currency: order.currency,
            })),
            totalAmount: parseFloat(order.totalAmount.toString()),
            currency: order.currency,
            supportEmail: process.env.SUPPORT_EMAIL || 'support@humantee.com',
        });

        // Send email
        await this.transporter.sendMail({
            from: process.env.SMTP_FROM || 'HumanTee <noreply@humantee.com>',
            to: user.email,
            subject: 'Order Confirmation - HumanTee',
            html,
        });

        // CORRECTED: Record sent notification
        const notification = this.notificationRepo.create({
            orderId: order.id,
            type: NotificationType.ORDER_CONFIRMATION,
            recipient: user.email,
        });
        await this.notificationRepo.save(notification);
    }

    /**
     * Send order fulfilled email (CORRECTED: with idempotency)
     */
    async sendOrderFulfilled(order: Order, user: AuthUser): Promise<void> {
        if (!this.transporter) {
            return;
        }

        // CORRECTED: Check if already sent
        const existing = await this.notificationRepo.findOne({
            where: {
                orderId: order.id,
                type: NotificationType.ORDER_FULFILLED,
            },
        });

        if (existing) {
            return; // Idempotent - skip
        }

        // Get template
        const template = this.templates.get('order-fulfilled');
        if (!template) {
            return;
        }

        // Render email
        const html = template({
            orderNumber: order.id.substring(0, 8).toUpperCase(),
            customerName: user.email,
            supportEmail: process.env.SUPPORT_EMAIL || 'support@humantee.com',
        });

        // Send email
        await this.transporter.sendMail({
            from: process.env.SMTP_FROM || 'HumanTee <noreply@humantee.com>',
            to: user.email,
            subject: 'Your Order Has Been Fulfilled - HumanTee',
            html,
        });

        // CORRECTED: Record sent notification
        const notification = this.notificationRepo.create({
            orderId: order.id,
            type: NotificationType.ORDER_FULFILLED,
            recipient: user.email,
        });
        await this.notificationRepo.save(notification);
    }
}
