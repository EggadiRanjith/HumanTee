"use client";

import { ProductCard } from '@/app/components/ui/cards';
import { SectionHeader, GradientOverlay } from '@/app/components/ui/layout';
import { shopProducts } from '@/app/data/shop.data';
import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import Link from 'next/link';

// Dynamically import Lottie to avoid SSR issues
const Lottie = dynamic(() => import('lottie-react'), { ssr: false });

export default function ShopPage() {
  const [emptyShopAnimation, setEmptyShopAnimation] = useState(null);

  useEffect(() => {
    // Load Lottie animation only on client side
    if (shopProducts.length === 0) {
      fetch('/animation/lottie/empty_shop.json')
        .then(res => res.json())
        .then(data => setEmptyShopAnimation(data))
        .catch(err => console.error('Failed to load empty shop animation:', err));
    }
  }, []);

  return (
    <div className="min-h-screen cinematic-bg-dusk relative pt-[var(--header-height)]">

      {/* Ambient Glow */}
      <GradientOverlay variant="violet" />

      <div className="relative max-w-screen-xl mx-auto px-4 sm:px-6 md:px-10 lg:px-14 pb-12 pt-12">

        {/* Page Header */}
        <div className="mb-8 sm:mb-10 text-center">
          <h1 className="text-[22px] sm:text-[30px] lg:text-[38px] font-light uppercase tracking-[0.14em] brand-text-primary">
            All Products
          </h1>
          <p className="brand-text-muted text-[10px] sm:text-[11px] uppercase tracking-[0.22em] mt-2">
            Explore our premium collections
          </p>
        </div>

        {/* Empty State */}
        {shopProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 sm:py-20 lg:py-24 min-h-[60vh]">
            {emptyShopAnimation && (
              <div className="w-[200px] sm:w-[280px] lg:w-[320px] mb-6">
                <Lottie animationData={emptyShopAnimation} loop={true} />
              </div>
            )}
            <h3 className="text-[18px] sm:text-[22px] lg:text-[26px] font-light uppercase tracking-[0.12em] brand-text-primary mb-3">
              No Products Available
            </h3>
            <p className="brand-text-muted text-[11px] sm:text-[12px] uppercase tracking-[0.18em] mb-8 text-center max-w-md">
              Our collection is being curated. Check back soon for premium pieces.
            </p>
            <Link
              href="/"
              className="
                brand-text-muted text-step--1 tracking-wide 
                border border-white/10 rounded-full
                px-8 py-3 motion-cinematic luxury-glass
                hover:border-white/20 hover:brand-text-primary
              "
            >
              BACK TO HOME
            </Link>
          </div>
        ) : (
          /* Product Grid */
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mt-10">
            {shopProducts.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                priority={index < 3}
              />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

