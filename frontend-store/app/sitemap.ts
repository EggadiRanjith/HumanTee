import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://humantee.in';

    // Fetch all products for dynamic sitemap
    let productUrls: MetadataRoute.Sitemap = [];

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://humantee.onrender.com'}/products/all`, {
            cache: 'no-store',
        });

        if (response.ok) {
            const products = await response.json();

            productUrls = products.map((product: any) => ({
                url: `${baseUrl}/product/${product.handle || product.id}`,
                lastModified: product.updated_at ? new Date(product.updated_at) : new Date(),
                changeFrequency: 'weekly' as const,
                priority: 0.8, // Products are high priority for e-commerce
            }));
        }
    } catch (error) {
        console.error('Failed to fetch products for sitemap:', error);
    }

    const staticPages: MetadataRoute.Sitemap = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1.0,
        },
        {
            url: `${baseUrl}/shop`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/contact`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.5,
        },
        {
            url: `${baseUrl}/shipping`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.5,
        },
        {
            url: `${baseUrl}/terms-privacy`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.3,
        },
    ];

    return [
        ...staticPages,
        ...productUrls, // Include all products
    ];
}
