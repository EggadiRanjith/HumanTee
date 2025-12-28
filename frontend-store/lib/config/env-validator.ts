/**
 * Centralized environment variable validator
 * Run this on app startup to catch missing/invalid env vars early
 */

import { clientEnv } from './client-env';

export function validateEnvironment() {
    try {
        // Client env validation happens on import
        if (process.env.NODE_ENV === 'development') {
            console.log('✅ Environment validation passed');
            console.log('📍 API URL:', clientEnv.NEXT_PUBLIC_API_URL);
            console.log('🔖 App Version:', clientEnv.NEXT_PUBLIC_APP_VERSION);
        }

        return true;
    } catch (error) {
        console.error('❌ Environment validation failed:');
        console.error(error);

        if (process.env.NODE_ENV === 'production') {
            throw new Error('Invalid environment configuration. Check your .env file.');
        }

        return false;
    }
}

// Export validated env
export { clientEnv } from './client-env';
export { serverEnv } from './server-env';
