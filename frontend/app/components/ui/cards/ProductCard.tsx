/**
 * ProductCard Component
 * Complete product card with image, badge, quick view, and pricing
 * 
 * @example
 * <ProductCard product={product} onQuickView={handleQuickView} />
 */

"use client";

import Image from 'next/image';
import Link from 'next/link';
import { memo } from 'react';
import { Product } from '@/app/types/product.types';
import { Badge, StockIndicator } from '@/app/components/ui/primitives';


interface ProductCardProps {
    product: Product;
    onQuickView?: (productId: number) => void;
    priority?: boolean;
    className?: string;
}

const ProductCard = ({
    product,
    onQuickView,
    priority = false,
    className = ''
}: ProductCardProps) => {
    return (
        <div className={`group relative ${className}`}>
            <Link
                href={`/product/${product.id}`}
                className="
          block relative w-full aspect-[4/5]
          overflow-hidden rounded-md 
          luxury-glass shadow-floating motion-cinematic
          hover:shadow-glow-violet-medium
        "
            >
                <Image
                    src={product.image}
                    alt={`${product.title} - ${product.subtitle}`}
                    fill
                    priority={priority}
                    sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="
            object-cover motion-luxury-slow 
            group-hover:scale-[1.05]
          "
                />

                {/* Badge */}
                {product.badge && (
                    <div className="absolute top-3 left-3">
                        <Badge variant={product.badge} />
                    </div>
                )}

                {/* Quick View - Desktop Only */}
                <div
                    className="
            absolute bottom-0 left-0 right-0 
            translate-y-full group-hover:translate-y-0 
            transition-transform duration-500 ease-cinematic
            bg-[#050512]
            border-t border-white/10
            hidden md:block
          "
                >
                    <button
                        className="w-full py-3 text-step--1 tracking-wide text-white font-bold"
                        onClick={(e) => {
                            e.preventDefault();
                            onQuickView?.(product.id);
                        }}
                    >
                        QUICK VIEW
                    </button>
                </div>
            </Link>

            {/* Product Info */}
            <div className="mt-3 sm:mt-4 text-center">
                <h3 className="brand-text-primary text-step-0 tracking-tight font-heading">
                    {product.title}
                </h3>

                {/* Pricing */}
                <div className="flex items-center justify-center gap-2 mt-2 mb-1">
                    {product.originalPrice && (
                        <span className="text-red-400/70 text-step--1 line-through">
                            {product.originalPrice}
                        </span>
                    )}
                    <span className="brand-text-primary text-step-0 font-heading">
                        {product.price}
                    </span>
                </div>

                {/* Stock Indicator */}
                <div className="flex items-center justify-center">
                    <StockIndicator stock={product.stock} />
                </div>
            </div>
        </div>
    );
};

// Memoize component to prevent unnecessary re-renders
export default memo(ProductCard, (prevProps, nextProps) => {
    return prevProps.product.id === nextProps.product.id &&
        prevProps.priority === nextProps.priority;
});
