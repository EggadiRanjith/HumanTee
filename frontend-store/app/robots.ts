/**
 * Robots.txt Configuration
 * Controls search engine crawler behavior
 */

import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://humantee.com';

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
                    '/cart',
                    '/_next/',
                    '/private/',
                ],
            },
            {
                userAgent: 'Googlebot',
                allow: '/',
                disallow: ['/admin/', '/api/', '/checkout/', '/account/', '/cart'],
            },
        ],
        sitemap: `${baseUrl}/sitemap.xml`,
    };
}
