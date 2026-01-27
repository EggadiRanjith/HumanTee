"use client";

import { ProductCard } from '@/app/components/ui/cards';
import Link from 'next/link';
import { Product } from '@/app/types/product.types';
import { useLoading } from '@/app/contexts/LoadingContext';

interface ProductGridProps {
    products: Product[];
    showViewAll?: boolean;
}

export function ProductGrid({ products, showViewAll = true }: ProductGridProps) {
    const { setLoading } = useLoading();

    return (
        <>
            {/* Product Grid - Luxury: Tight gaps for refined layout */}
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
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
                        onClick={() => setLoading(true)}
                        className="
                flex items-center justify-center
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
