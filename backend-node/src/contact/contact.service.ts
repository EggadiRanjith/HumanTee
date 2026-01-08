import { Injectable, Logger } from '@nestjs/common';
import { CreateContactDto } from './dto/create-contact.dto';
import { EmailService } from '../email/email.service';
import { EmailTemplateService } from '../email/email-template.service';

@Injectable()
export class ContactService {
    private readonly logger = new Logger(ContactService.name);

    constructor(
        private readonly emailService: EmailService,
        private readonly emailTemplateService: EmailTemplateService
    ) { }

    async submitContactForm(createContactDto: CreateContactDto): Promise<{ success: boolean; message: string }> {
        const { name, email, subject, message } = createContactDto;

        try {
            // Send email notification to support team using luxury template
            const supportEmailHtml = this.emailTemplateService.generateContactNotification(
                name,
                email,
                subject,
                message
            );

            await this.emailService.sendEmail({
                to: process.env.SUPPORT_EMAIL || 'humanteeofficial@gmail.com',
                subject: `[Contact Form] ${subject}`,
                html: supportEmailHtml,
            });

            // Send confirmation email to user using luxury template
            const confirmationEmailHtml = this.emailTemplateService.generateContactConfirmation(
                name,
                message
            );

            await this.emailService.sendEmail({
                to: email,
                subject: 'We received your message - HumanTee',
                html: confirmationEmailHtml,
            });

            this.logger.log(`Contact form submitted by ${email}`);

            return {
                success: true,
                message: 'Thank you! Your message has been sent successfully. We\'ll get back to you within 24 hours.',
            };
        } catch (error) {
            this.logger.error(`Failed to send contact form email: ${error.message}`, error.stack);
            throw new Error('Failed to send message. Please try again later or contact us directly at humanteeofficial@gmail.com');
        }
    }
}
