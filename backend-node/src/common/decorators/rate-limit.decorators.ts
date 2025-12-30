import { Throttle } from '@nestjs/throttler';

/**
 * Rate Limiting Decorators
 * Apply to controllers for endpoint-specific limits
 */

export const WebhookRateLimit = () => Throttle({ webhook: { limit: 20, ttl: 60000 } });
export const OrderRateLimit = () => Throttle({ order: { limit: 5, ttl: 60000 } });
export const AdminRateLimit = () => Throttle({ admin: { limit: 30, ttl: 60000 } });
export const StrictRateLimit = () => Throttle({ strict: { limit: 10, ttl: 60000 } });
