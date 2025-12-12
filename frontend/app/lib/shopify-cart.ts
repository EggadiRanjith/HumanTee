import { shopifyFetch } from "./shopify";
import { getCartId, setCartId } from "./cart-session";

// Type definitions for cart mutations
interface Cart {
  id: string;
  checkoutUrl?: string;
}

interface CartCreateResponse {
  cartCreate: {
    cart: Cart;
  };
}

interface CartLinesAddResponse {
  cartLinesAdd: {
    cart: Cart;
  };
}

const CREATE_CART_MUTATION = `
  mutation cartCreate($input: CartInput!) {
    cartCreate(input: $input) {
      cart {
        id
        checkoutUrl
      }
    }
  }
`;

const ADD_TO_CART_MUTATION = `
  mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart {
        id
      }
    }
  }
`;

/**
 * Add item to cart - creates new cart if needed, otherwise adds to existing
 * This ensures cart persists across page refreshes and multiple items
 */
export async function addToCart(variantId: string, quantity: number) {
  const existingCartId = getCartId();

  if (existingCartId) {
    // Cart exists - add to existing cart
    const data = await shopifyFetch<CartLinesAddResponse>(ADD_TO_CART_MUTATION, {
      cartId: existingCartId,
      lines: [{ merchandiseId: variantId, quantity }]
    });
    return data.cartLinesAdd.cart;
  } else {
    // No cart - create new cart
    const data = await shopifyFetch<CartCreateResponse>(CREATE_CART_MUTATION, {
      input: {
        lines: [{ merchandiseId: variantId, quantity }]
      }
    });

    // Store cart ID in cookie for persistence
    setCartId(data.cartCreate.cart.id);

    return data.cartCreate.cart;
  }
}
