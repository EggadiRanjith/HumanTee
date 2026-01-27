import { z } from 'zod';

/**
 * Customer Form Validation Schema
 */

export const customerSchema = z.object({
    // Personal Information
    firstName: z.string()
        .min(1, 'First name is required')
        .max(100, 'First name must be less than 100 characters')
        .trim(),

    lastName: z.string()
        .min(1, 'Last name is required')
        .max(100, 'Last name must be less than 100 characters')
        .trim(),

    email: z.string()
        .email('Invalid email address')
        .max(255, 'Email must be less than 255 characters')
        .trim()
        .toLowerCase(),

    phone: z.string()
        .regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format')
        .optional()
        .nullable(),

    // Status
    isActive: z.boolean().default(true),

    // Notes
    notes: z.string()
        .max(1000, 'Notes must be less than 1000 characters')
        .optional()
        .nullable(),

    // Tags
    tags: z.array(z.string()).optional().default([]),
});

export type CustomerFormData = z.infer<typeof customerSchema>;

/**
 * Customer Address Schema
 */
export const customerAddressSchema = z.object({
    fullName: z.string()
        .min(1, 'Full name is required')
        .max(200, 'Name is too long')
        .trim(),

    phone: z.string()
        .regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number')
        .trim(),

    email: z.string()
        .email('Invalid email address')
        .trim()
        .toLowerCase(),

    address: z.string()
        .min(1, 'Address is required')
        .max(500, 'Address is too long')
        .trim(),

    houseNumber: z.string()
        .max(50, 'House number is too long')
        .optional()
        .nullable(),

    landmark: z.string()
        .max(200, 'Landmark is too long')
        .optional()
        .nullable(),

    city: z.string()
        .min(1, 'City is required')
        .max(100, 'City name is too long')
        .trim(),

    state: z.string()
        .min(1, 'State is required')
        .max(100, 'State name is too long')
        .trim(),

    postalCode: z.string()
        .regex(/^\d{6}$/, 'Postal code must be 6 digits')
        .trim(),

    country: z.string()
        .min(1, 'Country is required')
        .max(100, 'Country name is too long')
        .trim()
        .default('India'),

    isDefault: z.boolean().default(false),
});

export type CustomerAddressData = z.infer<typeof customerAddressSchema>;
