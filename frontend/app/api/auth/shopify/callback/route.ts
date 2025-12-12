/**
 * OAuth Callback Handler - EXACT IMPLEMENTATION
 * Handles the OAuth redirect from Shopify Customer Account API
 * Path: /api/auth/shopify/callback
 */

import { NextRequest, NextResponse } from 'next/server';
import { createCustomerSession } from '@/app/lib/customer-session';
import { jwtDecode } from 'jwt-decode';

const CLIENT_ID = 'fde3f66c-5a26-4a62-882e-e29aaee36d8c';
const TOKEN_ENDPOINT = 'https://account.humantee.in/authentication/oauth/token';
const REDIRECT_URI = 'https://humantee.vercel.app/api/auth/shopify/callback';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');

    // Handle OAuth errors
    if (error) {
        console.error('OAuth error:', error);
        return NextResponse.redirect(new URL('/login?error=auth_failed', request.url));
    }

    // Validate required parameters
    if (!code) {
        return NextResponse.redirect(new URL('/login?error=invalid_request', request.url));
    }

    try {
        // Exchange code for tokens - SERVER SIDE ONLY
        const tokenResponse = await fetch(TOKEN_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                grant_type: 'authorization_code',
                client_id: CLIENT_ID,
                redirect_uri: REDIRECT_URI,
                code,
            }),
        });

        if (!tokenResponse.ok) {
            const errorText = await tokenResponse.text();
            console.error('Token exchange failed:', errorText);
            return NextResponse.redirect(new URL('/login?error=token_exchange_failed', request.url));
        }

        const tokens = await tokenResponse.json();

        // Decode ID token to get customer info
        const idTokenPayload = jwtDecode<{
            sub: string;
            email: string;
            given_name?: string;
            family_name?: string;
        }>(tokens.id_token);

        // Create session with httpOnly cookie
        await createCustomerSession({
            accessToken: tokens.access_token,
            refreshToken: tokens.refresh_token,
            idToken: tokens.id_token,
            expiresAt: Date.now() + tokens.expires_in * 1000,
            customerId: idTokenPayload.sub,
            email: idTokenPayload.email,
            firstName: idTokenPayload.given_name,
            lastName: idTokenPayload.family_name,
        });

        // Redirect to account page
        return NextResponse.redirect(new URL('/account', request.url));
    } catch (error) {
        console.error('Callback error:', error);
        return NextResponse.redirect(new URL('/login?error=auth_failed', request.url));
    }
}
