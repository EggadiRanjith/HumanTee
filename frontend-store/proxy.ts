import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { fetchMaintenanceStatus } from '@/lib/maintenance';

let maintenanceCache = { enabled: false, lastChecked: 0 };
const CACHE_TTL = 30_000;

export default async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    if (
        pathname.startsWith('/_next') ||
        pathname.startsWith('/api/') ||
        pathname.startsWith('/static') ||
        pathname.includes('.') ||
        pathname.startsWith('/maintenance')
    ) {
        return NextResponse.next();
    }

    const now = Date.now();
    const isAdmin = request.cookies.get('admin_bypass')?.value === 'true';

    if (now - maintenanceCache.lastChecked < CACHE_TTL) {
        if (maintenanceCache.enabled && !isAdmin) {
            return NextResponse.redirect(new URL('/maintenance', request.url));
        }
    } else {
        try {
            const data = await fetchMaintenanceStatus();
            maintenanceCache = { enabled: data.enabled, lastChecked: now };
            if (data.enabled && !isAdmin) {
                return NextResponse.redirect(new URL('/maintenance', request.url));
            }
        } catch (error) {
            console.error('[Maintenance] Status check failed:', error);
            maintenanceCache = { enabled: true, lastChecked: now };
            if (!isAdmin) {
                return NextResponse.redirect(new URL('/maintenance', request.url));
            }
        }
    }

    const response = NextResponse.next();

    // 3. Cache Control & Headers (Original Proxy Logic)
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

    // Stale-while-revalidate for API routes
    if (pathname.startsWith('/api/')) {
        response.headers.set(
            'Cache-Control',
            's-maxage=1, stale-while-revalidate=59'
        );
    }

    // Cache product pages
    if (pathname.startsWith('/product/')) {
        response.headers.set(
            'Cache-Control',
            's-maxage=60, stale-while-revalidate=300'
        );
    }

    // Cache shop page
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
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};
