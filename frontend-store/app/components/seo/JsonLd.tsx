"use client";

/**
 * JSON-LD Structured Data Components
 * Adds rich snippets for Google Search results
 */

interface OrganizationSchemaProps {
    name: string;
    url: string;
    logo: string;
    description?: string;
}

export function OrganizationSchema({ name, url, logo, description }: OrganizationSchemaProps) {
    const schema = {
        "@context": "https://schema.org",
        "@type": "ClothingStore",
        "name": name,
        "url": url,
        "logo": logo,
        "description": description,
        "priceRange": "₹₹",
        "sameAs": [
            "https://www.instagram.com/humanteeofficial",
        ],
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
}

interface ProductSchemaProps {
    name: string;
    description: string;
    image: string[];
    price: number;
    currency: string;
    availability: 'InStock' | 'OutOfStock' | 'PreOrder';
    sku?: string;
    brand?: string;
}

export function ProductSchema({
    name,
    description,
    image,
    price,
    currency,
    availability,
    sku,
    brand = "HumanTee",
}: ProductSchemaProps) {
    const schema = {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": name,
        "description": description,
        "image": image,
        "brand": {
            "@type": "Brand",
            "name": brand,
        },
        "offers": {
            "@type": "Offer",
            "price": price,
            "priceCurrency": currency,
            "availability": `https://schema.org/${availability}`,
            "url": typeof window !== 'undefined' ? window.location.href : '',
        },
    };

    if (sku) {
        (schema as any).sku = sku;
    }

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
}

interface BreadcrumbItem {
    name: string;
    url: string;
}

export function BreadcrumbSchema({ items }: { items: BreadcrumbItem[] }) {
    const schema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": items.map((item, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "name": item.name,
            "item": item.url,
        })),
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
}
