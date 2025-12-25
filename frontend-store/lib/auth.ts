/**
 * Authentication utility functions
 * DEPRECATED: Token management now handled by lib/api-client.ts
 * Keep only logout for backward compatibility
 */

// Dynamic API URL helper
const getApiUrl = () => {
    if (typeof window === 'undefined') return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    const hostname = window.location.hostname;
    if (hostname !== 'localhost' && hostname !== '127.0.0.1') return `http://${hostname}:3001`;
    return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
};

export async function logout(): Promise<void> {
    try {
        await fetch(`${getApiUrl()}/auth/logout`, {
            method: 'POST',
            credentials: 'include',
        });
    } catch (error) {
        console.error('Logout failed:', error);
    }
}

/**
 * Server-side auth helper
 * Phase 8: Get authenticated user from server
 */

import { cookies } from 'next/headers';

interface User {
    id: string;
    email: string;
    role: string;
}

export async function getServerUser(): Promise<User | null> {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('auth_token')?.value;

        if (!token) {
            return null;
        }

        // Verify token with backend
        const response = await fetch(`${getApiUrl()}/auth/me`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            cache: 'no-store',
        });

        if (!response.ok) {
            return null;
        }

        const user = await response.json();
        return user;
    } catch (error) {
        console.error('Failed to get server user:', error);
        return null;
    }
}

/**
 * Get auth token from cookies (server-side)
 */
export async function getServerToken(): Promise<string | null> {
    const cookieStore = await cookies();
    return cookieStore.get('auth_token')?.value || null;
}
