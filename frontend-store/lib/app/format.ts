/**
 * Format price with proper currency and locale
 * NEVER format prices manually in components - always use this helper
 */
export function formatPrice(amount: number, currency: string): string {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency,
        maximumFractionDigits: 0
    }).format(amount);
}
