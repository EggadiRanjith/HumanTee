/**
 * Robots.txt Configuration
 * Controls search engine crawler behavior
 */

import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://humantee.in';

    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: [
                    '/admin/',
                    '/api/',
                    '/checkout/',
                    '/account/',
                    '/orders',
                    '/cart',
                    '/_next/',
                    '/private/',
                    // Prevent indexing of paginated/filtered URLs
                    '/*?*sort_by=',
                    '/*?*page=',
                    '/*?*limit=',
                ],
            },
            {
                userAgent: 'Googlebot',
                allow: '/',
                disallow: ['/admin/', '/api/', '/checkout/', '/account/', '/orders', '/cart'],
            },
        ],
        sitemap: `${baseUrl}/sitemap.xml`,
    };
}
