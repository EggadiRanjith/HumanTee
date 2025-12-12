/**
 * Auth Utilities
 * Helper functions for authentication checks in components
 */

import { getCustomerSession, isSessionExpired } from './customer-session';

/**
 * Get authenticated customer or null
 * Use this in server components to check auth status
 */
export async function getAuthenticatedCustomer() {
    const session = await getCustomerSession();

    if (!session || isSessionExpired(session)) {
        return null;
    }

    return {
        id: session.customerId,
        email: session.email,
        firstName: session.firstName,
        lastName: session.lastName,
        accessToken: session.accessToken,
    };
}

/**
 * Require authentication
 * Throws error if not authenticated (use with error boundaries)
 */
export async function requireAuth() {
    const customer = await getAuthenticatedCustomer();

    if (!customer) {
        throw new Error('Authentication required');
    }

    return customer;
}
