/**
 * API Retry Configuration
 * Implements safe retry logic with guards for non-idempotent requests
 */

import axios, { AxiosInstance } from 'axios';
import axiosRetry from 'axios-retry';
import * as Sentry from '@sentry/nextjs';

// HTTP methods that are safe to retry
const IDEMPOTENT_METHODS = ['GET', 'HEAD', 'OPTIONS', 'PUT', 'DELETE'];

// Endpoints that should NEVER be retried (payments, checkouts, etc.)
const DANGEROUS_ENDPOINTS = [
    '/checkout',
    '/payment',
    '/order',
    '/purchase',
    '/transaction',
];

/**
 * Configure retry logic for API client
 * CRITICAL: Only retries safe, idempotent requests
 */
export function configureRetry(client: AxiosInstance) {
    axiosRetry(client, {
        retries: 3,
        retryDelay: axiosRetry.exponentialDelay,

        retryCondition: (error) => {
            const method = error.config?.method?.toUpperCase();
            const url = error.config?.url || '';

            // NEVER retry dangerous endpoints (prevents duplicate payments/orders)
            if (DANGEROUS_ENDPOINTS.some(endpoint => url.includes(endpoint))) {
                console.warn(`[Retry Guard] Blocked retry for dangerous endpoint: ${url}`);
                return false;
            }

            // Only retry idempotent methods
            if (!method || !IDEMPOTENT_METHODS.includes(method)) {
                console.warn(`[Retry Guard] Blocked retry for non-idempotent method: ${method}`);
                return false;
            }

            // Retry on network errors or 429 (rate limit)
            return axiosRetry.isNetworkOrIdempotentRequestError(error) ||
                error.response?.status === 429;
        },

        onRetry: (retryCount, error, requestConfig) => {
            Sentry.addBreadcrumb({
                category: 'api.retry',
                message: `Retry attempt ${retryCount}`,
                data: {
                    method: requestConfig.method,
                    url: requestConfig.url,
                    retryCount
                },
                level: 'info'
            });
        },
    });
}
