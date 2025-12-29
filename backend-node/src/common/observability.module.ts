import { Module } from '@nestjs/common';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import { HealthController } from './health.controller';

/**
 * Observability Module
 * FAANG-Level: Metrics, Health Checks, and Monitoring
 */
@Module({
    imports: [
        // Prometheus metrics
        PrometheusModule.register({
            path: '/metrics',
            defaultMetrics: {
                enabled: true,
                config: {
                    prefix: 'humantee_',
                },
            },
        }),
    ],
    controllers: [HealthController],
    exports: [PrometheusModule],
})
export class ObservabilityModule { }
