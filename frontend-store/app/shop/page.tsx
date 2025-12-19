/**
 * Shop Page
 * FROZEN - Awaiting custom product system
 */

import { GradientOverlay } from '@/app/components/ui/layout';
import { ShopEmptyState } from './ShopEmptyState';

export default function ShopPage() {
  // PHASE 0: Products disabled - show empty state with animation
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

        {/* Empty State with Lottie Animation */}
        <ShopEmptyState />
      </div>
    </div>
  );
}
