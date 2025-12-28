/**
 * Server-side environment variable validation
 * These variables are ONLY available on the server
 */

import { z } from 'zod';

const serverEnvSchema = z.object({
    // Database (optional in development)
    DATABASE_URL: z.string().url().optional(),

    // Authentication (required in production with entropy)
    JWT_SECRET: process.env.NODE_ENV === 'production'
        ? z.string()
            .min(32, 'JWT_SECRET must be at least 32 characters')
            .refine(
                val => /[A-Za-z]/.test(val) && /[0-9]/.test(val),
                'JWT_SECRET must contain both letters and numbers for entropy'
            )
        : z.string().min(32).optional(),

    // External Services
    SENTRY_DSN: z.string().url().optional(),
    SENTRY_AUTH_TOKEN: z.string().optional(),
});

// Validate and export
export const serverEnv = serverEnvSchema.parse(process.env);

export type ServerEnv = z.infer<typeof serverEnvSchema>;
