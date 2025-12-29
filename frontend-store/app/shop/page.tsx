/**
 * Shop Page
 * FANG-Level Refactored with URL-based state and modular architecture
 * Displays all active products with filtering, sorting, and pagination
 */

"use client";

import { useState, useEffect, useCallback, Suspense } from 'react';
import { logError } from '@/lib/logger';
import { GradientOverlay } from '@/app/components/ui/layout';
import { fetchShopProducts } from '@/lib/app/api/products';
import { adaptProducts } from '@/lib/app/adapters/product.adapter';
import { Product } from '@/app/types/product.types';
import { ProductGrid } from '@/app/components/sections/FeaturedProducts/components';
import { Pagination } from '@/app/components/ui/navigation/Pagination';
import { useShopFilters } from './hooks';
import {
  ShopHeader,
  ShopSkeleton,
  ShopFilterChips,
  ShopEmpty,
  ShopError
} from './components';
import ShopFilters from './ShopFilters';
import { useSectionSettings } from "@/app/hooks/useSettings";

function ShopPageContent() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [totalPages, setTotalPages] = useState(1);

  // URL-based filters (shareable links!)
  const { filters, setFilters, clearFilters, activeFilterCount } = useShopFilters();

  // Extract primitive values to stabilize useEffect dependencies
  const category = filters.category;
  const collection = filters.collection;
  const page = filters.page;

  // Get shop settings from centralized cache
  const { settings: shopSettings, isLoading: settingsLoading } = useSectionSettings('shop');
  const itemsPerPage = shopSettings?.items_per_page || 12;

  // Load products when filters change
  useEffect(() => {
    if (settingsLoading) return;

    const loadProducts = async () => {
      setLoading(true);
      setError(false);

      try {
        const data = await fetchShopProducts({
          category,
          collection,
          page: page || 1,
          limit: itemsPerPage
        });
        setProducts(adaptProducts(data.products));
        setTotalPages(data.totalPages);
      } catch (err) {
        logError(err, 'Failed to fetch shop products');
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [category, collection, page, itemsPerPage, settingsLoading]);

  // Handle filter changes
  const handleFilterChange = useCallback((newFilters: {
    category?: string;
    collection?: string;
    sort?: string;
  }) => {
    setFilters({ ...newFilters, page: 1 }); // Reset to page 1 on filter change
  }, [setFilters]);

  // Handle page change
  const handlePageChange = (page: number) => {
    setFilters({ page });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Remove individual filter
  const handleRemoveFilter = (key: keyof typeof filters) => {
    setFilters({ [key]: undefined });
  };

  return (
    <div className="min-h-screen brand-bg pt-[var(--header-height)]">
      <GradientOverlay variant="violet" />

      <div className="relative max-w-screen-xl mx-auto px-4 xs:px-5 sm:px-6 md:px-8 lg:px-10">
        {/* Header */}
        <ShopHeader />

        {/* Filters */}
        {shopSettings?.show_filters !== false && (
          <ShopFilters
            onFilterChange={handleFilterChange}
            categories={shopSettings?.categories || []}
            collections={shopSettings?.collections || []}
            sortOptions={shopSettings?.sort_options || []}
            currentFilters={filters}
            activeFilterCount={activeFilterCount}
          />
        )}

        {/* Active Filter Chips */}
        <ShopFilterChips
          filters={filters}
          onRemoveFilter={handleRemoveFilter}
          onClearAll={clearFilters}
        />

        {/* Product Grid or States */}
        {loading || settingsLoading ? (
          <ShopSkeleton />
        ) : error ? (
          <ShopError />
        ) : products.length === 0 ? (
          <ShopEmpty />
        ) : (
          <>
            <ProductGrid products={products} showViewAll={false} />
            <Pagination
              currentPage={filters.page || 1}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </div>
    </div>
  );
}

// Wrap in Suspense to fix useSearchParams error
export default function ShopPage() {
  return (
    <Suspense fallback={<ShopSkeleton />}>
      <ShopPageContent />
    </Suspense>
  );
}
