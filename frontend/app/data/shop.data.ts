/**
 * Shop Products Data
 * Server function to fetch all products from Shopify
 */

import { shopifyFetch, getInventoryLevels } from "@/app/lib/shopify";

const SHOP_PRODUCTS_QUERY = `
  query GetAllProducts($first: Int!) {
    products(first: $first, sortKey: TITLE, reverse: false) {
      edges {
        node {
          id
          title
          handle
          featuredImage {
            url
            altText
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

export async function getShopProducts() {
  const data: any = await shopifyFetch(SHOP_PRODUCTS_QUERY, { first: 20 });

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

/**
 * Product Categories for filtering
 * Simplified since no tags in database
 */
export const productCategories = [
  { id: 'all', label: 'All Products', count: 0 },
] as const;
