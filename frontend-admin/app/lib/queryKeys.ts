// Centralized query keys for type safety and consistency
export const queryKeys = {
    // Dashboard
    dashboard: {
        all: ['dashboard'] as const,
        stats: () => [...queryKeys.dashboard.all, 'stats'] as const,
        salesChart: (period: string) => [...queryKeys.dashboard.all, 'sales', period] as const,
        topProducts: () => [...queryKeys.dashboard.all, 'top-products'] as const,
        recentOrders: () => [...queryKeys.dashboard.all, 'recent-orders'] as const,
    },

    // Orders
    orders: {
        all: ['orders'] as const,
        lists: () => [...queryKeys.orders.all, 'list'] as const,
        list: (filters: any) => [...queryKeys.orders.lists(), filters] as const,
        details: () => [...queryKeys.orders.all, 'detail'] as const,
        detail: (id: string) => [...queryKeys.orders.details(), id] as const,
    },

    // Products
    products: {
        all: ['products'] as const,
        lists: () => [...queryKeys.products.all, 'list'] as const,
        list: (filters: any) => [...queryKeys.products.lists(), filters] as const,
        details: () => [...queryKeys.products.all, 'detail'] as const,
        detail: (id: string) => [...queryKeys.products.details(), id] as const,
    },

    // Customers
    customers: {
        all: ['customers'] as const,
        lists: () => [...queryKeys.customers.all, 'list'] as const,
        list: (filters: any) => [...queryKeys.customers.lists(), filters] as const,
        details: () => [...queryKeys.customers.all, 'detail'] as const,
        detail: (id: string) => [...queryKeys.customers.details(), id] as const,
    },

    // Settings
    settings: {
        all: ['settings'] as const,
        general: () => [...queryKeys.settings.all, 'general'] as const,
        features: () => [...queryKeys.settings.all, 'features'] as const,
    },

    // Discounts
    discounts: ['discounts'] as const,
    discountDetail: (id: string) => ['discounts', id] as const,

    // Tickets
    tickets: {
        all: ['tickets'] as const,
        lists: () => [...queryKeys.tickets.all, 'list'] as const,
        list: (filters: any) => [...queryKeys.tickets.lists(), filters] as const,
        details: () => [...queryKeys.tickets.all, 'detail'] as const,
        detail: (id: string) => [...queryKeys.tickets.details(), id] as const,
    },
} as const
