/**
 * Shop Page
 * FANG-Level Refactored with URL-based state and modular architecture
 * Displays all active products with filtering, sorting, and pagination
 */

"use client";

import React, { useState, useMemo, useCallback, Suspense } from 'react';
import { GradientOverlay } from '@/app/components/ui/layout';
import { useProducts } from '@/app/contexts/ProductsContext';
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


interface ShopSettings {
  categories?: string[];
  collections?: string[];
  sort_options?: { value: string; label: string }[];
  items_per_page?: number;
  show_filters?: boolean;
}

function ShopPageContent() {
  // Get all products from shared context
  const { products: allProducts, loading } = useProducts();

  // URL-based filters (shareable links!)
  const { filters, setFilters, clearFilters, activeFilterCount } = useShopFilters();

  // Hardcoded shop configuration (no backend settings needed)
  const itemsPerPage = 12;
  const showFilters = true;

  // Client-side filtering and pagination
  const { filteredProducts, totalPages } = useMemo(() => {
    let filtered = [...allProducts];

    // Apply category filter
    if (filters.category) {
      filtered = filtered.filter(p => p.category === filters.category);
    }

    // Apply collection filter
    if (filters.collection) {
      filtered = filtered.filter(p => p.collection === filters.collection);
    }

    // Calculate pagination
    const total = filtered.length;
    const pages = Math.ceil(total / itemsPerPage);
    const currentPage = filters.page || 1;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedProducts = filtered.slice(startIndex, startIndex + itemsPerPage);

    return {
      filteredProducts: paginatedProducts,
      totalPages: pages
    };
  }, [allProducts, filters.category, filters.collection, filters.page, itemsPerPage]);

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
    allProducts.forEach(p => {
      if (p.category) cats.add(p.category);
    });
    return Array.from(cats).sort();
  }, [allProducts]);

  const uniqueCollections = React.useMemo(() => {
    const colls = new Set<string>();
    allProducts.forEach(p => {
      if (p.collection) colls.add(p.collection);
    });
    return Array.from(colls).sort();
  }, [allProducts]);

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
        {showFilters && (
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
        {loading ? (
          <ShopSkeleton />
        ) : filteredProducts.length === 0 ? (
          <ShopEmpty />
        ) : (
          <>
            <ProductGrid products={filteredProducts} showViewAll={false} />
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
