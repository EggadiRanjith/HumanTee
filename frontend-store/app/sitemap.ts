/**
 * Dynamic Sitemap Generation
 * Automatically includes all products and static pages
 */

import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://humantee.com';
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

    // Static pages
    const staticPages: MetadataRoute.Sitemap = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        },
        {
            url: `${baseUrl}/shop`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/about`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.7,
        },
        {
            url: `${baseUrl}/contact`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.6,
        },
    ];

    // Fetch products for dynamic pages
    try {
        const response = await fetch(`${apiUrl}/products`, {
            next: { revalidate: 3600 }, // Revalidate every hour
        });

        if (!response.ok) {
            console.error('Failed to fetch products for sitemap');
            return staticPages;
        }

        const products = await response.json();

        const productPages: MetadataRoute.Sitemap = products.map((product: any) => ({
            url: `${baseUrl}/product/${product.handle}`,
            lastModified: new Date(product.updatedAt || product.createdAt),
            changeFrequency: 'weekly' as const,
            priority: 0.8,
        }));

        return [...staticPages, ...productPages];
    } catch (error) {
        console.error('Error generating sitemap:', error);
        return staticPages;
    }
}
