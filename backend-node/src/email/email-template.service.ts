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

    // Light Theme (Default)
    private readonly LIGHT_BG = '#FFFFFF';
    private readonly LIGHT_CARD = '#F9FAFB';
    private readonly LIGHT_TEXT = '#111827';
    private readonly LIGHT_MUTED = '#4B5563';
    private readonly LIGHT_BORDER = '#E5E7EB';

    // Dark Theme (System Override)
    private readonly DARK_BG = '#0A0A0B';
    private readonly DARK_CARD = '#141417';
    private readonly DARK_TEXT = '#F3F4F6';
    private readonly DARK_MUTED = '#9CA3AF';
    private readonly DARK_BORDER = '#262626';

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
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <meta name="color-scheme" content="light dark">
    <meta name="supported-color-schemes" content="light dark">
    <title>${safeTitle}</title>
    <style type="text/css">
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
        
        :root {
            color-scheme: light dark;
            supported-color-schemes: light dark;
        }

        body { 
            margin: 0; 
            padding: 0; 
            background-color: ${this.LIGHT_BG}; 
            font-family: 'Inter', system-ui, -apple-system, sans-serif; 
            -webkit-font-smoothing: antialiased; 
            color: ${this.LIGHT_TEXT};
        }

        .wrapper { 
            width: 100%; 
            table-layout: fixed; 
            background-color: #F3F4F6; 
            padding: 40px 0; 
        }

        .main { 
            background-color: ${this.LIGHT_BG}; 
            margin: 0 auto; 
            width: 100%; 
            max-width: 600px; 
            border-spacing: 0; 
            border: 1px solid ${this.LIGHT_BORDER}; 
            border-radius: 24px; 
            overflow: hidden; 
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
        }

        .header { padding: 48px 0 24px; text-align: center; }
        .content { padding: 0 48px 48px; }
        .footer { 
            padding: 40px 48px; 
            background-color: #F9FAFB; 
            text-align: center; 
            border-top: 1px solid ${this.LIGHT_BORDER}; 
        }

        .button { 
            background: ${this.ACCENT_GRADIENT}; 
            padding: 18px 36px; 
            border-radius: 12px; 
            color: #ffffff !important; 
            text-decoration: none; 
            font-weight: 700; 
            font-size: 15px; 
            display: inline-block; 
            letter-spacing: 0.5px;
            box-shadow: 0 10px 15px -3px rgba(124, 58, 237, 0.3);
        }

        h1 { font-size: 28px; font-weight: 700; color: ${this.LIGHT_TEXT}; margin-bottom: 24px; letter-spacing: -0.02em; line-height: 1.2; }
        h3 { font-size: 18px; font-weight: 600; color: ${this.LIGHT_TEXT}; margin: 32px 0 16px; }
        p { font-size: 16px; line-height: 1.6; color: ${this.LIGHT_MUTED}; margin-bottom: 24px; }
        
        .logo { 
            font-size: 22px; 
            font-weight: 700; 
            color: ${this.LIGHT_TEXT}; 
            letter-spacing: 6px; 
            text-transform: uppercase; 
            display: inline-block;
            border-bottom: 3px solid ${this.BRAND_COLOR};
            padding-bottom: 2px;
        }

        /* Dark Mode Overrides */
        @media (prefers-color-scheme: dark) {
            body { background-color: ${this.DARK_BG} !important; color: ${this.DARK_TEXT} !important; }
            .wrapper { background-color: #000000 !important; }
            .main { background-color: ${this.DARK_BG} !important; border-color: ${this.DARK_BORDER} !important; box-shadow: none !important; }
            .footer { background-color: ${this.DARK_CARD} !important; border-top-color: ${this.DARK_BORDER} !important; }
            h1, h3, .logo { color: #FFFFFF !important; }
            p { color: ${this.DARK_MUTED} !important; }
            .card { background-color: ${this.DARK_CARD} !important; border-color: ${this.DARK_BORDER} !important; }
            .item-row { border-bottom-color: ${this.DARK_BORDER} !important; }
            .divider { border-top-color: ${this.DARK_BORDER} !important; }
        }

        @media only screen and (max-width: 600px) {
            .main { border-radius: 0; border: none; }
            .content { padding: 0 24px 48px; }
            .footer { padding: 40px 24px; }
            h1 { font-size: 24px; }
        }
    </style>
</head>
<body>
    <div class="wrapper">
        ${preheader ? `<div style="display:none; max-height:0; overflow:hidden;">${this.escapeHtml(preheader)}</div>` : ''}
        <table class="main" align="center" cellpadding="0" cellspacing="0">
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
                    <div style="margin-top: 40px; text-align: center;">
                        <a href="${ctaUrl}" class="button">${this.escapeHtml(ctaText)}</a>
                    </div>` : ''}
                </td>
            </tr>
            <tr>
                <td class="footer">
                    ${footerText ? `<p style="font-size: 13px; color: ${this.LIGHT_MUTED}; margin-bottom: 20px;">${this.escapeHtml(footerText)}</p>` : ''}
                    <div style="padding: 10px 0;">
                        <a href="https://instagram.com/humanteeofficial" style="color: ${this.BRAND_COLOR}; text-decoration: none; font-size: 11px; margin: 0 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">Instagram</a>
                        <span style="color: ${this.LIGHT_BORDER};">|</span>
                        <a href="mailto:humanteeteam@gmail.com" style="color: ${this.BRAND_COLOR}; text-decoration: none; font-size: 11px; margin: 0 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">Support</a>
                    </div>
                    <p style="font-size: 10px; color: #9CA3AF; margin-top: 32px; margin-bottom: 0; text-transform: uppercase; letter-spacing: 1px;">© ${new Date().getFullYear()} HUMANTEE. RAISING THE BAR IN STREETWEAR.</p>
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
            title: 'Verify Your Identity',
            preheader: `Your verification code is ${safeOtp}`,
            content: `
                <p>Hi ${this.escapeHtml(name)},</p>
                <p>Use the following one-time code to complete your secure login at HumanTee. This code will expire in 10 minutes.</p>
                
                <div class="card" style="background-color: #F9FAFB; border: 2px dashed ${this.LIGHT_BORDER}; border-radius: 16px; padding: 48px; text-align: center; margin: 32px 0;">
                    <div style="font-size: 48px; font-weight: 800; color: ${this.LIGHT_TEXT}; letter-spacing: 16px; margin-left: 16px;">${safeOtp}</div>
                </div>
                
                <p style="font-size: 14px; text-align: center; color: ${this.LIGHT_MUTED};">If you didn't request this, please ignore this email or contact support if you have concerns.</p>
            `,
            footerText: 'This is an automated security notification.'
        });
    }

    generateWelcomeEmail(name: string, email: string) {
        return this.generateEmail({
            title: 'Welcome to the Collective',
            preheader: 'You’re officially a part of HumanTee.',
            content: `
                <p>Hi ${this.escapeHtml(name)},</p>
                <p>Your journey into premium streetwear starts here. You've joined a movement dedicated to uncompromising quality and refined aesthetics.</p>
                
                <div class="card" style="background-color: #F9FAFB; border: 1px solid ${this.LIGHT_BORDER}; border-radius: 20px; padding: 32px; margin: 32px 0;">
                    <h3 style="margin-top: 0;">Member Benefits Unlocked:</h3>
                    <table width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                            <td style="padding: 12px 0; border-bottom: 1px solid ${this.LIGHT_BORDER};">
                                <strong style="color: ${this.LIGHT_TEXT};">Exclusive Drops</strong>
                                <div style="font-size: 13px; color: ${this.LIGHT_MUTED};">First access to limited-run collections.</div>
                            </td>
                        </tr>
                        <tr>
                            <td style="padding: 12px 0; border-bottom: 1px solid ${this.LIGHT_BORDER};">
                                <strong style="color: ${this.LIGHT_TEXT};">Free Shipping</strong>
                                <div style="font-size: 13px; color: ${this.LIGHT_MUTED};">Complimentary delivery on orders over ₹2000.</div>
                            </td>
                        </tr>
                        <tr>
                            <td style="padding: 12px 0;">
                                <strong style="color: ${this.LIGHT_TEXT};">Priority Support</strong>
                                <div style="font-size: 13px; color: ${this.LIGHT_MUTED};">Direct line to our design and support crew.</div>
                            </td>
                        </tr>
                    </table>
                </div>
                
                <p>We're excited to see how you wear the collection.</p>
            `,
            ctaText: 'Explore Shop',
            ctaUrl: 'https://www.humantee.in/shop',
            footerText: 'Use #HumanTee for a chance to be featured on our official channel.'
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
            <tr class="item-row">
                <td style="padding: 24px 0; border-bottom: 1px solid ${this.LIGHT_BORDER}; width: 80px; vertical-align: top;">
                    <div style="width: 70px; height: 90px; background-color: #F3F4F6; border-radius: 8px; overflow: hidden;">
                        ${item.imageUrl ? `<img src="${item.imageUrl}" alt="${item.name}" style="width: 100%; height: 100%; object-fit: cover;" />` : ''}
                    </div>
                </td>
                <td style="padding: 24px 16px; border-bottom: 1px solid ${this.LIGHT_BORDER}; vertical-align: top;">
                    <div style="color: ${this.LIGHT_TEXT}; font-weight: 700; font-size: 15px;">${this.escapeHtml(item.name)}</div>
                    <div style="color: ${this.LIGHT_MUTED}; font-size: 13px; margin-top: 4px;">Qty: ${item.quantity}</div>
                </td>
                <td style="padding: 24px 0; border-bottom: 1px solid ${this.LIGHT_BORDER}; text-align: right; color: ${this.LIGHT_TEXT}; font-weight: 700; vertical-align: top; font-size: 15px;">
                    ₹${item.price.toLocaleString()}
                </td>
            </tr>
        `).join('');

        return this.generateEmail({
            title: 'Order Confirmed',
            preheader: `Your order #${orderNumber} is being prepared.`,
            content: `
                <p>Hi ${this.escapeHtml(customerName)},</p>
                <p>Thank you for choosing HumanTee. We've received your order and our team is already working on getting it to you.</p>
                
                <div class="card" style="background-color: #F9FAFB; border: 1px solid ${this.LIGHT_BORDER}; border-radius: 16px; padding: 24px; margin: 32px 0;">
                    <div style="color: ${this.LIGHT_MUTED}; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Order Reference</div>
                    <div style="color: ${this.LIGHT_TEXT}; font-size: 20px; font-weight: 800; margin-top: 4px;">#${this.escapeHtml(orderNumber)}</div>
                </div>

                <h3>Recipient Summary</h3>
                <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse;">
                    ${itemsHtml}
                    <tr>
                        <td colspan="2" style="padding: 20px 0 8px; color: ${this.LIGHT_MUTED}; font-size: 14px;">Subtotal</td>
                        <td style="padding: 20px 0 8px; text-align: right; color: ${this.LIGHT_TEXT}; font-size: 14px; font-weight: 600;">₹${subtotal.toLocaleString()}</td>
                    </tr>
                    <tr>
                        <td colspan="2" style="padding: 8px 0; color: ${this.LIGHT_MUTED}; font-size: 14px;">Shipping</td>
                        <td style="padding: 8px 0; text-align: right; color: ${this.LIGHT_TEXT}; font-size: 14px; font-weight: 600;">₹${shipping.toLocaleString()}</td>
                    </tr>
                    <tr class="divider">
                        <td colspan="2" style="padding: 20px 0; color: ${this.LIGHT_TEXT}; font-size: 18px; font-weight: 800; border-top: 2px solid ${this.LIGHT_TEXT};">Total Paid</td>
                        <td style="padding: 20px 0; text-align: right; color: ${this.LIGHT_TEXT}; font-size: 24px; font-weight: 800; border-top: 2px solid ${this.LIGHT_TEXT};">₹${total.toLocaleString()}</td>
                    </tr>
                </table>

                <h3>Shipping Address</h3>
                <div class="card" style="background-color: #F9FAFB; border: 1px solid ${this.LIGHT_BORDER}; border-radius: 16px; padding: 24px; color: ${this.LIGHT_MUTED}; font-size: 14px; line-height: 1.6;">
                    ${this.escapeHtml(shippingAddress).replace(/\n/g, '<br/>')}
                </div>
            `,
            ctaText: 'Track Order Status',
            ctaUrl: `https://www.humantee.in/orders/${orderId}`,
            footerText: 'We will notify you once your package has been shipped.'
        });
    }

    generateContactConfirmation(name: string, message: string): string {
        return this.generateEmail({
            title: 'We’ve Received Your Inquiry',
            preheader: 'HumanTee Support Team is on it.',
            content: `
                <p>Hi ${this.escapeHtml(name)},</p>
                <p>Thank you for reaching out. We've received your message and our team will get back to you within 24-48 hours.</p>
                <div class="card" style="background-color: #F9FAFB; border-left: 4px solid ${this.BRAND_COLOR}; padding: 24px; border-radius: 0 16px 16px 0; margin: 32px 0;">
                    <p style="margin: 0; font-style: italic; color: ${this.LIGHT_TEXT};">"${this.escapeHtml(message)}"</p>
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
            title: 'New Support Request',
            preheader: `Inquiry from ${name}: ${subject}`,
            content: `
                <div class="card" style="background-color: #F9FAFB; padding: 24px; border-radius: 16px; margin-bottom: 24px; border: 1px solid ${this.LIGHT_BORDER};">
                    <div style="margin-bottom: 8px;"><strong style="color: ${this.LIGHT_TEXT};">From:</strong> ${this.escapeHtml(name)} (${this.escapeHtml(email)})</div>
                    <div><strong style="color: ${this.LIGHT_TEXT};">Subject:</strong> ${this.escapeHtml(subject)}</div>
                </div>
                <div class="card" style="background-color: #FFFFFF; padding: 24px; border-radius: 16px; white-space: pre-wrap; color: ${this.LIGHT_TEXT}; border: 1px solid ${this.LIGHT_BORDER};">
                    ${this.escapeHtml(message)}
                </div>
            `,
            ctaText: 'Reply Directly',
            ctaUrl: `mailto:${this.escapeHtml(email)}?subject=Re: ${encodeURIComponent(subject)}`
        });
    }
}
