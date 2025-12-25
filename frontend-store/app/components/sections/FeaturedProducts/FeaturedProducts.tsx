/**
 * FeaturedProducts Section
 * FANG-Level Refactored with modular architecture
 * Integrated with API settings and proper loading states
 */

"use client";

import { useState, useEffect, memo } from 'react';
import { SectionHeader, GradientOverlay } from '@/app/components/ui/layout';
import {
  FeaturedProductsSkeleton,
  FeaturedProductsEmpty,
  FeaturedProductsError,
  ProductGrid
} from './components';
import { useFeaturedSettings } from './hooks';
import { fetchProducts } from '@/lib/app/api/products';
import { adaptProducts } from '@/lib/app/adapters/product.adapter';
import { Product } from '@/app/types/product.types';

function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState(false);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);

  // Fetch settings from API with config fallback
  const { settings, isLoading: settingsLoading } = useFeaturedSettings();

  // Fetch products
  useEffect(() => {
    async function loadProducts() {
      try {
        const apiProducts = await fetchProducts();
        const adaptedProducts = adaptProducts(apiProducts);
        setProducts(adaptedProducts);
      } catch (err) {
        console.error('Failed to fetch products:', err);
        setError(true);
      } finally {
        setIsLoadingProducts(false);
      }
    }

    loadProducts();
  }, []);

  // Don't render if section is disabled
  if (!settings.enabled) return null;

  // Loading state
  if (settingsLoading || isLoadingProducts) {
    return (
      <section className="relative w-full pt-12 pb-20 px-4 sm:px-6 md:px-10 lg:px-14 cinematic-bg-dusk">
        <GradientOverlay variant="aurora" />
        <div className="relative max-w-screen-xl mx-auto">
          <FeaturedProductsSkeleton />
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section className="relative w-full pt-12 pb-20 px-4 sm:px-6 md:px-10 lg:px-14 cinematic-bg-dusk">
        <GradientOverlay variant="aurora" />
        <div className="relative max-w-screen-xl mx-auto">
          <FeaturedProductsError />
        </div>
      </section>
    );
  }

  // Empty state
  if (products.length === 0) {
    return (
      <section className="relative w-full pt-12 pb-20 px-4 sm:px-6 md:px-10 lg:px-14 cinematic-bg-dusk">
        <GradientOverlay variant="aurora" />
        <div className="relative max-w-screen-xl mx-auto">
          <FeaturedProductsEmpty />
        </div>
      </section>
    );
  }

  // Limit products based on settings
  const displayProducts = products.slice(0, settings.limit);

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
          title={settings.title}
          subtitle={settings.subtitle}
          actionText={settings.actionText}
          actionHref={settings.actionHref}
        />

        {/* Product Grid */}
        <ProductGrid
          products={displayProducts}
          showViewAll={settings.showViewAll}
        />
      </div>
    </section>
  );
}

// Memo with comparison function
export default memo(FeaturedProducts, () => {
  // No props to compare - always re-render on parent update
  return false;
});
