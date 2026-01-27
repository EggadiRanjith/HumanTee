/**
 * Query Keys - Single source of truth for cache keys
 * User-scoped to prevent cross-user cache bleed
 */
export const queryKeys = {
    // Public data (not user-scoped)
    settings: ['settings'] as const,

    // Auth
    user: ['auth', 'me'] as const,

    // User data (scoped by userId)
    addresses: (userId: string) => ['user', userId, 'addresses'] as const,
    orders: ['orders'] as const, // Base key for orders, extended with filters in useOrders
    order: (orderId: string) => ['order', orderId] as const, // Single order detail
    orderDetail: (userId: string, orderId: string) => ['user', userId, 'order', orderId] as const,
    tickets: (userId: string, page: number) => ['user', userId, 'tickets', page] as const,
    ticketDetail: (userId: string, ticketId: string) => ['user', userId, 'ticket', ticketId] as const,
    cart: (userId: string) => ['user', userId, 'cart'] as const,
} as const;
