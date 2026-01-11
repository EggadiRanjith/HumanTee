/**
 * Client-side environment variable validation
 * These variables are exposed to the browser (NEXT_PUBLIC_*)
 */

import { z } from 'zod';

const clientEnvSchema = z.object({
    NEXT_PUBLIC_API_URL: z.string().url('API_URL must be a valid URL').default('https://humantee.onrender.com'),
    NEXT_PUBLIC_SENTRY_DSN: z.union([z.string().url(), z.literal(''), z.undefined()]).optional(),
    NEXT_PUBLIC_APP_VERSION: z.string().default('dev'),
    NEXT_PUBLIC_GA_ID: z.string().optional(),
});

// Validate and export
export const clientEnv = clientEnvSchema.parse({
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'https://humantee.onrender.com',
    NEXT_PUBLIC_SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,
    NEXT_PUBLIC_APP_VERSION: process.env.NEXT_PUBLIC_APP_VERSION || 'dev',
    NEXT_PUBLIC_GA_ID: process.env.NEXT_PUBLIC_GA_ID,
});

export type ClientEnv = z.infer<typeof clientEnvSchema>;
