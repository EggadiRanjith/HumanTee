import { z } from 'zod';

/**
 * Order Status Update Schema
 */
export const orderStatusSchema = z.object({
    status: z.enum([
        'pending_payment',
        'processing',
        'shipped',
        'delivered',
        'cancelled',
        'refunded',
    ], {
        errorMap: () => ({ message: 'Invalid order status' }),
    }),
});

export type OrderStatusData = z.infer<typeof orderStatusSchema>;

/**
 * Order Note Schema
 */
export const orderNoteSchema = z.object({
    note: z.string()
        .min(1, 'Note cannot be empty')
        .max(1000, 'Note must be less than 1000 characters')
        .trim(),
    isInternal: z.boolean().default(false),
});

export type OrderNoteData = z.infer<typeof orderNoteSchema>;

/**
 * Shipping Information Schema
 */
export const shippingInfoSchema = z.object({
    trackingNumber: z.string()
        .min(1, 'Tracking number is required')
        .max(100, 'Tracking number is too long')
        .trim(),
    carrier: z.string()
        .min(1, 'Carrier is required')
        .max(100, 'Carrier name is too long')
        .trim(),
    estimatedDelivery: z.string()
        .datetime('Invalid date format')
        .optional()
        .nullable(),
});

export type ShippingInfoData = z.infer<typeof shippingInfoSchema>;
