"use client";

import { ProductCard } from '@/app/components/ui/cards';
import Link from 'next/link';
import { Product } from '@/app/types/product.types';

interface ProductGridProps {
    products: Product[];
    showViewAll?: boolean;
}

export function ProductGrid({ products, showViewAll = true }: ProductGridProps) {
    return (
        <>
            {/* Product Grid - Mobile Optimized to 2 columns */}
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 xs:gap-4 sm:gap-5 md:gap-6 lg:gap-8">
                {products.map((product, index) => (
                    <ProductCard
                        key={product.id}
                        product={product}
                        priority={index < 4}
                    />
                ))}
            </div>

            {/* Mobile View All Button - Touch Optimized */}
            {showViewAll && (
                <div className="sm:hidden mt-10 flex justify-center">
                    <Link
                        href="/shop"
                        className="
                min-h-[44px] min-w-[120px]
                brand-text-muted text-step--1 tracking-wide 
                border border-white/10 rounded-full
                px-6 py-3 motion-cinematic luxury-glass
                hover:border-white/20 hover:brand-text-primary
                active:scale-95 transition-transform
              "
                    >
                        VIEW ALL
                    </Link>
                </div>
            )}
        </>
    );
}
