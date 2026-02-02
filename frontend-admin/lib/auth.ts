/**
 * Authentication utility functions
 * DEPRECATED: Token management now handled by lib/api-client.ts
 * Keep only logout for backward compatibility
 */

export async function logout(): Promise<void> {
    try {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
            method: 'POST',
            credentials: 'include',
        });
    } catch (error) {

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
        const token = cookieStore.get('admin_access_token')?.value;  // Changed from auth_token

        if (!token) {
            return null;
        }

        // Verify token with backend
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
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
