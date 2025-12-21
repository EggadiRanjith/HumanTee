/**
 * SKU Generator
 * Generates unique SKUs for variants and products
 * 
 * CRITICAL RULES:
 * 1. Generated on variant creation (auto)
 * 2. Can be manually regenerated via "Generate" button
 * 3. NEVER auto-regenerates after product publish (skuLocked = true)
 * 4. Server validates uniqueness on save
 */

export const generateSKU = (productName: string, size?: string): string => {
    // Extract initials from product name
    const words = productName.trim().split(/\s+/);
    const initials = words
        .map((word) => word[0])
        .join('')
        .toUpperCase()
        .slice(0, 3);

    // Generate random suffix
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let suffix = '';
    for (let i = 0; i < 4; i++) {
        suffix += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    // Build SKU
    let sku = `${initials}-${suffix}`;

    // Add variant info if provided
    if (size) {
        sku += `-${size.toUpperCase()}`;
    }

    return sku;
};

export const validateSKU = (sku: string): boolean => {
    // SKU must be 3-50 characters, alphanumeric with hyphens
    return /^[A-Z0-9-]{3,50}$/.test(sku);
};
