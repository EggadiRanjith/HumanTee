/**
 * Structured Data (Schema.org) Generators
 * Helps search engines understand page content
 */

export interface Product {
    name: string;
    handle: string;
    description: string;
    price: number;
    images: string[];
    sku?: string;
    inStock: boolean;
    brand?: string;
}

export interface BreadcrumbItem {
    name: string;
    url: string;
}

/**
 * Generate Product Schema (schema.org/Product)
 * Used on product detail pages
 */
export function generateProductSchema(product: Product) {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://humantee.in';

    return {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.name,
        image: product.images,
        description: product.description,
        sku: product.sku || product.handle,
        brand: {
            '@type': 'Brand',
            name: product.brand || 'HumanTee',
        },
        offers: {
            '@type': 'Offer',
            price: product.price,
            priceCurrency: 'INR',
            availability: product.inStock
                ? 'https://schema.org/InStock'
                : 'https://schema.org/OutOfStock',
            url: `${baseUrl}/product/${product.handle}`,
        },
    };
}

/**
 * Generate Organization Schema (schema.org/Organization)
 * Used in site footer/layout
 */
export function generateOrganizationSchema() {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://humantee.in';

    return {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'HumanTee',
        url: baseUrl,
        logo: `${baseUrl}/logo.png`,
        description: 'Premium handcrafted t-shirts since 1931',
        sameAs: [
            'https://www.instagram.com/humanteeofficial',
        ],
        contactPoint: {
            '@type': 'ContactPoint',
            telephone: '+91-XXXXXXXXXX',
            contactType: 'Customer Service',
            email: 'support@humantee.com',
        },
    };
}

/**
 * Generate Breadcrumb Schema (schema.org/BreadcrumbList)
 * Used on product and category pages
 */
export function generateBreadcrumbSchema(items: BreadcrumbItem[]) {
    return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.name,
            item: item.url,
        })),
    };
}

/**
 * Generate WebSite Schema with SearchAction
 * Used in main layout
 */
export function generateWebSiteSchema() {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://humantee.in';

    return {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'HumanTee',
        url: baseUrl,
        potentialAction: {
            '@type': 'SearchAction',
            target: {
                '@type': 'EntryPoint',
                urlTemplate: `${baseUrl}/shop?search={search_term_string}`,
            },
            'query-input': 'required name=search_term_string',
        },
    };
}
