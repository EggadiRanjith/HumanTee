/**
 * Client-side API helper for admin pages
 * Phase 8: Simplified fetch wrapper with auth
 */

export async function adminApi(
    endpoint: string,
    options?: RequestInit
): Promise<Response> {
    const token = localStorage.getItem('auth_token');

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
            ...options?.headers,
        },
        credentials: 'include',
    });

    return response;
}

/**
 * Handle admin action with error handling
 */
export async function handleAdminAction(
    action: () => Promise<Response>,
    onSuccess?: () => void
): Promise<void> {
    try {
        const response = await action();

        // Auth errors → redirect
        if (response.status === 401) {
            window.location.href = '/admin/login';
            return;
        }

        if (response.status === 403) {
            window.location.href = '/403';
            return;
        }

        // All other errors → show message
        if (!response.ok) {
            const data = await response.json().catch(() => ({}));
            const message = data.message || 'Action failed';
            throw new Error(message);
        }

        // Success
        if (onSuccess) {
            onSuccess();
        }

    } catch (error) {
        // Show error (no branching logic)
        const message = error instanceof Error
            ? error.message
            : 'Network error. Please check your connection.';

        alert(message);
        throw error;
    }
}
