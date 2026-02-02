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
            useFactory: () => {
                const redisUrl = process.env.REDIS_URL;
                const skipConnection = process.env.REDIS_SKIP_CONNECTION === 'true';

                // DEVELOPMENT: Skip Redis connection if explicitly disabled
                if (skipConnection) {
                    console.log('⚠️  Redis: SKIP_CONNECTION enabled - using minimal config (graceful degradation)');
                    return {
                        type: 'single',
                        options: {
                            host: process.env.REDIS_HOST || 'localhost',
                            port: parseInt(process.env.REDIS_PORT || '6379'),
                            connectTimeout: 10,
                            commandTimeout: 10,
                            maxRetriesPerRequest: 0,
                            lazyConnect: true,
                            enableOfflineQueue: false,
                        },
                    };
                }

                // PRODUCTION: Preferred URL connection
                if (redisUrl) {
                    return {
                        type: 'single',
                        url: redisUrl,
                        options: {
                            maxRetriesPerRequest: 3,
                            enableReadyCheck: true,
                            enableOfflineQueue: true,
                            retryStrategy: (times) => Math.min(times * 50, 2000),
                            connectTimeout: 5000,
                            commandTimeout: 3000,
                            keepAlive: 30000,
                            lazyConnect: false,
                        },
                    };
                }

                // FALLBACK: Individual variables
                return {
                    type: 'single',
                    options: {
                        host: process.env.REDIS_HOST || 'localhost',
                        port: parseInt(process.env.REDIS_PORT || '6379'),
                        password: process.env.REDIS_PASSWORD,
                        db: parseInt(process.env.REDIS_DB || '0'),
                        maxRetriesPerRequest: 3,
                        enableReadyCheck: true,
                        enableOfflineQueue: true,
                        retryStrategy: (times) => Math.min(times * 50, 2000),
                        connectTimeout: 5000,
                        commandTimeout: 3000,
                        keepAlive: 30000,
                        lazyConnect: false,
                    },
                };
            },
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
