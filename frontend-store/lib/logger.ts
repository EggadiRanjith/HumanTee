/**
 * Centralized Error Logging Utility
 * 
 * Purpose: Gate console logging behind dev-only checks
 * Future: Can integrate Sentry/LogRocket without touching call sites
 */

export const logError = (error: unknown, context?: string) => {
    if (process.env.NODE_ENV === 'development') {
        if (context) {
        } else {
        }
    }

    // Future: Send to error tracking service
    // if (process.env.NODE_ENV === 'production') {
    //   errorTracker.captureException(error, { context });
    // }
};

export const logWarning = (message: string, context?: string) => {
    if (process.env.NODE_ENV === 'development') {
        if (context) {
        } else {
        }
    }
};
