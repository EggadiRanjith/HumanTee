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
                // DEVELOPMENT: Skip Redis connection if explicitly disabled
                // This prevents 14-second timeouts (5s connect + 3s command × 3 retries)
                const skipConnection = process.env.REDIS_SKIP_CONNECTION === 'true';

                if (skipConnection) {
                    console.log('⚠️  Redis: SKIP_CONNECTION enabled - using minimal config (graceful degradation)');
                    return {
                        type: 'single',
                        options: {
                            host: process.env.REDIS_HOST || 'localhost',
                            port: parseInt(process.env.REDIS_PORT || '6379'),

                            // Minimal timeouts for immediate failure
                            connectTimeout: 10, // 10ms - fail immediately
                            commandTimeout: 10, // 10ms - fail immediately  
                            maxRetriesPerRequest: 0, // No retries
                            lazyConnect: true, // Don't connect on startup
                            enableOfflineQueue: false, // Don't queue commands
                        },
                    };
                }

                // PRODUCTION: Full Redis configuration
                return {
                    type: 'single',
                    options: {
                        host: process.env.REDIS_HOST || 'localhost',
                        port: parseInt(process.env.REDIS_PORT || '6379'),
                        password: process.env.REDIS_PASSWORD,
                        db: parseInt(process.env.REDIS_DB || '0'),

                        // Connection pool - PRODUCTION OPTIMIZED
                        maxRetriesPerRequest: 3, // Retry failed commands
                        enableReadyCheck: true, // Wait for ready state
                        enableOfflineQueue: true, // Queue commands when offline

                        // Reconnection strategy - PRODUCTION
                        retryStrategy: (times) => {
                            const delay = Math.min(times * 50, 2000); // Max 2s delay
                            return delay;
                        },

                        // Timeouts
                        connectTimeout: 5000, // 5s for initial connection
                        commandTimeout: 3000, // 3s for commands

                        // Keep-alive
                        keepAlive: 30000,

                        // Connect immediately (not lazy)
                        lazyConnect: false, // Connect on startup
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
