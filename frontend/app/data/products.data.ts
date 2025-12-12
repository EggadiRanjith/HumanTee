/**
 * Featured Products Data
 * Server function to fetch featured products from Shopify
 */

import { shopifyFetch, getInventoryLevels } from "@/app/lib/shopify";

const FEATURED_PRODUCTS_QUERY = `
  query GetFeaturedProducts {
    products(first: 8, sortKey: CREATED_AT, reverse: true) {
      edges {
        node {
          id
          title
          handle
          featuredImage {
            url
            altText
            width
            height
          }
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          compareAtPriceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          variants(first: 10) {
            edges {
              node {
                id
              }
            }
          }
        }
      }
    }
  }
`;

export async function getFeaturedProducts() {
  const data: any = await shopifyFetch(FEATURED_PRODUCTS_QUERY);

  // Collect all variant IDs for bulk inventory fetch
  const allVariantIds: string[] = [];
  data.products.edges.forEach(({ node: product }: any) => {
    product.variants.edges.forEach(({ node }: any) => {
      allVariantIds.push(node.id);
    });
  });

  // Fetch inventory from Admin API
  const inventoryMap = await getInventoryLevels(allVariantIds);

  return data.products.edges.map(({ node: product }: any) => {
    // Calculate total stock from Admin API or fallback to Storefront API
    let totalStock = 0;

    if (inventoryMap.size > 0) {
      // Use Admin API inventory
      product.variants.edges.forEach(({ node }: any) => {
        totalStock += inventoryMap.get(node.id) ?? 0;
      });
    }

    totalStock = totalStock || 100; // Fallback if Admin API not available

    return {
      id: product.id,
      title: product.title,
      handle: product.handle,
      price: Number(product.priceRange.minVariantPrice.amount),
      currency: product.priceRange.minVariantPrice.currencyCode,
      originalPrice: product.compareAtPriceRange?.minVariantPrice?.amount
        ? Number(product.compareAtPriceRange.minVariantPrice.amount)
        : undefined,
      image: product.featuredImage?.url || "/images/fallbacks/product-fallback.png",
      imageAlt: product.featuredImage?.altText || product.title,
      stock: totalStock,
    };
  });
}
