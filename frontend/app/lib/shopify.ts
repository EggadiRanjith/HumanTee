import { createStorefrontApiClient } from "@shopify/storefront-api-client";
import { retryWithBackoff, classifyError } from "./api-errors";

// Storefront API Client - Public token for product data
export const shopify = createStorefrontApiClient({
    storeDomain: process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN!,
    apiVersion: "2025-01",
    publicAccessToken: process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN!,
});

export async function shopifyFetch<T>(query: string, variables = {}, retries = 2): Promise<T> {
    try {
        return await retryWithBackoff(async () => {
            const { data, errors } = await shopify.request(query, { variables });

            if (errors && Array.isArray(errors) && errors.length > 0) {
                const error = new Error(errors[0].message);
                (error as any).graphQLErrors = errors;
                throw error;
            }

            if (errors) {
                throw new Error("Shopify API request failed");
            }

            return data as T;
        }, retries);
    } catch (error) {
        const apiError = classifyError(error);
        console.error("Shopify API Error:", apiError);
        throw error;
    }
}

// Admin API Client - Private token for inventory data
const ADMIN_API_TOKEN = process.env.NEXT_PUBLIC_SHOPIFY_ADMIN_ACCESS_TOKEN;

export async function shopifyAdminFetch<T>(query: string, variables = {}): Promise<T> {
    if (!ADMIN_API_TOKEN) {
        console.warn("Admin API token not configured, skipping admin query");
        return null as T;
    }

    const url = `https://${process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN}/admin/api/2025-01/graphql.json`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Shopify-Access-Token': ADMIN_API_TOKEN,
            },
            body: JSON.stringify({ query, variables }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Admin API HTTP Error:", response.status, response.statusText);
            console.error("Error body:", errorText);
            return null as T;
        }

        const json = await response.json();
        const { data, errors } = json;

        if (errors && Array.isArray(errors) && errors.length > 0) {
            console.error("Shopify Admin API Error:", errors[0].message);
            throw new Error(errors[0].message);
        }

        return data as T;
    } catch (error) {
        console.error("Admin API request failed:", error);
        return null as T;
    }
}

/**
 * Fetch inventory levels for product variants using Admin API
 * @param variantIds - Array of variant GIDs
 * @returns Map of variant ID to quantity available
 */
export async function getInventoryLevels(variantIds: string[]): Promise<Map<string, number>> {
    if (!ADMIN_API_TOKEN || variantIds.length === 0) {
        return new Map();
    }

    const query = `
        query GetInventoryLevels($ids: [ID!]!) {
            nodes(ids: $ids) {
                ... on ProductVariant {
                    id
                    inventoryQuantity
                }
            }
        }
    `;

    try {
        const data: any = await shopifyAdminFetch(query, { ids: variantIds });

        if (!data) {
            return new Map();
        }

        const inventoryMap = new Map<string, number>();

        if (data.nodes && Array.isArray(data.nodes)) {
            data.nodes.forEach((node: any) => {
                if (node?.id && node?.inventoryQuantity !== undefined) {
                    inventoryMap.set(node.id, node.inventoryQuantity);
                }
            });
        }

        return inventoryMap;
    } catch (error) {
        console.error("Failed to fetch inventory levels:", error);
        return new Map();
    }
}
