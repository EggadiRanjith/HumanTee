import { Controller, Get } from '@nestjs/common';
import { RedisService } from '../redis/redis.service';
import { CacheService } from '../redis/cache.service';

/**
 * Redis Health Check Controller
 * 
 * Endpoints for monitoring Redis health and statistics
 */
@Controller('health')
export class RedisHealthController {
    constructor(
        private readonly redis: RedisService,
        private readonly cache: CacheService,
    ) { }

    /**
     * Check Redis connectivity
     */
    @Get('redis')
    async checkRedis() {
        const isHealthy = await this.redis.ping();

        if (!isHealthy) {
            return {
                status: 'unhealthy',
                redis: 'disconnected',
            };
        }

        const stats = await this.cache.getStats();

        return {
            status: 'healthy',
            redis: 'connected',
            stats: {
                keys: stats.keys,
                memory: stats.memory,
            },
        };
    }

    /**
     * Get detailed Redis info
     */
    @Get('redis/info')
    async getRedisInfo() {
        const info = await this.redis.info();
        const stats = await this.cache.getStats();

        return {
            connected: await this.redis.ping(),
            stats,
            info: this.parseRedisInfo(info),
        };
    }

    private parseRedisInfo(info: string): Record<string, string> {
        const lines = info.split('\r\n');
        const parsed: Record<string, string> = {};

        for (const line of lines) {
            if (line && !line.startsWith('#')) {
                const [key, value] = line.split(':');
                if (key && value) {
                    parsed[key] = value;
                }
            }
        }

        return parsed;
    }
}
