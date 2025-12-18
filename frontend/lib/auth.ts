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
        console.error('Logout failed:', error);
    }
}
