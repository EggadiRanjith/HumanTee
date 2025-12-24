/**
 * FeaturedProducts Section
 * Phase 4: Integrated with backend product API
 */

import { SectionHeader, GradientOverlay } from '@/app/components/ui/layout';
import { FeaturedProductsState } from './FeaturedProductsState';
import { ProductGrid } from './ProductGrid';
import { fetchProducts } from '@/lib/app/api/products';
import { adaptProducts } from '@/lib/app/adapters/product.adapter';
import { Product } from '@/app/types/product.types';

export default async function FeaturedProducts() {
  let products: Product[] = [];
  let error = false;

  try {
    const apiProducts = await fetchProducts();
    products = adaptProducts(apiProducts);
  } catch (err) {
    console.error('Failed to fetch products:', err);
    error = true;
  }

  return (
    <section className="relative w-full pt-12 pb-20 px-4 sm:px-6 md:px-10 lg:px-14 cinematic-bg-dusk">
      {/* Ambient Aurora Glow */}
      <GradientOverlay variant="aurora" />

      <div className="relative max-w-screen-xl mx-auto">
        {/* Header */}
        <SectionHeader
          title="Featured Pieces"
          actionText={products.length > 0 ? "View All" : "Coming Soon"}
          actionHref={products.length > 0 ? "/shop" : "#"}
        />

        {/* Product Grid or Empty/Error State */}
        {error ? (
          <FeaturedProductsState type="error" />
        ) : products.length === 0 ? (
          <FeaturedProductsState type="empty" />
        ) : (
          <ProductGrid products={products} />
        )}
      </div>
    </section>
  );
}
