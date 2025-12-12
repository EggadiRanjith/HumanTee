/**
 * FeaturedProducts Section
 * Displays a grid of featured product cards
 * Refactored to use reusable components and centralized data
 */

"use client";

import { ProductCard } from '@/app/components/ui/cards';
import { SectionHeader, GradientOverlay } from '@/app/components/ui/layout';
import { featuredProducts } from '@/app/data/products.data';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';

// Dynamically import Lottie to avoid SSR issues
const Lottie = dynamic(() => import('lottie-react'), { ssr: false });

const FeaturedProducts = () => {
  const [emptyShopAnimation, setEmptyShopAnimation] = useState(null);

  useEffect(() => {
    // Load Lottie animation only on client side
    if (featuredProducts.length === 0) {
      fetch('/animation/lottie/empty_shop.json')
        .then(res => res.json())
        .then(data => setEmptyShopAnimation(data))
        .catch(err => console.error('Failed to load empty shop animation:', err));
    }
  }, []);

  return (
    <section className="relative w-full pt-12 pb-20 px-4 sm:px-6 md:px-10 lg:px-14 cinematic-bg-dusk">
      {/* Ambient Aurora Glow */}
      <GradientOverlay variant="aurora" />

      <div className="relative max-w-screen-xl mx-auto">
        {/* Header */}
        <SectionHeader
          title="Featured Pieces"
          actionText="View All"
          actionHref="/shop"
        />

        {/* Empty State */}
        {featuredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 sm:py-20 lg:py-24">
            {emptyShopAnimation && (
              <div className="w-[200px] sm:w-[280px] lg:w-[320px] mb-6">
                <Lottie animationData={emptyShopAnimation} loop={true} />
              </div>
            )}
            <h3 className="text-[18px] sm:text-[22px] lg:text-[26px] font-light uppercase tracking-[0.12em] brand-text-primary mb-3">
              No Featured Products
            </h3>
            <p className="brand-text-muted text-[11px] sm:text-[12px] uppercase tracking-[0.18em] mb-8 text-center max-w-md">
              Check back soon for our curated collection
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
        ) : (
          <>
            {/* Product Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              {featuredProducts.map((product, index) => (
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
        )}
      </div>
    </section>
  );
};

export default FeaturedProducts;

