import { ProductImageGallery, ProductInfo } from '@/app/components/ui/product';
import { GradientOverlay } from '@/app/components/ui/layout';
import { getProductByHandle } from '@/app/data/product-details.data';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

// ISR: Revalidate every 60 seconds
export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ handle: string }> }): Promise<Metadata> {
  const { handle } = await params;
  const product = await getProductByHandle(handle);

  if (!product) return {};

  return {
    title: product.title,
    description: product.description,
    keywords: ["t-shirt", product.title, "premium clothing", "HumanTee"],
    openGraph: {
      title: `${product.title} | HumanTee`,
      description: product.description,
      images: product.images.map((img: { url: string }) => ({ url: img.url })),
    },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params;
  const product = await getProductByHandle(handle);

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
            subtitle={product.description?.substring(0, 50) || ''}
            productId={product.id}
          />

          {/* Product Info - Client Component Island */}
          <ProductInfo product={product} />

        </div>
      </div>
    </div>
  );
}
