import { Injectable } from '@nestjs/common';

export interface EmailTemplateData {
    title: string;
    preheader?: string;
    content: string; // trusted HTML only
    ctaText?: string;
    ctaUrl?: string;
    footerText?: string;
    accentColor?: string; // Optional brand color for this specific email
}

@Injectable()
export class EmailTemplateService {
    private readonly BRAND_COLOR = '#8B5CF6'; // Violet-500
    private readonly ACCENT_GRADIENT = 'linear-gradient(135deg, #7C3AED 0%, #C026D3 100%)';
    private readonly DARK_BG = '#0A0A0B';
    private readonly CARD_BG = '#141417';

    private escapeHtml(text: string): string {
        const map: Record<string, string> = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;',
        };
        return text.replace(/[&<>"']/g, (m) => map[m]);
    }

    generateEmail(data: EmailTemplateData): string {
        const {
            title,
            preheader = '',
            content,
            ctaText,
            ctaUrl,
            footerText,
        } = data;

        const safeTitle = this.escapeHtml(title);

        return `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>${safeTitle}</title>
    <style type="text/css">
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
        body { margin: 0; padding: 0; background-color: ${this.DARK_BG}; font-family: 'Inter', Arial, sans-serif; -webkit-font-smoothing: antialiased; }
        .wrapper { width: 100%; table-layout: fixed; background-color: ${this.DARK_BG}; padding-bottom: 40px; }
        .main { background-color: ${this.CARD_BG}; margin: 0 auto; width: 100%; max-width: 600px; border-spacing: 0; color: #E5E7EB; border: 1px solid rgba(255,255,255,0.08); border-radius: 24px; overflow: hidden; margin-top: 40px; }
        .header { padding: 40px 0 20px; text-align: center; }
        .content { padding: 0 40px 40px; }
        .footer { padding: 30px 40px; background-color: rgba(255,255,255,0.02); text-align: center; border-top: 1px solid rgba(255,255,255,0.05); }
        .button { background: ${this.ACCENT_GRADIENT}; padding: 16px 32px; border-radius: 12px; color: #ffffff !important; text-decoration: none; font-weight: 600; font-size: 14px; display: inline-block; letter-spacing: 0.5px; box-shadow: 0 4px 15px rgba(124, 58, 237, 0.3); }
        h1 { font-size: 24px; font-weight: 700; color: #ffffff; margin-bottom: 24px; letter-spacing: -0.02em; }
        p { font-size: 16px; line-height: 1.6; color: #9CA3AF; margin-bottom: 20px; }
        .logo { font-size: 20px; font-weight: 700; color: #ffffff; letter-spacing: 4px; text-transform: uppercase; }
        @media only screen and (max-width: 600px) {
            .main { border-radius: 0; margin-top: 0; }
            .content { padding: 0 24px 40px; }
        }
    </style>
</head>
<body>
    <div class="wrapper">
        ${preheader ? `<div style="display:none; max-height:0; overflow:hidden;">${this.escapeHtml(preheader)}</div>` : ''}
        <table class="main" align="center">
            <tr>
                <td class="header">
                    <div class="logo">HUMANTEE</div>
                </td>
            </tr>
            <tr>
                <td class="content">
                    <h1>${safeTitle}</h1>
                    ${content}
                    ${ctaText && ctaUrl ? `
                    <div style="margin-top: 32px; text-align: center;">
                        <a href="${ctaUrl}" class="button">${this.escapeHtml(ctaText)}</a>
                    </div>` : ''}
                </td>
            </tr>
            <tr>
                <td class="footer">
                    ${footerText ? `<p style="font-size: 13px; color: #6B7280; margin-bottom: 16px;">${this.escapeHtml(footerText)}</p>` : ''}
                    <div style="padding: 10px 0;">
                        <a href="https://instagram.com/humanteeofficial" style="color: #9CA3AF; text-decoration: none; font-size: 12px; margin: 0 10px; text-transform: uppercase; letter-spacing: 1px;">Instagram</a>
                        <span style="color: #374151;">|</span>
                        <a href="mailto:humanteeteam@gmail.com" style="color: #9CA3AF; text-decoration: none; font-size: 12px; margin: 0 10px; text-transform: uppercase; letter-spacing: 1px;">Support</a>
                    </div>
                    <p style="font-size: 11px; color: #4B5563; margin-top: 20px; margin-bottom: 0;">© ${new Date().getFullYear()} HUMANTEE. RAISING THE BAR IN STREETWEAR.</p>
                </td>
            </tr>
        </table>
    </div>
</body>
</html>`.trim();
    }

    generateOTPEmail(name: string, otp: string): string {
        const safeOtp = this.escapeHtml(otp);
        return this.generateEmail({
            title: 'Your Verification Code',
            preheader: `Use code ${safeOtp} to verify your session.`,
            content: `
                <p>Hi ${this.escapeHtml(name)},</p>
                <p>Here is your one-time verification code to securely access your HumanTee account.</p>
                <div style="background: rgba(255,255,255,0.03); border: 1px white solid; border-radius: 16px; padding: 40px; text-align: center; margin: 30px 0;">
                    <div style="font-size: 42px; font-weight: 700; color: #ffffff; letter-spacing: 12px; margin-left: 12px;">${safeOtp}</div>
                </div>
                <p style="font-size: 13px; text-align: center; color: #6B7280;">This code is valid for 10 minutes. For security, never share this code with anyone.</p>
            `,
            footerText: 'If you didn’t request this code, your account is still secure. No further action is needed.'
        });
    }

    generateWelcomeEmail(name: string, email: string): string {
        return this.generateEmail({
            title: 'Welcome to the Movement',
            preheader: 'You’re officially a part of HumanTee.',
            content: `
                <p>Hi ${this.escapeHtml(name)},</p>
                <p>The wait is over. You’re now part of an exclusive collective dedicated to premium craftsmanship and uncompromising streetwear.</p>
                
                <div style="background: ${this.ACCENT_GRADIENT}; padding: 1px; border-radius: 20px; margin: 32px 0;">
                    <div style="background: ${this.CARD_BG}; padding: 32px; border-radius: 19px;">
                        <h3 style="color: #ffffff; margin-top: 0; font-size: 18px;">Exclusive Member Access</h3>
                        <div style="display: table; width: 100%; margin-top: 20px;">
                            <div style="display: table-row;">
                                <div style="display: table-cell; padding-bottom: 15px; vertical-align: top; width: 30px; color: ${this.BRAND_COLOR}; font-size: 18px;">⚡</div>
                                <div style="display: table-cell; padding-bottom: 15px;">
                                    <strong style="color: #ffffff; display: block;">Early Access</strong>
                                    <span style="color: #6B7280; font-size: 13px;">Get first dibs on limited edition drops.</span>
                                </div>
                            </div>
                            <div style="display: table-row;">
                                <div style="display: table-cell; padding-bottom: 15px; vertical-align: top; width: 30px; color: ${this.BRAND_COLOR}; font-size: 18px;">📦</div>
                                <div style="display: table-cell; padding-bottom: 15px;">
                                    <strong style="color: #ffffff; display: block;">Free Shipping</strong>
                                    <span style="color: #6B7280; font-size: 13px;">Complimentary delivery on orders over ₹2000.</span>
                                </div>
                            </div>
                            <div style="display: table-row;">
                                <div style="display: table-cell; vertical-align: top; width: 30px; color: ${this.BRAND_COLOR}; font-size: 18px;">🎨</div>
                                <div style="display: table-cell;">
                                    <strong style="color: #ffffff; display: block;">Design Lounge</strong>
                                    <span style="color: #6B7280; font-size: 13px;">Direct line to our design and support team.</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <p style="text-align: center; margin-top: 40px;">Your journey to a refined wardrobe starts here.</p>
            `,
            ctaText: 'Visit the Shop',
            ctaUrl: 'https://www.humantee.in/shop',
            footerText: 'Share your fit using #HumanTee for a chance to be featured.'
        });
    }

    generateOrderConfirmation(
        orderId: string,
        orderNumber: string,
        customerName: string,
        items: Array<{ name: string; quantity: number; price: number; imageUrl?: string }>,
        subtotal: number,
        shipping: number,
        total: number,
        shippingAddress: string,
    ): string {
        const itemsHtml = items.map(item => `
            <tr>
                <td style="padding: 20px 0; border-bottom: 1px solid rgba(255,255,255,0.05); vertical-align: top; width: 80px;">
                    <div style="width: 70px; height: 70px; background-color: rgba(255,255,255,0.03); border-radius: 12px; overflow: hidden; border: 1px solid rgba(255,255,255,0.05);">
                        ${item.imageUrl ? `<img src="${item.imageUrl}" alt="${item.name}" style="width: 100%; height: 100%; object-fit: cover;" />` : `<div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; font-size: 10px; color: #4B5563; text-align: center; padding: 5px;">NO IMAGE</div>`}
                    </div>
                </td>
                <td style="padding: 20px 15px; border-bottom: 1px solid rgba(255,255,255,0.05); vertical-align: top;">
                    <div style="color: #ffffff; font-weight: 600; font-size: 15px;">${this.escapeHtml(item.name)}</div>
                    <div style="color: #6B7280; font-size: 12px; margin-top: 4px;">Quantity: ${item.quantity}</div>
                </td>
                <td style="padding: 20px 0; border-bottom: 1px solid rgba(255,255,255,0.05); text-align: right; color: #ffffff; font-weight: 600; vertical-align: top;">
                    ₹${item.price.toLocaleString()}
                </td>
            </tr>
        `).join('');

        return this.generateEmail({
            title: 'Order Confirmed',
            preheader: `Order #${orderNumber} is locked in.`,
            content: `
                <p>Hi ${this.escapeHtml(customerName)},</p>
                <p>We’ve received your order. Our team is now hand-selecting your pieces for fulfillment.</p>
                
                <div style="background: rgba(255,255,255,0.03); border-radius: 16px; padding: 24px; margin: 32px 0; border: 1px solid rgba(255,255,255,0.05);">
                    <div style="color: #6B7280; font-size: 11px; text-transform: uppercase; letter-spacing: 2px;">Order Identification</div>
                    <div style="color: #ffffff; font-size: 20px; font-weight: 700; margin-top: 6px; letter-spacing: -0.01em;">#${this.escapeHtml(orderNumber)}</div>
                </div>

                <h3 style="color: #ffffff; font-size: 18px; margin: 40px 0 20px;">Receipt Summary</h3>
                <table width="100%" style="border-collapse: collapse;">
                    ${itemsHtml}
                    <tr>
                        <td colspan="2" style="padding: 30px 0 8px; color: #9CA3AF; font-size: 14px;">Subtotal</td>
                        <td style="padding: 30px 0 8px; text-align: right; color: #ffffff; font-size: 14px;">₹${subtotal.toLocaleString()}</td>
                    </tr>
                    <tr>
                        <td colspan="2" style="padding: 8px 0; color: #9CA3AF; font-size: 14px;">Shipping</td>
                        <td style="padding: 8px 0; text-align: right; color: #ffffff; font-size: 14px;">₹${shipping.toLocaleString()}</td>
                    </tr>
                    <tr>
                        <td colspan="2" style="padding: 24px 0; color: #ffffff; font-size: 18px; font-weight: 700; border-top: 1px solid rgba(255,255,255,0.1);">Grand Total</td>
                        <td style="padding: 24px 0; text-align: right; color: #ffffff; font-size: 22px; font-weight: 700; border-top: 1px solid rgba(255,255,255,0.1);">₹${total.toLocaleString()}</td>
                    </tr>
                </table>

                <h3 style="color: #ffffff; font-size: 18px; margin: 40px 0 20px;">Shipping Destination</h3>
                <div style="background: rgba(255,255,255,0.03); border-radius: 16px; padding: 24px; color: #9CA3AF; line-height: 1.8; font-size: 14px; border: 1px solid rgba(255,255,255,0.05);">
                    ${this.escapeHtml(shippingAddress).replace(/\n/g, '<br/>')}
                </div>
            `,
            ctaText: 'Track Your Order',
            ctaUrl: `https://www.humantee.in/orders/${orderId}`,
            footerText: 'You will receive another update as soon as your shipment carries a tracking number.'
        });
    }

    generateContactConfirmation(name: string, message: string): string {
        return this.generateEmail({
            title: 'Message Received',
            preheader: 'We’re on it.',
            content: `
                <p>Hi ${this.escapeHtml(name)},</p>
                <p>Our support team has received your message. You can expect a response within one business day.</p>
                <div style="background: rgba(255,255,255,0.03); border-left: 4px solid ${this.BRAND_COLOR}; padding: 24px; border-radius: 0 16px 16px 0; margin: 30px 0;">
                    <p style="margin: 0; font-style: italic; color: #E5E7EB;">"${this.escapeHtml(message)}"</p>
                </div>
            `,
            footerText: 'Need to add more details? Just reply to this email.'
        });
    }

    generateContactNotification(
        name: string,
        email: string,
        subject: string,
        message: string,
    ): string {
        return this.generateEmail({
            title: 'New Support Inquiry',
            preheader: `From ${name} - ${subject}`,
            content: `
                <div style="background: rgba(255,255,255,0.03); padding: 24px; border-radius: 16px; margin-bottom: 24px;">
                    <div style="margin-bottom: 12px;"><strong style="color: #ffffff;">From:</strong> ${this.escapeHtml(name)} (${this.escapeHtml(email)})</div>
                    <div><strong style="color: #ffffff;">Subject:</strong> ${this.escapeHtml(subject)}</div>
                </div>
                <div style="background: rgba(255,255,255,0.03); padding: 24px; border-radius: 16px; white-space: pre-wrap; color: #E5E7EB; border: 1px solid rgba(255,255,255,0.1);">
                    ${this.escapeHtml(message)}
                </div>
            `,
            ctaText: 'Direct Reply',
            ctaUrl: `mailto:${this.escapeHtml(email)}?subject=Re: ${encodeURIComponent(subject)}`
        });
    }
}
