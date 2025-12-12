"use client";

import { ProductCard } from '@/app/components/ui/cards';
import Link from 'next/link';

interface ProductGridProps {
    products: any[];
}

export function ProductGrid({ products }: ProductGridProps) {
    return (
        <>
            {/* Product Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                {products.map((product: any, index: number) => (
                    <ProductCard
                        key={product.id}
                        product={product}
                        priority={index === 0}
                    />
                ))}
            </div>

            {/* Mobile View All Button */}
            <div className="sm:hidden mt-10 flex justify-center">
                <Link
                    href="/shop"
                    className="
            brand-text-muted text-step--1 tracking-wide 
            border border-white/10 rounded-full
            px-6 py-2 motion-cinematic luxury-glass
            hover:border-white/20 hover:brand-text-primary
          "
                >
                    VIEW ALL
                </Link>
            </div>
        </>
    );
}
