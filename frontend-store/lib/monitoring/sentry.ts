/**
 * Sentry Monitoring Utilities
 * Production-grade error tracking and user context
 */

import * as Sentry from '@sentry/nextjs';
import { clientEnv } from '@/lib/config/client-env';

/**
 * Initialize Sentry
 * Call this once on app startup
 */
export function initSentry() {
    if (!clientEnv.NEXT_PUBLIC_SENTRY_DSN) {
        return;
    }

    Sentry.init({
        dsn: clientEnv.NEXT_PUBLIC_SENTRY_DSN,
        environment: process.env.NODE_ENV,
        release: clientEnv.NEXT_PUBLIC_APP_VERSION,

        // Performance monitoring
        tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,

        // Filter sensitive data
        beforeSend(event, hint) {
            // Remove sensitive headers and cookies
            if (event.request) {
                delete event.request.cookies;
                if (event.request.headers) {
                    delete event.request.headers['Authorization'];
                    delete event.request.headers['Cookie'];
                }
            }

            return event;
        },

        integrations: [
            Sentry.browserTracingIntegration(),
        ],
    });
}

/**
 * Set user context for error tracking
 * Call this after user logs in
 */
export function setUserContext(user: { id: string; email: string }) {
    Sentry.setUser({
        id: user.id,
        email: user.email,
    });
}

/**
 * Clear user context
 * Call this after user logs out
 */
export function clearUserContext() {
    Sentry.setUser(null);
}

/**
 * Manually capture an error
 */
export function captureError(error: Error, context?: Record<string, any>) {
    if (context) {
        Sentry.setContext('additional', context);
    }
    Sentry.captureException(error);
}

/**
 * Capture a message (non-error)
 */
export function captureMessage(message: string, level: 'info' | 'warning' | 'error' = 'info') {
    Sentry.captureMessage(message, level);
}

/**
 * SECURITY: Log authentication failures
 */
export function logAuthFailure(reason: string, email?: string) {
    Sentry.captureMessage(`Auth Failure: ${reason}`, 'warning');
    Sentry.setContext('auth_failure', {
        reason,
        email: email ? email.substring(0, 3) + '***' : 'unknown', // Partial email for privacy
        timestamp: new Date().toISOString(),
    });
}

/**
 * SECURITY: Log payment failures
 */
export function logPaymentFailure(orderId: string, reason: string, amount?: number) {
    Sentry.captureMessage(`Payment Failure: ${reason}`, 'error');
    Sentry.setContext('payment_failure', {
        orderId,
        reason,
        amount,
        timestamp: new Date().toISOString(),
    });
}

/**
 * SECURITY: Log suspicious activity
 */
export function logSuspiciousActivity(activity: string, details?: Record<string, any>) {
    Sentry.captureMessage(`Suspicious Activity: ${activity}`, 'warning');
    Sentry.setContext('suspicious_activity', {
        activity,
        ...details,
        timestamp: new Date().toISOString(),
    });
}
