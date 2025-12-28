/**
 * Sentry Server Configuration
 * Runs on the Next.js server
 */

import * as Sentry from '@sentry/nextjs';

Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    environment: process.env.NODE_ENV,
    release: process.env.NEXT_PUBLIC_APP_VERSION || 'dev',

    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,

    beforeSend(event) {
        // Filter sensitive server data
        if (event.request) {
            delete event.request.cookies;
            delete event.request.headers;
        }
        return event;
    },
});
