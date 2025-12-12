/**
 * Shopify Customer Account API Client
 * Handles authentication and customer data operations
 */

const CUSTOMER_API_URL = process.env.SHOPIFY_CUSTOMER_ACCOUNT_API_URL || 'https://account.humantee.in';
const CLIENT_ID = process.env.SHOPIFY_CUSTOMER_ACCOUNT_CLIENT_ID || 'fde3f66c-5a26-4a62-882e-e29aaee36d8c';
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

// OAuth endpoints
export const AUTH_ENDPOINTS = {
    authorize: `${CUSTOMER_API_URL}/authentication/oauth/authorize`,
    token: `${CUSTOMER_API_URL}/authentication/oauth/token`,
    logout: `${CUSTOMER_API_URL}/authentication/logout`,
};

/**
 * Generate OAuth authorization URL for customer login
 */
export function getAuthorizationUrl(state: string, nonce: string): string {
    const params = new URLSearchParams({
        client_id: CLIENT_ID,
        scope: 'openid email profile',
        response_type: 'code',
        redirect_uri: `${APP_URL}/api/auth/callback`,
        state,
        nonce,
    });

    return `${AUTH_ENDPOINTS.authorize}?${params.toString()}`;
}

/**
 * Exchange authorization code for access token
 */
export async function exchangeCodeForToken(code: string): Promise<{
    access_token: string;
    refresh_token: string;
    expires_in: number;
    id_token: string;
}> {
    const response = await fetch(AUTH_ENDPOINTS.token, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            grant_type: 'authorization_code',
            client_id: CLIENT_ID,
            redirect_uri: `${APP_URL}/api/auth/callback`,
            code,
        }),
    });

    if (!response.ok) {
        throw new Error('Failed to exchange code for token');
    }

    return response.json();
}

/**
 * Refresh access token using refresh token
 */
export async function refreshAccessToken(refreshToken: string): Promise<{
    access_token: string;
    refresh_token: string;
    expires_in: number;
}> {
    const response = await fetch(AUTH_ENDPOINTS.token, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            grant_type: 'refresh_token',
            client_id: CLIENT_ID,
            refresh_token: refreshToken,
        }),
    });

    if (!response.ok) {
        throw new Error('Failed to refresh token');
    }

    return response.json();
}

/**
 * Make authenticated request to Customer Account API
 */
export async function customerAccountFetch<T>(
    query: string,
    variables: Record<string, unknown> = {},
    accessToken: string
): Promise<T> {
    const response = await fetch(`${CUSTOMER_API_URL}/account/customer/api/2024-10/graphql.json`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
            query,
            variables,
        }),
    });

    if (!response.ok) {
        throw new Error(`Customer API request failed: ${response.statusText}`);
    }

    const json = await response.json();

    if (json.errors) {
        throw new Error(json.errors[0]?.message || 'Customer API error');
    }

    return json.data;
}

/**
 * Get customer profile
 */
export async function getCustomerProfile(accessToken: string) {
    const query = `
    query getCustomer {
      customer {
        id
        emailAddress {
          emailAddress
        }
        firstName
        lastName
        phoneNumber {
          phoneNumber
        }
        defaultAddress {
          address1
          address2
          city
          province
          country
          zip
        }
      }
    }
  `;

    return customerAccountFetch(query, {}, accessToken);
}

/**
 * Get customer orders
 */
export async function getCustomerOrders(accessToken: string, first: number = 10) {
    const query = `
    query getOrders($first: Int!) {
      customer {
        orders(first: $first) {
          edges {
            node {
              id
              name
              orderNumber
              processedAt
              financialStatus
              fulfillmentStatus
              totalPrice {
                amount
                currencyCode
              }
              lineItems(first: 10) {
                edges {
                  node {
                    title
                    quantity
                    price {
                      amount
                      currencyCode
                    }
                    image {
                      url
                      altText
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  `;

    return customerAccountFetch(query, { first }, accessToken);
}

/**
 * Update customer profile
 */
export async function updateCustomerProfile(
    accessToken: string,
    input: {
        firstName?: string;
        lastName?: string;
        phoneNumber?: string;
    }
) {
    const query = `
    mutation customerUpdate($input: CustomerUpdateInput!) {
      customerUpdate(input: $input) {
        customer {
          id
          firstName
          lastName
          phoneNumber {
            phoneNumber
          }
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

    return customerAccountFetch(query, { input }, accessToken);
}

/**
 * Get logout URL
 */
export function getLogoutUrl(idToken: string): string {
    const params = new URLSearchParams({
        id_token_hint: idToken,
        post_logout_redirect_uri: APP_URL,
    });

    return `${AUTH_ENDPOINTS.logout}?${params.toString()}`;
}
