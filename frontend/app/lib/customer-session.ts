/**
 * Customer Session Management
 * Handles secure session storage and retrieval
 */

import { cookies } from 'next/headers';
import { jwtVerify, SignJWT } from 'jose';

const SESSION_COOKIE_NAME = 'customer_session';
const SESSION_SECRET = new TextEncoder().encode(
    process.env.SESSION_SECRET || 'your-secret-key-change-this-in-production'
);

export interface CustomerSession {
    accessToken: string;
    refreshToken: string;
    idToken: string;
    expiresAt: number;
    customerId: string;
    email: string;
    firstName?: string;
    lastName?: string;
}

/**
 * Create a new customer session
 */
export async function createCustomerSession(session: CustomerSession): Promise<void> {
    const token = await new SignJWT({ session })
        .setProtectedHeader({ alg: 'HS256' })
        .setExpirationTime('7d')
        .sign(SESSION_SECRET);

    (await cookies()).set(SESSION_COOKIE_NAME, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/',
    });
}

/**
 * Get current customer session
 */
export async function getCustomerSession(): Promise<CustomerSession | null> {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

    if (!token) {
        return null;
    }

    try {
        const { payload } = await jwtVerify(token, SESSION_SECRET);
        return (payload.session as CustomerSession) || null;
    } catch (error) {
        console.error('Failed to verify session:', error);
        return null;
    }
}

/**
 * Update customer session
 */
export async function updateCustomerSession(updates: Partial<CustomerSession>): Promise<void> {
    const currentSession = await getCustomerSession();

    if (!currentSession) {
        throw new Error('No active session');
    }

    const updatedSession = { ...currentSession, ...updates };
    await createCustomerSession(updatedSession);
}

/**
 * Delete customer session
 */
export async function deleteCustomerSession(): Promise<void> {
    (await cookies()).delete(SESSION_COOKIE_NAME);
}

/**
 * Check if session is expired
 */
export function isSessionExpired(session: CustomerSession): boolean {
    return Date.now() >= session.expiresAt;
}

/**
 * Get customer ID from session
 */
export async function getCustomerId(): Promise<string | null> {
    const session = await getCustomerSession();
    return session?.customerId || null;
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
    const session = await getCustomerSession();
    return session !== null && !isSessionExpired(session);
}
