/**
 * Admin API Client - httpOnly Cookie Authentication
 * SECURITY: Uses httpOnly cookies, no token storage in JavaScript
 * Includes CSRF protection for state-changing operations
 */

import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// Create axios instance with cookie support
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,  // CRITICAL: Send httpOnly cookies automatically
    headers: {
        'Content-Type': 'application/json',
    },
});

/**
 * Get CSRF token from cookie
 * SECURITY: Protects against CSRF attacks
 */
function getCsrfToken(): string | null {
    if (typeof document === 'undefined') return null;

    const match = document.cookie.match(/(^|;)\s*csrf-token=([^;]+)/);
    return match ? match[2] : null;
}

/**
 * Request interceptor: Add CSRF token for state-changing operations
 * SECURITY: CSRF protection for POST/PUT/PATCH/DELETE
 */
apiClient.interceptors.request.use(
    (config) => {
        // Add CSRF token for state-changing operations
        if (['post', 'put', 'patch', 'delete'].includes(config.method?.toLowerCase() || '')) {
            const csrfToken = getCsrfToken();
            if (csrfToken) {
                config.headers['X-CSRF-Token'] = csrfToken;
            }
        }

        // NO Authorization header - cookies are sent automatically ✅
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

/**
 * Response interceptor: Handle errors
 * SECURITY: Redirect to login on 401
 */
apiClient.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        // Handle 401 Unauthorized
        if (error.response?.status === 401) {
            // Clear any local state
            if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
                window.location.href = '/login?error=session_expired';
            }
            return Promise.reject(error);
        }

        // Handle 403 Forbidden (CSRF or permission denied)
        if (error.response?.status === 403) {
            const errorData = error.response.data as any;
            if (errorData?.message?.includes('CSRF')) {
                console.error('CSRF token invalid or missing');
            }
            return Promise.reject(error);
        }

        return Promise.reject(error);
    }
);

export default apiClient;

/**
 * DEPRECATED: These functions are no longer needed with httpOnly cookies
 * Kept for backward compatibility, but they do nothing
 */
export function getAccessToken(): string | null {
    console.warn('getAccessToken() is deprecated - using httpOnly cookies');
    return null;
}

export function setAccessToken(token: string | null) {
    console.warn('setAccessToken() is deprecated - using httpOnly cookies');
}

export function clearAccessToken() {
    console.warn('clearAccessToken() is deprecated - using httpOnly cookies');
}
