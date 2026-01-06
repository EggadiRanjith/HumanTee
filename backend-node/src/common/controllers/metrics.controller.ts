import { Controller, Get } from '@nestjs/common';
import { MetricsService } from '../services/metrics.service';

/**
 * Metrics Controller
 * Provides operational metrics endpoint for monitoring
 * Only accessible to admins
 */
/**
 * Metrics endpoint - publicly accessible for monitoring
 * In production, protect with API key or IP whitelist
 */
@Controller('metrics')
export class MetricsController {
    constructor(private readonly metricsService: MetricsService) { }

    /**
     * GET /metrics
     * Returns current system metrics
     */
    @Get()
    async getMetrics() {
        return this.metricsService.getMetrics();
    }
}
