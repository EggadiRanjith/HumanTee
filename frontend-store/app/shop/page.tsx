/**
 * Shop Page
 * Displays all active products with category and collection filtering
 */

"use client";

import { useState, useEffect, useCallback } from 'react';
import { GradientOverlay } from '@/app/components/ui/layout';
import { ShopEmptyState } from './ShopEmptyState';
import { ShopErrorState } from './ShopErrorState';
import { fetchShopProducts } from '@/app/lib/api/products';
import { adaptProducts } from '@/app/lib/adapters/product.adapter';
import { Product } from '@/app/types/product.types';
import { ProductGrid } from '@/app/components/sections/FeaturedProducts/ProductGrid';
import ShopFilters from './ShopFilters';

// Hardcoded for now - in production, fetch from API
const CATEGORIES = ['Drop 1', 'Drop 2', 'Drop 3'];
const COLLECTIONS = ['summer-collection', 'winter-collection', 'limited-edition'];

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [filters, setFilters] = useState<{
    productType?: string;
    category?: string;
    collection?: string;
  }>({});

  const loadProducts = useCallback(async () => {
    setLoading(true);
    setError(false);

    try {
      const apiProducts = await fetchShopProducts(filters);
      setProducts(adaptProducts(apiProducts));
    } catch (err) {
      console.error('Failed to fetch shop products:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const handleFilterChange = useCallback((newFilters: {
    productType?: string;
    category?: string;
    collection?: string;
  }) => {
    setFilters(newFilters);
  }, []);

  return (
    <div className="min-h-screen brand-bg pt-[var(--header-height)]">
      <GradientOverlay variant="violet" />

      <div className="relative max-w-screen-xl mx-auto px-4 sm:px-6 md:px-8 lg:px-10">
        <div className="mb-8 sm:mb-10 text-center pt-12">
          <h1 className="text-[22px] sm:text-[30px] lg:text-[38px] font-light uppercase tracking-[0.14em] brand-text-primary">
            All Products
          </h1>
          <p className="brand-text-muted text-[10px] sm:text-[11px] uppercase tracking-[0.22em] mt-2">
            Explore our premium collections
          </p>
        </div>

        {/* Filters */}
        <ShopFilters
          onFilterChange={handleFilterChange}
          categories={CATEGORIES}
          collections={COLLECTIONS}
        />

        {/* Product Grid or Empty/Error State */}
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block w-8 h-8 border-4 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" />
            <p className="mt-4 text-white/60 text-sm">Loading products...</p>
          </div>
        ) : error ? (
          <ShopErrorState />
        ) : products.length === 0 ? (
          <ShopEmptyState />
        ) : (
          <ProductGrid products={products} />
        )}
      </div>
    </div>
  );
}
