/**
 * FeaturedProducts Empty State
 * Shown when no products are available
 */

"use client";

import dynamic from 'next/dynamic';
import Link from 'next/link';
import emptyAnimation from '@/public/animation/lottie/empty_shop.json';

// Dynamically import Lottie to avoid SSR issues
const Lottie = dynamic(() => import('lottie-react'), { ssr: false });

interface FeaturedProductsEmptyProps {
    message?: string;
}

export default function FeaturedProductsEmpty({ message }: FeaturedProductsEmptyProps = {}) {
    const description = message || 'Check back soon for our curated collection';

    return (
        <div className="flex flex-col items-center justify-center py-16 sm:py-20 lg:py-24">
            <div className="w-[200px] sm:w-[280px] lg:w-[320px] mb-6">
                <Lottie
                    animationData={emptyAnimation}
                    loop={true}
                    autoplay={true}
                />
            </div>
            <h3 className="text-[18px] sm:text-[22px] lg:text-[26px] font-light uppercase tracking-[0.12em] brand-text-primary mb-3">
                No Featured Products
            </h3>
            <p className="brand-text-muted text-[11px] sm:text-[12px] uppercase tracking-[0.18em] mb-8 text-center max-w-md">
                {description}
            </p>
            <Link
                href="/shop"
                className="
          brand-text-muted text-step--1 tracking-wide 
          border border-white/10 rounded-full
          px-8 py-3 motion-cinematic luxury-glass
          hover:border-white/20 hover:brand-text-primary
        "
            >
                BROWSE SHOP
            </Link>
        </div>
    );
}
