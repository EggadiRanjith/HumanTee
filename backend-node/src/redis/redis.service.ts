import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';

/**
 * Redis Service - Low-Level Operations
 * 
 * Provides type-safe Redis operations with:
 * - Automatic JSON serialization/deserialization
 * - Error handling
 * - Event monitoring
 * - Health checks
 */
@Injectable()
export class RedisService implements OnModuleDestroy {
    private readonly logger = new Logger(RedisService.name);

    constructor(@InjectRedis() private readonly redis: Redis) {
        this.setupEventHandlers();
    }

    private setupEventHandlers() {
        this.redis.on('connect', () => {
            this.logger.log('✅ Redis connected');
        });

        this.redis.on('ready', () => {
            this.logger.log('✅ Redis ready');
        });

        this.redis.on('error', (err) => {
            this.logger.error(`❌ Redis error: ${err.message}`);
        });

        this.redis.on('close', () => {
            this.logger.warn('⚠️  Redis connection closed');
        });

        this.redis.on('reconnecting', () => {
            this.logger.log('🔄 Redis reconnecting...');
        });
    }

    /**
     * Get value with automatic deserialization
     */
    async get<T>(key: string): Promise<T | null> {
        try {
            const value = await this.redis.get(key);
            if (!value) return null;

            try {
                return JSON.parse(value);
            } catch {
                return value as any;
            }
        } catch (error) {
            this.logger.error(`Failed to get key ${key}:`, error);
            return null;
        }
    }

    /**
     * Set value with automatic serialization
     */
    async set(key: string, value: any, ttlSeconds?: number): Promise<void> {
        try {
            const serialized = typeof value === 'string' ? value : JSON.stringify(value);

            if (ttlSeconds) {
                await this.redis.setex(key, ttlSeconds, serialized);
            } else {
                await this.redis.set(key, serialized);
            }
        } catch (error) {
            this.logger.error(`Failed to set key ${key}:`);
            // Don't throw - allow app to continue without Redis
        }
    }

    /**
     * Delete key(s)
     */
    async del(...keys: string[]): Promise<number> {
        try {
            return await this.redis.del(...keys);
        } catch (error) {
            this.logger.error(`Failed to delete keys:`, error);
            return 0;
        }
    }

    /**
     * Check if key exists
     */
    async exists(key: string): Promise<boolean> {
        try {
            return (await this.redis.exists(key)) === 1;
        } catch (error) {
            this.logger.error(`Failed to check existence of key ${key}:`, error);
            return false;
        }
    }

    /**
     * Increment counter (atomic)
     */
    async incr(key: string): Promise<number> {
        return this.redis.incr(key);
    }

    /**
     * Increment with expiry (atomic)
     */
    async incrWithExpiry(key: string, ttlSeconds: number): Promise<number> {
        const pipeline = this.redis.pipeline();
        pipeline.incr(key);
        pipeline.expire(key, ttlSeconds);
        const results = await pipeline.exec();
        return results?.[0]?.[1] as number;
    }

    /**
     * Get TTL of key
     */
    async ttl(key: string): Promise<number> {
        return this.redis.ttl(key);
    }

    /**
     * Scan keys by pattern (cursor-based, memory-safe)
     * Use this instead of KEYS command in production
     */
    async scanKeys(pattern: string, count = 100): Promise<string[]> {
        const keys: string[] = [];
        let cursor = '0';

        do {
            const [nextCursor, matchedKeys] = await this.redis.scan(
                cursor,
                'MATCH',
                pattern,
                'COUNT',
                count
            );
            cursor = nextCursor;
            keys.push(...matchedKeys);
        } while (cursor !== '0');

        return keys;
    }

    /**
     * Get Redis info
     */
    async info(): Promise<string> {
        return this.redis.info();
    }

    /**
     * Health check
     */
    async ping(): Promise<boolean> {
        try {
            const result = await this.redis.ping();
            return result === 'PONG';
        } catch {
            return false;
        }
    }

    /**
     * Get Redis client (for advanced operations)
     */
    getClient(): Redis {
        return this.redis;
    }

    async onModuleDestroy() {
        await this.redis.quit();
        this.logger.log('Redis connection closed gracefully');
    }
}
