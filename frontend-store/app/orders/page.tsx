/**
 * Orders Page
 * FANG-Level Refactored with URL-based state and modular architecture
 * Displays all user orders with filtering, sorting, and search
 */

"use client";

import { useEffect, Suspense } from 'react';
import { useAuth } from "@/app/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { GradientOverlay } from "@/app/components/ui/layout";
import { OrderCard } from "@/app/components/ui/orders";
import { Pagination } from "@/app/components/ui/navigation/Pagination";
import { useOrders, useOrdersFilters } from './hooks';
import {
  OrdersHeader,
  OrdersFilters,
  OrdersSkeleton,
  OrdersEmpty,
  OrdersError
} from './components';

function OrdersPageContent() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  // URL-based filters (shareable links!)
  const { filters, setFilters, clearFilters, hasActiveFilters } = useOrdersFilters();

  // Fetch orders with filters
  const { orders, isLoading, error, totalPages, retry } = useOrders(filters);

  // Prevent browser scroll restoration - force scroll to top
  useEffect(() => {
    // Disable automatic scroll restoration
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    // Force immediate scroll to top without animation
    window.scrollTo(0, 0);

    // Cleanup: restore default behavior when component unmounts
    return () => {
      if ('scrollRestoration' in window.history) {
        window.history.scrollRestoration = 'auto';
      }
    };
  }, []);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [authLoading, isAuthenticated, router]);

  // Handle page change
  const handlePageChange = (page: number) => {
    setFilters({ page });
    // Note: Removed automatic scroll to prevent unwanted scrolling on page load
    // User can manually scroll if needed
  };

  // Show loading during auth check
  if (authLoading) {
    return (
      <div className="min-h-screen brand-bg pb-24 pt-[var(--header-height)] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white/40"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen brand-bg pb-24 pt-[var(--header-height)]">
      <GradientOverlay variant="violet" />

      <div className="relative max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-10 pt-12">
        {/* Header */}
        <OrdersHeader />

        {/* Filters */}
        <OrdersFilters
          filters={filters}
          onFilterChange={setFilters}
          onClearFilters={clearFilters}
          hasActiveFilters={hasActiveFilters}
        />

        {/* Content */}
        {isLoading ? (
          <OrdersSkeleton count={6} />
        ) : error ? (
          <OrdersError onRetry={retry} />
        ) : orders.length === 0 ? (
          <OrdersEmpty />
        ) : (
          <>
            {/* Order Cards */}
            <div className="space-y-5">
              {orders.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-10">
                <Pagination
                  currentPage={filters.page || 1}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// Wrap in Suspense to fix useSearchParams error
export default function OrdersPage() {
  return (
    <Suspense fallback={<OrdersSkeleton />}>
      <OrdersPageContent />
    </Suspense>
  );
}
