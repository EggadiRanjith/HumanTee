import { Injectable, Logger } from '@nestjs/common';
import { CreateContactDto } from './dto/create-contact.dto';
import { EmailService } from '../email/email.service';

@Injectable()
export class ContactService {
    private readonly logger = new Logger(ContactService.name);

    constructor(private readonly emailService: EmailService) { }

    async submitContactForm(createContactDto: CreateContactDto): Promise<{ success: boolean; message: string }> {
        const { name, email, subject, message } = createContactDto;

        try {
            // Send email notification to support team
            await this.emailService.sendEmail({
                to: process.env.SUPPORT_EMAIL || 'humanteeofficial@gmail.com',
                subject: `[Contact Form] ${subject}`,
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <h2 style="color: #333;">New Contact Form Submission</h2>
                        <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
                            <p><strong>From:</strong> ${name}</p>
                            <p><strong>Email:</strong> ${email}</p>
                            <p><strong>Subject:</strong> ${subject}</p>
                        </div>
                        <div style="background: #fff; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
                            <h3 style="color: #555; margin-top: 0;">Message:</h3>
                            <p style="white-space: pre-wrap; line-height: 1.6;">${message}</p>
                        </div>
                        <p style="color: #888; font-size: 12px; margin-top: 20px;">
                            This email was sent from the HumanTee contact form.
                        </p>
                    </div>
                `,
            });

            // Send confirmation email to user
            await this.emailService.sendEmail({
                to: email,
                subject: 'We received your message - HumanTee',
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <h2 style="color: #333;">Thank you for contacting us!</h2>
                        <p>Hi ${name},</p>
                        <p>We've received your message and will get back to you within 24 hours.</p>
                        <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
                            <p><strong>Your message:</strong></p>
                            <p style="white-space: pre-wrap; line-height: 1.6;">${message}</p>
                        </div>
                        <p>Best regards,<br/>The HumanTee Team</p>
                        <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;" />
                        <p style="color: #888; font-size: 12px;">
                            If you have any urgent questions, you can also reach us at humanteeofficial@gmail.com
                        </p>
                    </div>
                `,
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
