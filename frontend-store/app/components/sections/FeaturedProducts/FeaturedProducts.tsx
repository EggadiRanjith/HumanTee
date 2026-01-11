/**
 * FeaturedProducts Section
 * FANG-Level Refactored with modular architecture
 * Integrated with API settings and proper loading states
 */

"use client";

import { useState, useEffect, memo } from 'react';
import { logError } from '@/lib/logger';
import { SectionHeader, GradientOverlay } from '@/app/components/ui/layout';
import {
  FeaturedProductsSkeleton,
  FeaturedProductsEmpty,
  FeaturedProductsError,
  ProductGrid
} from './components';
import { useSectionSettings } from '@/app/hooks/useSettings';
import { fetchProducts } from '@/lib/app/api/products';
import { adaptProducts } from '@/lib/app/adapters/product.adapter';
import { Product } from '@/app/types/product.types';

function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState(false);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);

  // Get featured settings from centralized cache
  const { settings, isLoading: settingsLoading } = useSectionSettings('featured');

  // Extract values with defaults
  const enabled = settings?.enabled ?? true;
  const title = settings?.title || "Featured Products";
  const subtitle = settings?.subtitle || "Discover our curated collection";

  // Fetch products
  useEffect(() => {
    async function loadProducts() {
      try {
        const apiProducts = await fetchProducts();
        const adaptedProducts = adaptProducts(apiProducts);
        setProducts(adaptedProducts);
      } catch (err) {
        logError(err, 'Failed to fetch products');
        setError(true);
      } finally {
        setIsLoadingProducts(false);
      }
    }

    loadProducts();
  }, []);

  // Don't render if explicitly disabled
  if (enabled === false) return null;

  // Loading state - show header + skeleton
  if (settingsLoading || isLoadingProducts) {
    return (
      <section className="relative w-full pt-12 pb-20 px-4 sm:px-6 md:px-10 lg:px-14 cinematic-bg-dusk">
        <GradientOverlay variant="aurora" />
        <div className="relative max-w-screen-xl mx-auto">
          {/* Show header even while loading */}
          <SectionHeader
            title={title}
            actionText={settings?.actionText}
            actionHref={settings?.actionHref}
          />
          {/* Product grid skeleton */}
          <FeaturedProductsSkeleton />
        </div>
      </section>
    );
  }

  // Error state - show heading + empty
  if (error) {
    return (
      <section className="relative w-full pt-12 pb-20 px-4 sm:px-6 md:px-10 lg:px-14 cinematic-bg-dusk">
        <GradientOverlay variant="aurora" />
        <div className="relative max-w-screen-xl mx-auto">
          {/* Always show header */}
          <SectionHeader
            title={title}
            actionText={settings?.actionText}
            actionHref={settings?.actionHref}
          />
          <FeaturedProductsEmpty />
        </div>
      </section>
    );
  }

  // Empty state - show heading + empty
  if (!products || products.length === 0) {
    return (
      <section className="relative w-full pt-12 pb-20 px-4 sm:px-6 md:px-10 lg:px-14 cinematic-bg-dusk">
        <GradientOverlay variant="aurora" />
        <div className="relative max-w-screen-xl mx-auto">
          {/* Always show header */}
          <SectionHeader
            title={title}
            actionText={settings?.actionText}
            actionHref={settings?.actionHref}
          />
          <FeaturedProductsEmpty />
        </div>
      </section>
    );
  }

  // Limit products based on settings
  const displayProducts = products.slice(0, settings?.limit || 8);

  return (
    <section
      className="relative w-full pt-12 pb-20 px-4 sm:px-6 md:px-10 lg:px-14 cinematic-bg-dusk"
      aria-label="Featured products"
    >
      {/* Ambient Aurora Glow */}
      <GradientOverlay variant="aurora" />

      <div className="relative max-w-screen-xl mx-auto">
        {/* Header */}
        <SectionHeader
          title={title}
          actionText={settings?.actionText || "View All"}
          actionHref={settings?.actionHref || "/shop"}
        />

        {/* Product Grid */}
        <ProductGrid
          products={displayProducts}
          showViewAll={settings?.showViewAll ?? true}
        />
      </div>
    </section>
  );
}

// Memo with comparison function
export default memo(FeaturedProducts, () => {
  // No props - prevent re-renders
  return true;
});
