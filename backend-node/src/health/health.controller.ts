import { Controller, Get, Logger } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';

@Controller('health')
export class HealthController {
    private readonly logger = new Logger(HealthController.name);

    constructor(
        @InjectDataSource() private dataSource: DataSource,
        @InjectRedis() private readonly redis: Redis,
    ) { }

    @Get()
    async check() {
        const timestamp = new Date().toISOString();

        // Check database
        let databaseStatus = 'down';
        let databaseLatency = 0;
        try {
            const start = Date.now();
            await this.dataSource.query('SELECT 1');
            databaseLatency = Date.now() - start;
            databaseStatus = 'up';
        } catch (error) {
        }

        // Check Redis
        let redisStatus = 'down';
        let redisLatency = 0;
        try {
            const start = Date.now();
            await this.redis.ping();
            redisLatency = Date.now() - start;
            redisStatus = 'up';
        } catch (error) {
        }

        const overallStatus = databaseStatus === 'up' && redisStatus === 'up' ? 'healthy' : 'degraded';

        return {
            status: overallStatus,
            timestamp,
            services: {
                database: {
                    status: databaseStatus,
                    latency: `${databaseLatency}ms`,
                },
                redis: {
                    status: redisStatus,
                    latency: `${redisLatency}ms`,
                },
            },
            uptime: process.uptime(),
            memory: {
                used: `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`,
                total: `${Math.round(process.memoryUsage().heapTotal / 1024 / 1024)}MB`,
            },
        };
    }
}
