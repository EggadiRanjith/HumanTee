/**
 * Query Keys - Single source of truth for cache keys
 * User-scoped to prevent cross-user cache bleed
 */
export const queryKeys = {
    // Auth
    user: ['auth', 'me'] as const,

    // User data (scoped by userId)
    addresses: (userId: string) => ['user', userId, 'addresses'] as const,
    orders: (userId: string, page: number) => ['user', userId, 'orders', page] as const,
    orderDetail: (userId: string, orderId: string) => ['user', userId, 'order', orderId] as const,
    tickets: (userId: string, page: number) => ['user', userId, 'tickets', page] as const,
    ticketDetail: (userId: string, ticketId: string) => ['user', userId, 'ticket', ticketId] as const,
} as const;
