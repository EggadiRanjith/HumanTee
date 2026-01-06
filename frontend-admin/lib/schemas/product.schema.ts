import { z } from 'zod';

/**
 * Product Form Validation Schema
 * Prevents data corruption and provides better UX
 */

export const productSchema = z.object({
    // Basic Information
    title: z.string()
        .min(1, 'Product title is required')
        .max(200, 'Title must be less than 200 characters')
        .trim(),

    slug: z.string()
        .min(1, 'Slug is required')
        .max(200, 'Slug must be less than 200 characters')
        .regex(/^[a-z0-9-]+$/, 'Slug must be lowercase letters, numbers, and hyphens only')
        .trim(),

    description: z.string()
        .min(10, 'Description must be at least 10 characters')
        .max(5000, 'Description must be less than 5000 characters')
        .trim(),

    // Pricing
    price: z.number()
        .positive('Price must be greater than 0')
        .max(10000000, 'Price is too high')
        .or(z.string().transform(val => parseFloat(val)))
        .refine(val => !isNaN(val as number), 'Price must be a valid number'),

    compareAtPrice: z.number()
        .positive('Compare price must be greater than 0')
        .max(10000000, 'Compare price is too high')
        .optional()
        .nullable()
        .or(z.string().transform(val => val ? parseFloat(val) : null)),

    // Inventory
    stock: z.number()
        .int('Stock must be a whole number')
        .min(0, 'Stock cannot be negative')
        .max(1000000, 'Stock quantity is too high')
        .or(z.string().transform(val => parseInt(val, 10)))
        .refine(val => !isNaN(val as number), 'Stock must be a valid number'),

    lowStockThreshold: z.number()
        .int('Low stock threshold must be a whole number')
        .min(0, 'Threshold cannot be negative')
        .max(1000, 'Threshold is too high')
        .or(z.string().transform(val => parseInt(val, 10)))
        .refine(val => !isNaN(val as number), 'Threshold must be a valid number'),

    // SKU
    sku: z.string()
        .max(100, 'SKU must be less than 100 characters')
        .optional()
        .nullable(),

    // Status
    status: z.enum(['draft', 'published', 'archived'], {
        errorMap: () => ({ message: 'Status must be draft, published, or archived' }),
    }).default('draft'),

    // Featured
    isFeatured: z.boolean().default(false),

    // Categories
    categoryIds: z.array(z.string()).optional().default([]),

    // Images
    images: z.array(z.object({
        url: z.string().url('Invalid image URL'),
        alt: z.string().optional(),
        position: z.number().int().min(0).optional(),
    })).optional().default([]),

    // Variants
    variants: z.array(z.object({
        id: z.string().optional(),
        size: z.string().min(1, 'Size is required'),
        color: z.string().min(1, 'Color is required'),
        stock: z.number()
            .int('Variant stock must be a whole number')
            .min(0, 'Variant stock cannot be negative')
            .or(z.string().transform(val => parseInt(val, 10))),
        price: z.number()
            .positive('Variant price must be greater than 0')
            .or(z.string().transform(val => parseFloat(val))),
        sku: z.string().optional().nullable(),
    })).optional().default([]),
}).refine((data) => {
    // Validate compareAtPrice is higher than price
    if (data.compareAtPrice && data.price) {
        return data.compareAtPrice > data.price;
    }
    return true;
}, {
    message: 'Compare at price must be higher than regular price',
    path: ['compareAtPrice'],
}).refine((data) => {
    // Validate lowStockThreshold is not higher than stock
    if (data.lowStockThreshold && data.stock) {
        return data.lowStockThreshold <= data.stock;
    }
    return true;
}, {
    message: 'Low stock threshold cannot be higher than available stock',
    path: ['lowStockThreshold'],
});

export type ProductFormData = z.infer<typeof productSchema>;

/**
 * Partial schema for product updates (all fields optional)
 */
export const productUpdateSchema = productSchema.partial();

export type ProductUpdateData = z.infer<typeof productUpdateSchema>;
