/**
 * Centralized environment variable validator
 * Run this on app startup to catch missing/invalid env vars early
 */

import { clientEnv } from './client-env';

export function validateEnvironment() {
    try {
        // Client env validation happens on import
        if (process.env.NODE_ENV === 'development') {
        }

        return true;
    } catch (error) {

        if (process.env.NODE_ENV === 'production') {
            throw new Error('Invalid environment configuration. Check your .env file.');
        }

        return false;
    }
}

// Export validated env
export { clientEnv } from './client-env';
export { serverEnv } from './server-env';
