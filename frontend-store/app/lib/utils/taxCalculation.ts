/**
 * Tax Calculation Utility
 * Calculates GST based on cart total and tax settings
 */

export interface TaxSettings {
    enabled: boolean;
    rate: number;
    label: string;
    inclusive: boolean;
}

/**
 * Calculate tax amount based on subtotal and tax settings
 */
export function calculateTax(
    subtotal: number,
    taxSettings: TaxSettings
): { amount: number; label: string; isInclusive: boolean } {
    if (!taxSettings.enabled) {
        return { amount: 0, label: taxSettings.label, isInclusive: false };
    }

    let taxAmount: number;

    if (taxSettings.inclusive) {
        // Tax is already included in the price
        // Extract the tax: price / (1 + rate/100) * (rate/100)
        taxAmount = subtotal / (1 + taxSettings.rate / 100) * (taxSettings.rate / 100);
    } else {
        // Tax is added on top of the price
        // Calculate: price * (rate/100)
        taxAmount = subtotal * (taxSettings.rate / 100);
    }

    return {
        amount: taxAmount,
        label: taxSettings.label,
        isInclusive: taxSettings.inclusive
    };
}

/**
 * Calculate final total including tax and shipping
 */
export function calculateTotal(
    subtotal: number,
    taxSettings: TaxSettings,
    shippingCost: number = 0
): number {
    const tax = calculateTax(subtotal, taxSettings);

    if (tax.isInclusive) {
        // Tax already in subtotal, just add shipping
        return subtotal + shippingCost;
    } else {
        // Add tax and shipping to subtotal
        return subtotal + tax.amount + shippingCost;
    }
}
