import { Injectable } from '@nestjs/common';

export interface EmailTemplateData {
    title: string;
    preheader?: string;
    content: string; // trusted HTML only
    ctaText?: string;
    ctaUrl?: string;
    footerText?: string;
}

@Injectable()
export class EmailTemplateService {
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
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
  "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>${safeTitle}</title>
</head>

<body style="margin:0;padding:0;background-color:#f4f4f4;font-family:Arial,Helvetica,sans-serif;">
${preheader ? `
<div style="display:none;max-height:0;overflow:hidden;font-size:1px;line-height:1px;color:#f4f4f4;">
    ${this.escapeHtml(preheader)}
</div>` : ''}

<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f4f4f4;">
<tr>
<td align="center" style="padding:32px 0;">

<table width="600" cellpadding="0" cellspacing="0" border="0"
       style="max-width:600px;background-color:#ffffff;">

<!-- Header -->
<tr>
<td align="center" style="padding:32px 32px 24px;border-bottom:1px solid #e5e5e5;">
    <div style="
        font-size:26px;
        font-weight:700;
        letter-spacing:2px;
        color:#111111;
        text-transform:uppercase;">
        HUMANTEE
    </div>
</td>
</tr>

<!-- Content -->
<tr>
<td style="padding:32px;">
    <h1 style="
        margin:0 0 20px;
        font-size:22px;
        font-weight:600;
        line-height:1.3;
        color:#111111;">
        ${safeTitle}
    </h1>

    <div style="
        font-size:15px;
        line-height:1.6;
        color:#444444;">
        ${content}
    </div>

    ${ctaText && ctaUrl ? `
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:28px;">
        <tr>
            <td align="center">
                <table cellpadding="0" cellspacing="0" border="0">
                    <tr>
                        <td align="center" bgcolor="#111111" style="padding:14px 32px;">
                            <a href="${ctaUrl}"
                               style="
                               color:#ffffff;
                               text-decoration:none;
                               font-size:14px;
                               font-weight:600;
                               letter-spacing:0.3px;
                               display:inline-block;">
                                ${this.escapeHtml(ctaText)}
                            </a>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
    ` : ''}
</td>
</tr>

<!-- Footer -->
<tr>
<td style="padding:24px 32px;background-color:#fcfcfc;border-top:1px solid #eeeeee;">
    ${footerText ? `
    <p style="
        margin:0 0 12px;
        font-size:13px;
        line-height:1.5;
        color:#777777;
        text-align:center;">
        ${this.escapeHtml(footerText)}
    </p>` : ''}

    <p style="margin:0;text-align:center;">
        <a href="https://www.instagram.com/humanteeofficial/"
           style="font-size:13px;color:#888888;text-decoration:none;">
            Instagram
        </a>
        <span style="color:#cccccc;margin:0 6px;">•</span>
        <a href="mailto:humanteeteam@gmail.com"
           style="font-size:13px;color:#888888;text-decoration:none;">
            Email
        </a>
    </p>

    <p style="
        margin:12px 0 0;
        font-size:12px;
        color:#999999;
        text-align:center;">
        © ${new Date().getFullYear()} HumanTee. All rights reserved.
    </p>
</td>
</tr>

</table>
</td>
</tr>
</table>

</body>
</html>
        `.trim();
    }

    generateOTPEmail(name: string, otp: string): string {
        const safeName = this.escapeHtml(name);
        const safeOtp = this.escapeHtml(otp);

        return this.generateEmail({
            title: 'Your Login Code',
            preheader: `Your HumanTee login code is ${safeOtp}`,
            content: `
<p style="margin:0 0 14px;">Hi <strong>${safeName}</strong>,</p>
<p style="margin:0 0 20px;">Use the code below to complete your login.</p>

<table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:24px 0;">
<tr>
<td align="center" style="background-color:#fafafa;border:1px solid #e0e0e0;padding:24px;">
    <div style="
        font-size:32px;
        font-weight:700;
        letter-spacing:6px;
        color:#111111;
        font-family:'Courier New',Courier,monospace;">
        ${safeOtp}
    </div>
</td>
</tr>
</table>

<p style="margin:16px 0 0;font-size:13px;color:#777777;">
    This code expires in 10 minutes.
</p>
            `,
            footerText: 'If you didn’t request this code, you can safely ignore this email.',
        });
    }

    generateContactConfirmation(name: string, message: string): string {
        return this.generateEmail({
            title: 'We Received Your Message',
            preheader: 'Thank you for contacting HumanTee',
            content: `
<p style="margin:0 0 14px;">Hi <strong>${this.escapeHtml(name)}</strong>,</p>
<p style="margin:0 0 20px;">
    We’ve received your message and will get back to you within 24 hours.
</p>

<table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:20px 0;">
<tr>
<td style="background-color:#fafafa;border-left:3px solid #111111;padding:16px;">
    <p style="margin:0;font-size:14px;color:#555555;font-style:italic;line-height:1.6;">
        “${this.escapeHtml(message)}”
    </p>
</td>
</tr>
</table>

<p style="margin:20px 0 0;">
    Best regards,<br/>
    <strong>The HumanTee Team</strong>
</p>
            `,
            footerText: 'For urgent matters, reach us at humanteeteam@gmail.com',
        });
    }

    generateContactNotification(
        name: string,
        email: string,
        subject: string,
        message: string,
    ): string {
        return this.generateEmail({
            title: 'New Contact Form Submission',
            preheader: `New message from ${this.escapeHtml(name)}`,
            content: `
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:20px;">
<tr>
<td style="background-color:#fafafa;padding:20px;">
    <p style="margin:0 0 8px;"><strong>From:</strong> ${this.escapeHtml(name)}</p>
    <p style="margin:0 0 8px;">
        <strong>Email:</strong>
        <a href="mailto:${this.escapeHtml(email)}"
           style="color:#111111;text-decoration:underline;">
            ${this.escapeHtml(email)}
        </a>
    </p>
    <p style="margin:0;"><strong>Subject:</strong> ${this.escapeHtml(subject)}</p>
</td>
</tr>
</table>

<table width="100%" cellpadding="0" cellspacing="0" border="0">
<tr>
<td style="border:1px solid #e0e0e0;padding:20px;">
    <h3 style="margin:0 0 12px;font-size:16px;color:#111111;">
        Message
    </h3>
    <p style="margin:0;font-size:14px;line-height:1.6;color:#444444;white-space:pre-wrap;">
        ${this.escapeHtml(message)}
    </p>
</td>
</tr>
</table>
            `,
            ctaText: 'Reply to Customer',
            ctaUrl: `mailto:${this.escapeHtml(email)}?subject=Re: ${encodeURIComponent(subject)}`,
        });
    }

    generateWelcomeEmail(name: string, email: string): string {
        return this.generateEmail({
            title: 'Welcome to HumanTee',
            preheader: 'Thank you for joining us',
            content: `
<p style="margin:0 0 14px;">Hi <strong>${this.escapeHtml(name)}</strong>,</p>
<p style="margin:0 0 20px;">
    Welcome to HumanTee! We're excited to have you as part of our community.
</p>

<p style="margin:0 0 14px;">
    Explore our collection of premium streetwear designed for those who value quality and style.
</p>

<p style="margin:20px 0 0;">
    Best regards,<br/>
    <strong>The HumanTee Team</strong>
</p>
            `,
            ctaText: 'Start Shopping',
            ctaUrl: process.env.FRONTEND_URL || 'http://localhost:3000/shop',
            footerText: 'Follow us on Instagram @humanteeofficial for the latest updates',
        });
    }

    generateOrderConfirmation(
        orderNumber: string,
        customerName: string,
        items: Array<{ name: string; quantity: number; price: number }>,
        subtotal: number,
        shipping: number,
        total: number,
        shippingAddress: string,
    ): string {
        const itemsHtml = items
            .map(
                (item) => `
<tr>
<td style="padding:8px 0;border-bottom:1px solid #f0f0f0;">
    ${this.escapeHtml(item.name)}
</td>
<td style="padding:8px 0;border-bottom:1px solid #f0f0f0;text-align:center;">
    ${item.quantity}
</td>
<td style="padding:8px 0;border-bottom:1px solid #f0f0f0;text-align:right;">
    ₹${item.price.toFixed(2)}
</td>
</tr>
            `,
            )
            .join('');

        return this.generateEmail({
            title: `Order Confirmation #${this.escapeHtml(orderNumber)}`,
            preheader: `Your order has been confirmed`,
            content: `
<p style="margin:0 0 14px;">Hi <strong>${this.escapeHtml(customerName)}</strong>,</p>
<p style="margin:0 0 20px;">
    Thank you for your order! We've received your payment and are preparing your items for shipment.
</p>

<table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:24px 0;">
<tr>
<td style="background-color:#fafafa;padding:16px;">
    <p style="margin:0;font-size:13px;color:#666666;">Order Number</p>
    <p style="margin:4px 0 0;font-size:16px;font-weight:600;color:#111111;">
        #${this.escapeHtml(orderNumber)}
    </p>
</td>
</tr>
</table>

<h3 style="margin:24px 0 12px;font-size:16px;font-weight:600;color:#111111;">Order Items</h3>
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:20px;">
<tr style="border-bottom:2px solid #e0e0e0;">
<th style="padding:8px 0;text-align:left;font-size:13px;color:#666666;">Item</th>
<th style="padding:8px 0;text-align:center;font-size:13px;color:#666666;">Qty</th>
<th style="padding:8px 0;text-align:right;font-size:13px;color:#666666;">Price</th>
</tr>
${itemsHtml}
<tr>
<td colspan="2" style="padding:12px 0 4px;text-align:right;font-size:14px;">Subtotal:</td>
<td style="padding:12px 0 4px;text-align:right;font-size:14px;">₹${subtotal.toFixed(2)}</td>
</tr>
<tr>
<td colspan="2" style="padding:4px 0;text-align:right;font-size:14px;">Shipping:</td>
<td style="padding:4px 0;text-align:right;font-size:14px;">₹${shipping.toFixed(2)}</td>
</tr>
<tr style="border-top:2px solid #111111;">
<td colspan="2" style="padding:12px 0 0;text-align:right;font-size:16px;font-weight:600;">Total:</td>
<td style="padding:12px 0 0;text-align:right;font-size:16px;font-weight:600;">₹${total.toFixed(2)}</td>
</tr>
</table>

<h3 style="margin:24px 0 12px;font-size:16px;font-weight:600;color:#111111;">Shipping Address</h3>
<table width="100%" cellpadding="0" cellspacing="0" border="0">
<tr>
<td style="background-color:#fafafa;padding:16px;">
    <p style="margin:0;font-size:14px;line-height:1.6;color:#444444;white-space:pre-wrap;">${this.escapeHtml(shippingAddress)}</p>
</td>
</tr>
</table>

<p style="margin:24px 0 0;font-size:13px;color:#666666;">
    You'll receive a shipping confirmation email with tracking details once your order ships.
</p>
            `,
            ctaText: 'Track Order',
            ctaUrl: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/orders`,
            footerText: 'Questions about your order? Reply to this email or contact us at humanteeteam@gmail.com',
        });
    }
}
