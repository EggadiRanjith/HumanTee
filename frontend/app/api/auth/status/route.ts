/**
 * Auth Status API Route
 * Returns current authentication status
 */

import { NextResponse } from 'next/server';
import { getAuthenticatedCustomer } from '@/app/lib/auth-utils';

export async function GET() {
    try {
        const customer = await getAuthenticatedCustomer();

        if (!customer) {
            return NextResponse.json({ isAuthenticated: false });
        }

        return NextResponse.json({
            isAuthenticated: true,
            customerName: customer.firstName || customer.email.split('@')[0],
            email: customer.email,
        });
    } catch (error) {
        return NextResponse.json({ isAuthenticated: false });
    }
}
