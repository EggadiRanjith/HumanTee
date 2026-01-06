import { z } from 'zod';

/**
 * Discount Form Validation Schema
 */

export const discountSchema = z.object({
    // Basic Information
    code: z.string()
        .min(3, 'Discount code must be at least 3 characters')
        .max(50, 'Discount code must be less than 50 characters')
        .regex(/^[A-Z0-9_-]+$/, 'Code must be uppercase letters, numbers, hyphens, or underscores')
        .trim(),

    description: z.string()
        .min(1, 'Description is required')
        .max(500, 'Description must be less than 500 characters')
        .trim(),

    // Discount Type
    type: z.enum(['percentage', 'fixed_amount'], {
        errorMap: () => ({ message: 'Type must be percentage or fixed amount' }),
    }),

    // Discount Value
    value: z.number()
        .positive('Discount value must be greater than 0')
        .or(z.string().transform(val => parseFloat(val)))
        .refine(val => !isNaN(val as number), 'Value must be a valid number'),

    // Minimum Purchase
    minimumPurchase: z.number()
        .min(0, 'Minimum purchase cannot be negative')
        .optional()
        .nullable()
        .or(z.string().transform(val => val ? parseFloat(val) : null)),

    // Maximum Discount
    maximumDiscount: z.number()
        .positive('Maximum discount must be greater than 0')
        .optional()
        .nullable()
        .or(z.string().transform(val => val ? parseFloat(val) : null)),

    // Usage Limits
    usageLimit: z.number()
        .int('Usage limit must be a whole number')
        .positive('Usage limit must be greater than 0')
        .optional()
        .nullable()
        .or(z.string().transform(val => val ? parseInt(val, 10) : null)),

    usageLimitPerUser: z.number()
        .int('Usage limit per user must be a whole number')
        .positive('Usage limit per user must be greater than 0')
        .optional()
        .nullable()
        .or(z.string().transform(val => val ? parseInt(val, 10) : null)),

    // Dates
    startsAt: z.string()
        .datetime('Invalid start date format')
        .optional()
        .nullable(),

    expiresAt: z.string()
        .datetime('Invalid expiry date format')
        .optional()
        .nullable(),

    // Status
    isActive: z.boolean().default(true),

    // Applicable Products
    applicableProductIds: z.array(z.string()).optional().default([]),

    // Applicable Categories
    applicableCategoryIds: z.array(z.string()).optional().default([]),
}).refine((data) => {
    // Percentage discounts should be between 1-100
    if (data.type === 'percentage' && data.value) {
        return data.value > 0 && data.value <= 100;
    }
    return true;
}, {
    message: 'Percentage discount must be between 1 and 100',
    path: ['value'],
}).refine((data) => {
    // Expiry date must be after start date
    if (data.startsAt && data.expiresAt) {
        return new Date(data.expiresAt) > new Date(data.startsAt);
    }
    return true;
}, {
    message: 'Expiry date must be after start date',
    path: ['expiresAt'],
}).refine((data) => {
    // Usage limit per user cannot exceed total usage limit
    if (data.usageLimit && data.usageLimitPerUser) {
        return data.usageLimitPerUser <= data.usageLimit;
    }
    return true;
}, {
    message: 'Usage limit per user cannot exceed total usage limit',
    path: ['usageLimitPerUser'],
});

export type DiscountFormData = z.infer<typeof discountSchema>;

/**
 * Partial schema for discount updates
 */
export const discountUpdateSchema = discountSchema.partial();

export type DiscountUpdateData = z.infer<typeof discountUpdateSchema>;
