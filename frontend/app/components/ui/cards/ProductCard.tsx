/**
 * ProductCard Component
 * Complete product card with image, badge, quick view, and pricing
 * 
 * @example
 * <ProductCard product={product} onQuickView={handleQuickView} />
 */

"use client";

import Link from 'next/link';
import { memo, useRef } from 'react';
import { m, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Product } from '@/app/types/product.types';
import { Badge, StockIndicator } from '@/app/components/ui/primitives';
import { SafeImage } from '@/app/components/ui/primitives/SafeImage';
import { getImagePlaceholder } from '@/app/lib/image-placeholders';


interface ProductCardProps {
    product: Product;
    onQuickView?: (productId: number | string) => void;
    priority?: boolean;
    className?: string;
}

const ProductCard = ({
    product,
    onQuickView,
    priority = false,
    className = ''
}: ProductCardProps) => {
    // Magnetic / Tilt Logic
    const ref = useRef<HTMLDivElement>(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    // Smooth spring physics for the tilt
    const springConfig = { damping: 20, stiffness: 300 };
    const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [7, -7]), springConfig);
    const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-7, 7]), springConfig);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
        const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;

        const width = rect.width;
        const height = rect.height;
        const mouseX = clientX - rect.left;
        const mouseY = clientY - rect.top;
        const xPct = mouseX / width - 0.5;
        const yPct = mouseY / height - 0.5;

        x.set(xPct);
        y.set(yPct);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <div className={`group relative ${className}`}>
            <m.div
                ref={ref}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                onTouchStart={handleMouseMove}
                onTouchMove={handleMouseMove}
                onTouchEnd={handleMouseLeave}
                style={{
                    rotateX,
                    rotateY,
                    transformStyle: "preserve-3d"
                }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                className="relative perspective-1000"
            >
                <Link
                    href={`/product/${(product as any).handle || product.id}`}
                    className="
              block relative w-full aspect-[4/5]
              overflow-hidden rounded-md 
              luxury-glass shadow-floating motion-cinematic
              hover:shadow-glow-violet-medium
              transform-gpu
            "
                >
                    <SafeImage
                        src={product.image}
                        alt={(product as any).imageAlt || product.title}
                        fill
                        priority={priority}
                        sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        fallbackType="product"
                        className="
                    object-cover motion-luxury-slow
                    group-hover:scale-[1.05]
                    "
                    />

                    {/* Badge */}
                    {product.badge && (
                        <div className="absolute top-3 left-3 z-10 translate-z-10">
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
                z-20
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
            </m.div>

            {/* Product Info */}
            <div className="mt-3 sm:mt-4 text-center">
                <h3 className="brand-text-primary text-step-0 tracking-tight font-heading">
                    {product.title}
                </h3>

                {/* Pricing */}
                <div className="flex items-center justify-center gap-2 mt-2 mb-1 flex-wrap">
                    {product.originalPrice && (
                        <span className="text-white/40 text-step--1 line-through">
                            {product.currency} {product.originalPrice.toFixed(2)}
                        </span>
                    )}
                    <span className="brand-text-primary text-step-0 font-heading">
                        {product.currency} {product.price.toFixed(2)}
                    </span>
                </div>

                {/* Savings Display */}
                {product.originalPrice && product.originalPrice > product.price && (
                    <div className="mb-2">
                        <span className="inline-block px-2.5 py-0.5 text-[0.7rem] font-bold tracking-wider uppercase bg-gradient-to-r from-violet-500 to-fuchsia-400 text-white rounded-full shadow-glow-violet-medium">
                            Save {product.currency} {(product.originalPrice - product.price).toFixed(2)}
                        </span>
                    </div>
                )}

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
