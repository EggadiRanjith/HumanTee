import { ProductImageGallery, ProductInfo } from '@/app/components/ui/product';
import { GradientOverlay } from '@/app/components/ui/layout';
import { getProductDetail } from '@/app/data/product-details.data';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const product = getProductDetail(parseInt(id));

  if (!product) return {};

  return {
    title: product.title,
    description: product.description,
    keywords: ["t-shirt", product.title, "premium clothing", "HumanTee"],
    openGraph: {
      title: `${product.title} | HumanTee`,
      description: product.description,
      images: product.images.map(img => ({ url: img })),
    },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = getProductDetail(parseInt(id));

  if (!product) notFound();

  return (
    <div className="min-h-screen brand-bg-dusk pt-[var(--header-height)]">
      <GradientOverlay variant="violet" />

      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-10 pb-8 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">

          {/* Image Gallery */}
          <ProductImageGallery
            images={product.images}
            title={product.title}
            subtitle={product.subtitle}
            productId={product.id}
          />

          {/* Product Info - Client Component Island */}
          <ProductInfo product={product} />

        </div>
      </div>
    </div>
  );
}
