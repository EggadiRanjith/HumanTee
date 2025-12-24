/**
 * Shipping Calculation Hook
 * Calculates shipping cost based on pincode and cart total
 */

export interface ShippingZone {
    id: string;
    name: string;
    icon: string;
    pincodes: string[];
    rate: number;
    freeShippingThreshold: number | null;
    isActive: boolean;
}

/**
 * Match pincode against zone patterns
 * Supports ranges (180000-194999) and wildcards (110*)
 */
function matchesPincode(pincode: string, patterns: string[]): boolean {
    const pin = parseInt(pincode);

    for (const pattern of patterns) {
        // Range format: 180000-194999
        if (pattern.includes('-')) {
            const [start, end] = pattern.split('-').map(p => parseInt(p));
            if (pin >= start && pin <= end) {
                return true;
            }
        }
        // Wildcard format: 110*
        else if (pattern.includes('*')) {
            const prefix = pattern.replace('*', '');
            if (pincode.startsWith(prefix)) {
                return true;
            }
        }
        // Exact match
        else if (pincode === pattern) {
            return true;
        }
    }

    return false;
}

/**
 * Calculate shipping cost based on pincode and cart total
 */
export function calculateShipping(
    pincode: string,
    cartTotal: number,
    zones: ShippingZone[]
): { cost: number; zoneName: string; isFree: boolean } {
    // Find matching zone
    const matchedZone = zones.find(zone =>
        zone.isActive && matchesPincode(pincode, zone.pincodes)
    );

    if (!matchedZone) {
        // No zone found - could return default rate or error
        return { cost: 0, zoneName: 'Unknown', isFree: false };
    }

    // Check if free shipping threshold is met
    const isFree = matchedZone.freeShippingThreshold !== null &&
        cartTotal >= matchedZone.freeShippingThreshold;

    return {
        cost: isFree ? 0 : matchedZone.rate,
        zoneName: matchedZone.name,
        isFree
    };
}
