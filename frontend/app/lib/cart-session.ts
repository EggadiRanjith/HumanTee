import { cookies } from "next/headers";

/**
 * Get the current cart ID from cookies
 */
export function getCartId(): string | null {
    return cookies().get("cartId")?.value || null;
}

/**
 * Store cart ID in HTTP-only cookie
 */
export function setCartId(id: string): void {
    cookies().set("cartId", id, {
        path: "/",
        httpOnly: true,
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 7 days
    });
}

/**
 * Clear cart ID from cookies
 */
export function clearCartId(): void {
    cookies().delete("cartId");
}
