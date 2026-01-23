import { ProductImageGallery, ProductInfo } from '@/app/components/ui/product';
import { GradientOverlay } from '@/app/components/ui/layout';
import { fetchProductBySlug } from '@/lib/app/api/products';
import { adaptProduct } from '@/lib/app/adapters/product.adapter';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { cache } from 'react';

// ✅ CRITICAL: Cache product fetch to prevent duplicate calls
// Without this, generateMetadata AND ProductPage both fetch the same product
const getCachedProduct = cache(async (slug: string) => {
  return fetchProductBySlug(slug);
});

// ISR: Revalidate every 60 seconds
export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ handle: string }> }): Promise<Metadata> {
  const { handle } = await params;

  try {
    const apiProduct = await getCachedProduct(handle); // ✅ Uses cache
    const product = adaptProduct(apiProduct);

    return {
      title: `${product.title} | HumanTee`,
      description: product.subtitle || product.title,
      keywords: ["t-shirt", product.title, "premium clothing", "HumanTee"],
      alternates: {
        canonical: `https://humantee.in/product/${handle}`,
      },
      openGraph: {
        title: `${product.title} | HumanTee`,
        description: product.subtitle || product.title,
        images: product.images?.map(url => ({ url })) || [{ url: product.image }],
        url: `https://humantee.in/product/${handle}`,
      },
      twitter: {
        card: 'summary_large_image',
        title: `${product.title} | HumanTee`,
        description: product.subtitle || product.title,
        images: product.images || [product.image],
      }
    };
  } catch {
    return {};
  }
}

export default async function ProductPage({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params;

  let apiProduct;
  try {
    apiProduct = await getCachedProduct(handle); // ✅ Cache hit (already fetched in generateMetadata)
  } catch {
    notFound();
  }

  const product = adaptProduct(apiProduct);

  // Extract actual sizes from variants (from API response)
  const availableSizes = apiProduct.variants
    ?.filter((v: any) => v.isActive)
    .map((v: any) => v.size) || [];

  // Extend Product to ProductDetail with required fields
  const productDetail = {
    ...product,
    description: product.subtitle || '',
    details: [],
    sizes: availableSizes.length > 0 ? availableSizes : ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    images: product.images || [product.image],
    vendor: 'HumanTee',
    productType: 'T-Shirt',
    variants: apiProduct.variants || []
  };

  return (
    <div className="min-h-screen brand-bg-dusk pt-[var(--header-height)]">
      <GradientOverlay variant="violet" />

      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-10 pb-8 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">

          {/* Image Gallery */}
          <ProductImageGallery
            images={productDetail.images}
            title={product.title}
            subtitle={product.subtitle || ''}
            productId={product.id as any}
          />

          {/* Product Info - Client Component Island */}
          <ProductInfo product={productDetail} />

        </div>
      </div>
    </div>
  );
}
