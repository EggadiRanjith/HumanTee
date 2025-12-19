import { cookies } from "next/headers";

/**
 * Get the current cart ID from cookies
 */
export async function getCartId(): Promise<string | null> {
    const cookieStore = await cookies();
    return cookieStore.get("cartId")?.value || null;
}

/**
 * Store cart ID in HTTP-only cookie
 */
export async function setCartId(id: string): Promise<void> {
    const cookieStore = await cookies();
    cookieStore.set("cartId", id, {
        path: "/",
        httpOnly: true,
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 7 days
    });
}

/**
 * Clear cart ID from cookies
 */
export async function clearCartId(): Promise<void> {
    const cookieStore = await cookies();
    cookieStore.delete("cartId");
}
