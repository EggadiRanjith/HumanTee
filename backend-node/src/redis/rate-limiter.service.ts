import { Injectable } from '@nestjs/common';
import { RedisService } from './redis.service';

export interface RateLimitResult {
    allowed: boolean;
    remaining: number;
    resetAt: Date;
}

/**
 * Rate Limiter Service - FAANG Production Grade
 * 
 * Implements sliding window algorithm using Redis sorted sets
 * More accurate than fixed window, prevents burst attacks
 * 
 * Features:
 * - Atomic operations via Lua scripts
 * - Distributed rate limiting (works across multiple instances)
 * - Automatic cleanup of old entries
 * - Sub-second precision
 */
@Injectable()
export class RateLimiterService {
    constructor(private readonly redis: RedisService) { }

    /**
     * Sliding window rate limiter (FAANG-grade)
     * 
     * Example: checkLimit('user:123', 100, 60) = 100 requests per 60 seconds
     */
    async checkLimit(
        key: string,
        limit: number,
        windowSeconds: number
    ): Promise<RateLimitResult> {
        const now = Date.now();
        const windowStart = now - windowSeconds * 1000;
        const redisKey = `ratelimit:${key}`;

        // Lua script for atomic operations (prevents race conditions)
        const luaScript = `
      local key = KEYS[1]
      local now = tonumber(ARGV[1])
      local window_start = tonumber(ARGV[2])
      local limit = tonumber(ARGV[3])
      local window_seconds = tonumber(ARGV[4])

      -- Remove old entries outside the window
      redis.call('ZREMRANGEBYSCORE', key, 0, window_start)

      -- Count current entries in window
      local current = redis.call('ZCARD', key)

      if current < limit then
        -- Allow request and add to sorted set
        redis.call('ZADD', key, now, now)
        redis.call('EXPIRE', key, window_seconds)
        return {1, limit - current - 1, window_seconds}
      else
        -- Deny request and calculate reset time
        local oldest = redis.call('ZRANGE', key, 0, 0, 'WITHSCORES')
        local reset_at = tonumber(oldest[2]) + (window_seconds * 1000)
        return {0, 0, math.ceil((reset_at - now) / 1000)}
      end
    `;

        const client = this.redis.getClient();
        const result = await client.eval(
            luaScript,
            1,
            redisKey,
            now.toString(),
            windowStart.toString(),
            limit.toString(),
            windowSeconds.toString()
        ) as [number, number, number];

        const [allowed, remaining, resetInSeconds] = result;

        return {
            allowed: allowed === 1,
            remaining,
            resetAt: new Date(now + resetInSeconds * 1000),
        };
    }

    /**
     * Simple token bucket (faster, less accurate)
     * Use for less critical rate limiting
     */
    async checkTokenBucket(
        key: string,
        limit: number,
        windowSeconds: number
    ): Promise<boolean> {
        const redisKey = `bucket:${key}`;
        const count = await this.redis.incrWithExpiry(redisKey, windowSeconds);
        return count <= limit;
    }

    /**
     * Get current usage for a key
     */
    async getCurrentUsage(key: string): Promise<number> {
        const redisKey = `ratelimit:${key}`;
        const client = this.redis.getClient();
        return client.zcard(redisKey);
    }

    /**
     * Reset rate limit for a key
     */
    async reset(key: string): Promise<void> {
        await this.redis.del(`ratelimit:${key}`);
    }
}
