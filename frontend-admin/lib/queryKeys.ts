/**
 * Query Keys - Single source of truth for cache keys
 * Admin-scoped for proper cache management
 */

export const queryKeys = {
    // Dashboard
    dashboardStats: ['admin', 'dashboard', 'stats'] as const,
    dashboardOrders: ['admin', 'dashboard', 'orders'] as const,

    // Orders
    orders: (filters?: { status?: string; search?: string; page?: number }) =>
        ['admin', 'orders', filters] as const,
    orderDetail: (orderId: string) => ['admin', 'order', orderId] as const,

    // Products
    products: (filters?: { category?: string; status?: string; search?: string }) =>
        ['admin', 'products', filters] as const,
    productDetail: (productId: string) => ['admin', 'product', productId] as const,

    // Discounts
    discounts: ['admin', 'discounts'] as const,
    discountDetail: (discountId: string) => ['admin', 'discount', discountId] as const,

    // Customers
    customers: (filters?: { search?: string; page?: number }) =>
        ['admin', 'customers', filters] as const,
    customerDetail: (customerId: string) => ['admin', 'customer', customerId] as const,

    // Settings
    settings: (section: string) => ['admin', 'settings', section] as const,

    // Tickets
    tickets: (filters?: { status?: string; priority?: string; page?: number }) =>
        ['admin', 'tickets', filters] as const,
    ticketDetail: (ticketId: string) => ['admin', 'ticket', ticketId] as const,

    // Team
    team: ['admin', 'team'] as const,

    // Analytics
    analytics: (dateRange: string) => ['admin', 'analytics', dateRange] as const,
    auditLogs: (filters: any) => ['admin', 'audit-logs', filters] as const,
} as const;
