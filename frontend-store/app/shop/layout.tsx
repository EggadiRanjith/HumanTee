/**
 * Shop Page Layout
 * Server Component to handle SEO metadata
 */

import { metadata as shopMetadata } from './metadata';
import { Metadata } from 'next';

export const metadata: Metadata = shopMetadata;

export default function ShopLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <section className="shop-layout">
            {children}
        </section>
    );
}
