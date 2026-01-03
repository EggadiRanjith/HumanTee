import { Controller, Get, Logger } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

/**
 * Health Check Controller
 * FAANG-Level: Liveness and Readiness probes for Kubernetes/Load Balancers
 */
@Controller('health')
export class HealthController {
    private readonly logger = new Logger(HealthController.name);

    constructor(
        @InjectDataSource()
        private dataSource: DataSource,
    ) { }

    /**
     * Liveness probe
     * Returns 200 if the application is running
     * Used by orchestrators to restart unhealthy pods
     */
    @Get('live')
    liveness() {
        return {
            status: 'ok',
            timestamp: new Date().toISOString(),
        };
    }

    /**
     * Readiness probe
     * Returns 200 only if all dependencies are healthy
     * Used by load balancers to route traffic
     */
    @Get('ready')
    async readiness() {
        const checks = {
            database: await this.checkDatabase(),
            timestamp: new Date().toISOString(),
        };

        const isReady = Object.values(checks).every(
            (check) => typeof check === 'boolean' ? check : true
        );

        if (!isReady) {
            return {
                status: 'not_ready',
                checks,
            };
        }

        return {
            status: 'ready',
            checks,
        };
    }

    /**
     * Database health check
     */
    private async checkDatabase(): Promise<boolean> {
        try {
            await this.dataSource.query('SELECT 1');
            return true;
        } catch (error) {
            this.logger.error('Database health check failed:', error);
            return false;
        }
    }

    /**
     * Detailed health status (for monitoring)
     */
    @Get('status')
    async status() {
        const dbHealth = await this.checkDatabase();

        return {
            status: dbHealth ? 'healthy' : 'degraded',
            version: process.env.npm_package_version || '1.0.0',
            uptime: process.uptime(),
            timestamp: new Date().toISOString(),
            checks: {
                database: dbHealth,
            },
            environment: process.env.NODE_ENV || 'development',
        };
    }
}
