/**
 * Sentry Edge Configuration
 * Runs in Edge Runtime (middleware)
 */

import * as Sentry from '@sentry/nextjs';

Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    environment: process.env.NODE_ENV,
    release: process.env.NEXT_PUBLIC_APP_VERSION || 'dev',

    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
});
