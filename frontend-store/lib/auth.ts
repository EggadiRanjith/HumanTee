/**
 * Authentication utility functions
 * Token management handled by lib/api-client.ts. Logout uses apiClient.
 */

import apiClient from '@/lib/api-client';

export async function logout(): Promise<void> {
    try {
        await apiClient.post('/auth/logout');
    } catch (error) {
    }
}

/**
 * Server-side auth helper
 */

import { cookies } from 'next/headers';

const getApiUrl = () =>
    process.env.NEXT_PUBLIC_API_URL || 'https://humantee.onrender.com';

interface User {
    id: string;
    email: string;
    role: string;
}

export async function getServerUser(): Promise<User | null> {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('auth_token')?.value;

        if (!token) return null;

        const response = await fetch(`${getApiUrl()}/auth/me`, {
            headers: { Authorization: `Bearer ${token}` },
            next: { revalidate: 60 },
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
