/**
 * Shared Validation Schemas
 * Used by both frontend and backend for validation parity
 * Prevents data mismatches and improves security
 */

import { z } from 'zod';

/**
 * Checkout Form Validation
 */
export const checkoutSchema = z.object({
    // Contact Information
    email: z.string().email('Invalid email address'),
    phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number'),

    // Shipping Address
    firstName: z.string().min(2, 'First name must be at least 2 characters'),
    lastName: z.string().min(2, 'Last name must be at least 2 characters'),
    address: z.string().min(10, 'Address must be at least 10 characters').max(200, 'Address too long'),
    apartment: z.string().max(50, 'Apartment/Suite too long').optional(),
    city: z.string().min(2, 'City must be at least 2 characters'),
    state: z.string().min(2, 'State must be at least 2 characters'),
    postalCode: z.string().regex(/^\d{6}$/, 'Postal code must be 6 digits'),
    country: z.string().default('India'),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;

/**
 * Contact Form Validation
 */
export const contactSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    subject: z.string().min(5, 'Subject must be at least 5 characters'),
    message: z.string().min(20, 'Message must be at least 20 characters').max(1000, 'Message too long'),
});

export type ContactInput = z.infer<typeof contactSchema>;

/**
 * Product Review Validation
 */
export const reviewSchema = z.object({
    rating: z.number().min(1).max(5),
    title: z.string().min(5, 'Title must be at least 5 characters').max(100, 'Title too long'),
    comment: z.string().min(20, 'Review must be at least 20 characters').max(500, 'Review too long'),
    recommend: z.boolean(),
});

export type ReviewInput = z.infer<typeof reviewSchema>;

/**
 * Login Form Validation
 */
export const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
});

export type LoginInput = z.infer<typeof loginSchema>;

/**
 * Registration Form Validation
 */
export const registerSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string()
        .min(8, 'Password must be at least 8 characters')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number'),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

export type RegisterInput = z.infer<typeof registerSchema>;
