import { Injectable, Logger } from '@nestjs/common';
import { RedisService } from './redis.service';

export interface CacheOptions {
    ttl?: number; // seconds
    prefix?: string;
}

/**
 * Cache Service - Business Logic Layer
 * 
 * Implements cache-aside pattern with:
 * - Automatic cache invalidation
 * - Pattern-based invalidation
 * - TTL management
 * - Cache hit/miss logging
 */
@Injectable()
export class CacheService {
    private readonly logger = new Logger(CacheService.name);
    private readonly defaultTTL = 300; // 5 minutes

    constructor(private readonly redis: RedisService) { }

    /**
     * Cache decorator pattern (cache-aside)
     * 
     * Usage:
     * const product = await cache.remember('product:123', () => fetchProduct(123), { ttl: 3600 });
     */
    async remember<T>(
        key: string,
        factory: () => Promise<T>,
        options?: CacheOptions
    ): Promise<T> {
        const cacheKey = this.buildKey(key, options?.prefix);

        // Try cache first
        const cached = await this.redis.get<T>(cacheKey);
        if (cached !== null) {
            this.logger.debug(`✅ Cache HIT: ${cacheKey}`);
            return cached;
        }

        // Cache miss - fetch from source
        this.logger.debug(`❌ Cache MISS: ${cacheKey}`);
        const value = await factory();

        // Store in cache
        await this.redis.set(cacheKey, value, options?.ttl || this.defaultTTL);

        return value;
    }

    /**
     * Invalidate cache by key
     */
    async forget(key: string, prefix?: string): Promise<void> {
        const cacheKey = this.buildKey(key, prefix);
        await this.redis.del(cacheKey);
        this.logger.debug(`🗑️  Cache INVALIDATED: ${cacheKey}`);
    }

    /**
     * Invalidate cache by pattern
     * 
     * Example: forgetByPattern('product:*') invalidates all products
     */
    async forgetByPattern(pattern: string): Promise<void> {
        const keys = await this.redis.scanKeys(pattern);
        if (keys.length > 0) {
            await this.redis.del(...keys);
            this.logger.debug(`🗑️  Cache INVALIDATED: ${keys.length} keys matching ${pattern}`);
        }
    }

    /**
     * Cache-aside pattern for products
     */
    async cacheProduct(productId: string, data: any, ttl = 3600): Promise<void> {
        await this.redis.set(`product:${productId}`, data, ttl);
    }

    async getCachedProduct(productId: string): Promise<any | null> {
        return this.redis.get(`product:${productId}`);
    }

    async invalidateProduct(productId: string): Promise<void> {
        await this.redis.del(`product:${productId}`);
        this.logger.log(`Product ${productId} cache invalidated`);
    }

    /**
     * Cache-aside pattern for user sessions
     */
    async cacheUserSession(userId: string, data: any, ttl = 86400): Promise<void> {
        await this.redis.set(`session:${userId}`, data, ttl);
    }

    async getUserSession(userId: string): Promise<any | null> {
        return this.redis.get(`session:${userId}`);
    }

    async invalidateUserSession(userId: string): Promise<void> {
        await this.redis.del(`session:${userId}`);
        this.logger.log(`User ${userId} session invalidated`);
    }

    /**
     * Cache statistics (for monitoring)
     */
    async getStats(): Promise<{
        keys: number;
        memory: string;
        hitRate?: number;
    }> {
        const info = await this.redis.info();
        const lines = info.split('\r\n');

        const dbKeys = lines.find(l => l.startsWith('db0:keys='));
        const memory = lines.find(l => l.startsWith('used_memory_human:'));

        return {
            keys: dbKeys ? parseInt(dbKeys.split('=')[1]) : 0,
            memory: memory ? memory.split(':')[1] : 'unknown',
        };
    }

    /**
     * Build cache key with prefix
     */
    private buildKey(key: string, prefix?: string): string {
        return prefix ? `${prefix}:${key}` : key;
    }
}
