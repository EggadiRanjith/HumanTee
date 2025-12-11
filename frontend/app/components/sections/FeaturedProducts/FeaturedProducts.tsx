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


const FeaturedProducts = () => {
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
      </div>
    </section>
  );
};

export default FeaturedProducts;
