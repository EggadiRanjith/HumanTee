/**
 * Store Settings Interface
 * Complete configuration for the store
 */
export interface StoreSettings {
    // General
    storeName: string;
    storeEmail: string;
    currency: string;
    timezone: string;
    lowStockThreshold: number;

    // Payments
    enableRazorpay: boolean;
    razorpayKeyId?: string;
    razorpayKeySecret?: string;
    enableCOD: boolean;
    codCharge: number;

    // Shipping
    freeShippingThreshold: number;
    standardShippingRate: number;
    expressShippingRate: number;

    // Notifications
    orderConfirmationEmail: boolean;
    orderShippedEmail: boolean;
    lowStockAlert: boolean;
}

/**
 * Validation Result
 */
export interface ValidationResult {
    valid: boolean;
    errors: string[];
}

/**
 * Test Result
 */
export interface TestResult {
    success: boolean;
    error?: string;
    details?: any;
}

/**
 * System Features Toggle
 */
export interface SystemFeatures {
    // Audit Logs
    auditLogsEnabled: boolean;
    auditLogsDisabledSince?: string;

    // Discounts
    discountsEnabled: boolean;
    discountsDisabledSince?: string;

    // Support Tickets
    ticketsEnabled: boolean;
    ticketsDisabledSince?: string;
}

