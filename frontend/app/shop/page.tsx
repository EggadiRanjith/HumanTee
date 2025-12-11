import { ProductCard } from '@/app/components/ui/cards';
import { SectionHeader, GradientOverlay } from '@/app/components/ui/layout';
import { shopProducts } from '@/app/data/shop.data';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Shop All Products",
  description: "Browse our complete collection of premium handcrafted t-shirts. Heavyweight fabrics, bespoke designs, and limited editions. Free shipping on orders above ₹2000.",
  keywords: ["t-shirts", "premium clothing", "shop", "buy t-shirts", "fashion store"],
  openGraph: {
    title: "Shop All Products | HumanTee",
    description: "Browse our complete collection of premium handcrafted t-shirts.",
    images: [{ url: "/images/banner1.png" }],
  },
};

export default function ShopPage() {
  return (
    <div className="min-h-screen cinematic-bg-dusk relative pt-[var(--header-height)]">

      {/* Ambient Glow */}
      <GradientOverlay variant="violet" />

      <div className="relative max-w-screen-xl mx-auto px-4 sm:px-6 md:px-10 lg:px-14 pb-12 pt-12">

        {/* Page Header */}
        <div className="mb-8 sm:mb-10 text-center">
          <h1 className="text-[22px] sm:text-[30px] lg:text-[38px] font-light uppercase tracking-[0.14em] brand-text-primary">
            All Products
          </h1>
          <p className="brand-text-muted text-[10px] sm:text-[11px] uppercase tracking-[0.22em] mt-2">
            Explore our premium collections
          </p>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mt-10">
          {shopProducts.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              priority={index < 3}
            />
          ))}
        </div>

      </div>
    </div>
  );
}
