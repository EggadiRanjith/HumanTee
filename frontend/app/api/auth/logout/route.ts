/**
 * Logout API Route
 * Handles customer logout and session cleanup
 */

import { NextRequest, NextResponse } from 'next/server';
import { getCustomerSession, deleteCustomerSession } from '@/app/lib/customer-session';
import { getLogoutUrl } from '@/app/lib/shopify-customer';

export async function POST(request: NextRequest) {
    try {
        const session = await getCustomerSession();

        // Delete local session
        await deleteCustomerSession();

        // If we have an ID token, redirect to Shopify logout
        if (session?.idToken) {
            const logoutUrl = getLogoutUrl(session.idToken);
            return NextResponse.json({ logoutUrl });
        }

        // Otherwise just return success
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Logout error:', error);
        return NextResponse.json({ error: 'Logout failed' }, { status: 500 });
    }
}

export async function GET(request: NextRequest) {
    await deleteCustomerSession();
    return NextResponse.redirect(new URL('/', request.url));
}
