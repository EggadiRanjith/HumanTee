/**
 * Shop Page
 * FANG-Level Refactored with URL-based state and modular architecture
 * Displays all active products with filtering, sorting, and pagination
 */

"use client";

import React, { useState, useEffect, useCallback, Suspense } from 'react';
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
import { publicSettingsApi } from '@/lib/app/api/public-settings';

interface ShopSettings {
  categories?: string[];
  collections?: string[];
  sort_options?: { value: string; label: string }[];
  items_per_page?: number;
  show_filters?: boolean;
}

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

  // Shop settings state (API only, no fallbacks)
  const [shopSettings, setShopSettings] = useState<ShopSettings | null>(null);
  const [settingsLoading, setSettingsLoading] = useState(true);

  // Load shop settings from API (no fallbacks)
  useEffect(() => {
    async function loadSettings() {
      try {
        const allSettings = await publicSettingsApi.getAll();
        const shopData = allSettings?.shop;
        setShopSettings(shopData || null);
      } catch (err) {
        logError(err, 'Failed to load shop settings');
        setShopSettings(null); // No fallback, just null
      } finally {
        setSettingsLoading(false);
      }
    }
    loadSettings();
  }, []);

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

  // Extract unique categories and collections from products
  const uniqueCategories = React.useMemo(() => {
    const cats = new Set<string>();
    products.forEach(p => {
      if (p.category) cats.add(p.category);
    });
    return Array.from(cats).sort();
  }, [products]);

  const uniqueCollections = React.useMemo(() => {
    const colls = new Set<string>();
    products.forEach(p => {
      if (p.collection) colls.add(p.collection);
    });
    return Array.from(colls).sort();
  }, [products]);

  // Standard sort options
  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'price_asc', label: 'Price: Low to High' },
    { value: 'price_desc', label: 'Price: High to Low' },
    { value: 'popular', label: 'Most Popular' }
  ];

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
            categories={uniqueCategories}
            collections={uniqueCollections}
            sortOptions={sortOptions}
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
          <ShopEmpty />
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
