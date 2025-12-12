import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const response = NextResponse.next();

    const { pathname } = request.nextUrl;

    // Cache static assets aggressively (1 year)
    if (
        pathname.startsWith('/images/') ||
        pathname.startsWith('/fonts/') ||
        pathname.startsWith('/videos/') ||
        pathname.match(/\.(jpg|jpeg|png|gif|webp|avif|svg|woff|woff2|ttf|mp4|webm)$/)
    ) {
        response.headers.set(
            'Cache-Control',
            'public, max-age=316536000, immutable'
        );
    }

    // Stale-while-revalidate for API routes (instant responses)
    if (pathname.startsWith('/api/')) {
        response.headers.set(
            'Cache-Control',
            's-maxage=1, stale-while-revalidate=59'
        );
    }

    // Cache product pages with stale-while-revalidate
    if (pathname.startsWith('/product/')) {
        response.headers.set(
            'Cache-Control',
            's-maxage=60, stale-while-revalidate=300'
        );
    }

    // Cache shop page briefly
    if (pathname === '/shop') {
        response.headers.set(
            'Cache-Control',
            's-maxage=30, stale-while-revalidate=60'
        );
    }

    // Add security headers
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-XSS-Protection', '1; mode=block');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

    return response;
}

// Configure which paths the middleware should run on
export const config = {
    matcher: [
        /*
         * Match all request paths except:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!_next/static|_next/image|favicon.ico).*)',
    ],
};
