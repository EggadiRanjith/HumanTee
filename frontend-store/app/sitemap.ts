import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://humantee.in';

    // Fetch all products for dynamic sitemap
    let productUrls: MetadataRoute.Sitemap = [];

    try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://app.humantee.in';

        // Add timeout to prevent sitemap generation from hanging
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

        const response = await fetch(`${apiUrl}/products/all`, {
            next: { revalidate: 300 },
            signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (response.ok) {
            const raw = await response.json();
            const products = Array.isArray(raw) ? raw : (raw?.data ?? []);

            productUrls = products.map((product: any) => ({
                url: `${baseUrl}/product/${product.handle || product.id}`,
                lastModified: product.updated_at ? new Date(product.updated_at) : new Date(),
                changeFrequency: 'weekly' as const,
                priority: 0.8, // Products are high priority for e-commerce
            }));
        } else {
        }
    } catch (error) {
        // Log error but don't fail sitemap generation
        // Return static pages only if product fetch fails
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
