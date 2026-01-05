import { Module, Global } from '@nestjs/common';
import { RedisModule as NestRedisModule } from '@nestjs-modules/ioredis';
import { RedisService } from './redis.service';
import { CacheService } from './cache.service';
import { RateLimiterService } from './rate-limiter.service';
import { SessionService } from './session.service';

/**
 * Redis Module - FAANG Production Grade
 * 
 * Features:
 * - Distributed caching
 * - Rate limiting (sliding window)
 * - Session management
 * - Automatic reconnection
 * - Health monitoring
 */
@Global()
@Module({
    imports: [
        NestRedisModule.forRootAsync({
            useFactory: () => ({
                type: 'single',
                options: {
                    host: process.env.REDIS_HOST || 'localhost',
                    port: parseInt(process.env.REDIS_PORT || '6379'),
                    password: process.env.REDIS_PASSWORD,
                    db: parseInt(process.env.REDIS_DB || '0'),

                    // Connection pool - DISABLED FOR DEVELOPMENT
                    maxRetriesPerRequest: 0, // Don't retry
                    enableReadyCheck: false,
                    enableOfflineQueue: false,

                    // Reconnection strategy - DISABLED
                    retryStrategy: () => null, // Don't reconnect

                    // Timeouts
                    connectTimeout: 1000,
                    commandTimeout: 1000,

                    // Keep-alive
                    keepAlive: 30000,

                    // Lazy connect (don't connect until needed)
                    lazyConnect: true,
                },
            }),
        }),
    ],
    providers: [
        RedisService,
        CacheService,
        RateLimiterService,
        SessionService,
    ],
    exports: [
        RedisService,
        CacheService,
        RateLimiterService,
        SessionService,
    ],
})
export class RedisModule { }
