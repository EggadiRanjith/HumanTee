import { Suspense } from 'react';
import { ProductCard } from '@/app/components/ui/cards';
import { GradientOverlay } from '@/app/components/ui/layout';
import { getShopProducts } from '@/app/data/shop.data';
import { ShopErrorState } from './ShopErrorState';
import { ShopEmptyState } from './ShopEmptyState';
import { ProductCardSkeleton } from '@/app/components/ui/loaders/ProductCardSkeleton';
import type { Metadata } from 'next';

// ISR: Revalidate every 5 minutes (300s) - shop changes less frequently
export const revalidate = 300;

export const metadata: Metadata = {
  title: 'Shop',
  description: 'Explore our premium collection of handcrafted t-shirts',
};

export default async function ShopPage() {
  let products = [];
  let hasError = false;

  try {
    products = await getShopProducts();
  } catch (error) {
    console.error('Error loading shop products:', error);
    hasError = true;
  }

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

        {/* Error State */}
        {hasError ? (
          <ShopErrorState />
        ) : products.length === 0 ? (
          /* Empty State */
          <ShopEmptyState />
        ) : (
          /* Product Grid */
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mt-10">
            {products.map((product: any, index: number) => (
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
