/**
 * Product Details Data
 * Server function to fetch complete product information from Shopify
 */

import { shopifyFetch, getInventoryLevels } from "@/app/lib/shopify";

const PRODUCT_DETAIL_QUERY = `
  query GetProductByHandle($handle: String!) {
    product(handle: $handle) {
      id
      title
      description
      descriptionHtml
      handle
      vendor
      productType
      featuredImage {
        url
        altText
        width
        height
      }
      images(first: 10) {
        nodes {
          url
          altText
          width
          height
        }
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
      options {
        name
        optionValues {
          name
        }
      }
      variants(first: 50) {
        edges {
          node {
            id
            title
            sku
            image {
              url
              altText
            }
            price {
              amount
              currencyCode
            }
            compareAtPrice {
              amount
              currencyCode
            }
            selectedOptions {
              name
              value
            }
          }
        }
      }
    }
  }
`;

export async function getProductByHandle(handle: string) {
  const data: any = await shopifyFetch(PRODUCT_DETAIL_QUERY, { handle });

  if (!data.product) {
    return null;
  }

  const product = data.product;

  // Get variant IDs for inventory lookup
  const variantIds = product.variants.edges.map(({ node }: any) => node.id);

  // Fetch real inventory from Admin API (private token)
  const inventoryMap = await getInventoryLevels(variantIds);

  // Calculate total stock from Admin API inventory data
  let totalStock = 0;
  if (inventoryMap.size > 0) {
    // Use Admin API inventory data
    inventoryMap.forEach((quantity) => {
      totalStock += quantity;
    });
  }

  // Fallback to 100 if Admin API not available
  totalStock = totalStock || 100;

  // Extract sizes from options (assuming "Size" option exists)
  const sizeOption = product.options.find((opt: any) => opt.name.toLowerCase() === 'size');
  const sizes = sizeOption ? sizeOption.optionValues.map((val: any) => val.name) : [];

  return {
    id: product.id,
    title: product.title,
    description: product.description,
    descriptionHtml: product.descriptionHtml,
    handle: product.handle,
    vendor: product.vendor,
    productType: product.productType,
    price: Number(product.priceRange.minVariantPrice.amount),
    currency: product.priceRange.minVariantPrice.currencyCode,
    originalPrice: product.compareAtPriceRange?.minVariantPrice?.amount
      ? Number(product.compareAtPriceRange.minVariantPrice.amount)
      : undefined,
    image: product.featuredImage?.url || "/images/fallbacks/product-fallback.png",
    imageAlt: product.featuredImage?.altText || product.title,
    images: product.images.nodes.length > 0
      ? product.images.nodes.map((img: any) => img.url)
      : ["/images/fallbacks/product-fallback.png"],
    stock: totalStock,
    details: [
      "Premium quality fabric",
      "Handcrafted with care",
      "Comfortable fit",
      "Durable construction"
    ],
    sizes: sizes,
    options: product.options,
    variants: product.variants.edges.map(({ node }: any) => ({
      id: node.id,
      title: node.title,
      sku: node.sku,
      price: Number(node.price.amount),
      currency: node.price.currencyCode,
      compareAtPrice: node.compareAtPrice ? Number(node.compareAtPrice.amount) : null,
      image: node.image?.url,
      imageAlt: node.image?.altText || node.title,
      selectedOptions: node.selectedOptions,
    })),
  };
}

