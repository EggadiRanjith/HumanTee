import { Injectable, BadRequestException } from '@nestjs/common';
import { StoreSettings, ValidationResult, TestResult } from './settings.types';

/**
 * Settings Validator
 * Validates settings before they're applied
 * CRITICAL: Prevents bad configs from breaking production
 */
@Injectable()
export class SettingsValidator {
    /**
     * Validate settings
     * Returns all validation errors
     */
    async validate(settings: StoreSettings): Promise<ValidationResult> {
        const errors: string[] = [];

        // General validation
        if (!settings.storeName || settings.storeName.trim().length === 0) {
            errors.push('Store name is required');
        }

        if (!settings.storeEmail || !this.isValidEmail(settings.storeEmail)) {
            errors.push('Valid store email is required');
        }

        if (!['INR', 'USD', 'EUR'].includes(settings.currency)) {
            errors.push('Currency must be INR, USD, or EUR');
        }

        if (settings.lowStockThreshold < 0) {
            errors.push('Low stock threshold must be positive');
        }

        // Payment validation
        if (settings.enableRazorpay) {
            if (!settings.razorpayKeyId || settings.razorpayKeyId.trim().length === 0) {
                errors.push('Razorpay Key ID is required when Razorpay is enabled');
            }

            if (!settings.razorpayKeyId?.startsWith('rzp_')) {
                errors.push('Invalid Razorpay Key ID format (must start with rzp_)');
            }
        }

        if (settings.enableCOD && settings.codCharge < 0) {
            errors.push('COD charge must be positive');
        }

        // Shipping validation
        if (settings.freeShippingThreshold < 0) {
            errors.push('Free shipping threshold must be positive');
        }

        if (settings.standardShippingRate < 0) {
            errors.push('Standard shipping rate must be positive');
        }

        if (settings.expressShippingRate < 0) {
            errors.push('Express shipping rate must be positive');
        }

        if (settings.expressShippingRate <= settings.standardShippingRate) {
            errors.push('Express shipping must cost more than standard shipping');
        }

        return {
            valid: errors.length === 0,
            errors,
        };
    }

    /**
     * Test configuration
     * Actually test external services before applying
     */
    async testConfiguration(settings: StoreSettings): Promise<TestResult> {
        // Test Razorpay connection
        if (settings.enableRazorpay) {
            const razorpayTest = await this.testRazorpay(settings.razorpayKeyId!);
            if (!razorpayTest.success) {
                return razorpayTest;
            }
        }

        // Test email configuration
        const emailTest = await this.testEmail(settings.storeEmail);
        if (!emailTest.success) {
            return emailTest;
        }

        return { success: true };
    }

    /**
     * Test Razorpay connection
     */
    private async testRazorpay(keyId: string): Promise<TestResult> {
        try {
            // Validate format first
            if (!keyId.startsWith('rzp_')) {
                return {
                    success: false,
                    error: 'Invalid Razorpay Key ID format (must start with rzp_)',
                };
            }

            // Test actual Razorpay connection by fetching orders
            // This verifies both key_id and key_secret are valid
            const Razorpay = require('razorpay');

            const razorpay = new Razorpay({
                key_id: keyId,
                key_secret: process.env.RAZORPAY_KEY_SECRET || '',
            });

            // Attempt to fetch orders (lightweight API call to verify credentials)
            // Even if no orders exist, successful auth means valid credentials
            await razorpay.orders.all({ count: 1 });

            return { success: true };
        } catch (error: any) {
            // Parse Razorpay error messages
            if (error.statusCode === 401) {
                return {
                    success: false,
                    error: 'Invalid Razorpay credentials (401 Unauthorized)',
                    details: 'Check your Key ID and Key Secret',
                };
            }

            if (error.code === 'ENOTFOUND' || error.code === 'ETIMEDOUT') {
                return {
                    success: false,
                    error: 'Cannot connect to Razorpay servers',
                    details: 'Check your internet connection',
                };
            }

            return {
                success: false,
                error: 'Failed to connect to Razorpay',
                details: error.message,
            };
        }
    }

    /**
     * Test email configuration
     */
    private async testEmail(email: string): Promise<TestResult> {
        if (!this.isValidEmail(email)) {
            return {
                success: false,
                error: 'Invalid email format',
            };
        }

        // Note: This requires EmailService to be injected
        // For now, validate configuration presence
        const hasBrevo = !!(process.env.BREVO_API_KEY && process.env.EMAIL_FROM);
        const hasSMTP = !!(
            process.env.SMTP_HOST &&
            process.env.SMTP_PORT &&
            process.env.SMTP_USER &&
            process.env.SMTP_PASSWORD
        );

        if (!hasBrevo && !hasSMTP) {
            return {
                success: false,
                error: 'No email provider configured',
                details: 'Configure either Brevo API or SMTP settings',
            };
        }

        // Email provider configured - consider it valid
        // Actual send test would require injecting EmailService
        return { success: true };
    }

    /**
     * Validate email format
     */
    private isValidEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    /**
     * Compare settings and get diff
     */
    getDiff(oldSettings: StoreSettings, newSettings: StoreSettings): Record<string, { from: any; to: any }> {
        const diff: Record<string, { from: any; to: any }> = {};

        for (const key of Object.keys(newSettings) as Array<keyof StoreSettings>) {
            if (JSON.stringify(oldSettings[key]) !== JSON.stringify(newSettings[key])) {
                diff[key] = {
                    from: oldSettings[key],
                    to: newSettings[key],
                };
            }
        }

        return diff;
    }
}
