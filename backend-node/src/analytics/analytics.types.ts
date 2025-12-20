/**
 * Revenue Types
 * Clear definitions for accurate analytics
 */
export enum RevenueType {
    GROSS = 'GROSS',         // Total order amount (before any deductions)
    NET = 'NET',             // Gross - refunds - discounts
    COLLECTED = 'COLLECTED', // Actually received (excludes COD pending)
}

/**
 * Revenue Metrics
 * Complete breakdown of revenue
 */
export interface RevenueMetrics {
    gross: number;           // Total order value
    refunds: number;         // Total refunded amount
    discounts: number;       // Total discount amount
    net: number;             // gross - refunds - discounts
    collected: number;       // Actually collected (paid orders)
    pending: number;         // COD orders not yet collected
    currency: string;        // Currency code
}

/**
 * Order Metrics
 * Accurate order counting
 */
export interface OrderMetrics {
    total: number;           // Total orders (excluding cancelled)
    pending: number;         // Pending orders
    processing: number;      // Processing orders
    fulfilled: number;       // Fulfilled orders
    cancelled: number;       // Cancelled orders (not counted in total)
    refunded: number;        // Refunded orders
}

/**
 * Analytics Time Period
 */
export interface TimePeriod {
    startDate: Date;
    endDate: Date;
    timezone: string;        // IANA timezone (e.g., 'Asia/Kolkata')
}

/**
 * Revenue by Day
 */
export interface DailyRevenue {
    date: string;            // YYYY-MM-DD
    revenue: number;
    orders: number;
    type: RevenueType;
}

/**
 * Top Product
 */
export interface TopProduct {
    productId: string;
    productName: string;
    sales: number;           // Number of units sold
    revenue: number;         // Total revenue
    orders: number;          // Number of orders
}

/**
 * Top Customer
 */
export interface TopCustomer {
    customerId: string;
    customerName: string;
    customerEmail: string;
    totalSpent: number;
    totalOrders: number;
    firstOrderDate: Date;
    lastOrderDate: Date;
}

/**
 * Analytics Dashboard Data
 */
export interface AnalyticsDashboard {
    revenue: RevenueMetrics;
    orders: OrderMetrics;
    avgOrderValue: number;
    conversionRate: number;
    topProducts: TopProduct[];
    topCustomers: TopCustomer[];
    revenueByDay: DailyRevenue[];
}
