/**
 * Centralized API Client with Auth Interceptors
 * Handles automatic token refresh on 401 with retry guard
 */

import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

// Dynamic API URL - works on both laptop and phone
const getApiBaseUrl = () => {
    // Server-side: use env variable
    if (typeof window === 'undefined') {
        return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    }

    // Client-side: detect if accessing via network IP
    const hostname = window.location.hostname;

    // If accessing via network IP (phone), use same IP for backend
    if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
        return `http://${hostname}:3001`;
    }

    // Otherwise use localhost (laptop)
    return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
};

const API_BASE_URL = getApiBaseUrl();

// Memory-only token storage
let accessToken: string | null = null;

// Prevent concurrent refresh calls
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

// Notify all queued requests when refresh completes
function onRefreshed(token: string) {
    refreshSubscribers.forEach(callback => callback(token));
    refreshSubscribers = [];
}

// Queue requests while refresh is in progress
function addRefreshSubscriber(callback: (token: string) => void) {
    refreshSubscribers.push(callback);
}

// Token management (memory + cookie for server-side pages)
export function getAccessToken(): string | null {
    return accessToken;
}

export function setAccessToken(token: string | null) {
    accessToken = token;

    // Phase 8: Also store in cookie for server-side pages (like /post-login)
    if (typeof document !== 'undefined') {
        if (token) {
            document.cookie = `auth_token=${token}; path=/; max-age=900; SameSite=Lax`;
        } else {
            document.cookie = 'auth_token=; path=/; max-age=0';
        }
    }
}

export function clearAccessToken() {
    accessToken = null;

    // Phase 8: Also clear cookie
    if (typeof document !== 'undefined') {
        document.cookie = 'auth_token=; path=/; max-age=0';
    }
}

// Create axios instance
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true, // Send cookies with requests
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor: Add access token to headers
apiClient.interceptors.request.use(
    (config) => {
        const token = getAccessToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor: Handle 401 with refresh-on-retry
apiClient.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

        // Only handle 401 errors
        if (error.response?.status !== 401) {
            return Promise.reject(error);
        }

        // Prevent infinite retry loops
        if (originalRequest._retry) {
            // Refresh failed, logout user
            clearAccessToken();
            if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
                window.location.href = '/login?error=session_expired';
            }
            return Promise.reject(error);
        }

        // Mark this request as retried
        originalRequest._retry = true;

        // If already refreshing, queue this request
        if (isRefreshing) {
            return new Promise((resolve) => {
                addRefreshSubscriber((token: string) => {
                    originalRequest.headers.Authorization = `Bearer ${token}`;
                    resolve(apiClient(originalRequest));
                });
            });
        }

        // Start refresh process
        isRefreshing = true;

        try {
            // Call refresh endpoint (uses httpOnly cookie)
            const response = await axios.post(
                `${API_BASE_URL}/auth/refresh`,
                {},
                { withCredentials: true }
            );

            const { accessToken: newToken } = response.data;

            // Update token in memory
            setAccessToken(newToken);

            // Notify all queued requests
            onRefreshed(newToken);

            // Retry original request with new token
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return apiClient(originalRequest);
        } catch (refreshError) {
            // Refresh failed, logout user
            clearAccessToken();
            if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
                window.location.href = '/login?error=session_expired';
            }
            return Promise.reject(refreshError);
        } finally {
            isRefreshing = false;
        }
    }
);

export default apiClient;
