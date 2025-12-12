/**
 * FeaturedProducts Section
 * Server Component - fetches products from Shopify with ISR caching
 */

import { Suspense } from 'react';
import { SectionHeader, GradientOverlay } from '@/app/components/ui/layout';
import { getFeaturedProducts } from '@/app/data/products.data';
import { FeaturedProductsState } from './FeaturedProductsState';
import { ProductGrid } from './ProductGrid';
import { ProductCardSkeleton } from '@/app/components/ui/loaders/ProductCardSkeleton';

// ISR: Revalidate every 5 minutes (featured products change less often)
export const revalidate = 300;

export default async function FeaturedProducts() {
  let products = [];
  let hasError = false;

  try {
    products = await getFeaturedProducts();
  } catch (error) {
    console.error('Error loading featured products:', error);
    hasError = true;
  }

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

        {/* Error State */}
        {hasError ? (
          <FeaturedProductsState type="error" />
        ) : products.length === 0 ? (
          /* Empty State */
          <FeaturedProductsState type="empty" />
        ) : (
          <ProductGrid products={products} />
        )}
      </div>
    </section>
  );
}
