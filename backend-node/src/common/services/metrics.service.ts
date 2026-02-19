import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../../entities/order.entity';
import { Payment } from '../../entities/payment.entity';

/**
 * Metrics Service
 * Tracks business and operational metrics for monitoring
 */
@Injectable()
export class MetricsService {
    private readonly logger = new Logger(MetricsService.name);

    // In-memory counters (reset on restart - use Redis for persistence)
    private metrics = {
        orders: {
            total: 0,
            successful: 0,
            failed: 0,
            stockConflicts: 0,
        },
        payments: {
            total: 0,
            successful: 0,
            failed: 0,
        },
        idempotency: {
            cacheHits: 0,
            cacheMisses: 0,
        },
        webhooks: {
            total: 0,
            replays: 0,
        },
        performance: {
            avgResponseTime: 0,
            p95ResponseTime: 0,
            requests: [] as number[], // Store last 1000 response times
        },
    };

    constructor(
        @InjectRepository(Order)
        private orderRepository: Repository<Order>,
        @InjectRepository(Payment)
        private paymentRepository: Repository<Payment>,
    ) { }

    // Order metrics
    incrementOrders(type: 'successful' | 'failed' | 'stockConflict') {
        this.metrics.orders.total++;
        if (type === 'successful') this.metrics.orders.successful++;
        if (type === 'failed') this.metrics.orders.failed++;
        if (type === 'stockConflict') this.metrics.orders.stockConflicts++;
    }

    // Payment metrics
    incrementPayments(type: 'successful' | 'failed') {
        this.metrics.payments.total++;
        if (type === 'successful') this.metrics.payments.successful++;
        if (type === 'failed') this.metrics.payments.failed++;
    }

    // Idempotency metrics
    incrementIdempotency(type: 'hit' | 'miss') {
        if (type === 'hit') this.metrics.idempotency.cacheHits++;
        if (type === 'miss') this.metrics.idempotency.cacheMisses++;
    }

    // Webhook metrics
    incrementWebhooks(type: 'normal' | 'replay') {
        this.metrics.webhooks.total++;
        if (type === 'replay') this.metrics.webhooks.replays++;
    }

    // Performance metrics
    recordResponseTime(duration: number) {
        this.metrics.performance.requests.push(duration);

        // Keep only last 1000 requests
        if (this.metrics.performance.requests.length > 1000) {
            this.metrics.performance.requests.shift();
        }

        // Calculate avg and p95
        const requests = this.metrics.performance.requests;
        this.metrics.performance.avgResponseTime =
            requests.reduce((a, b) => a + b, 0) / requests.length;

        const sorted = [...requests].sort((a, b) => a - b);
        const p95Index = Math.floor(sorted.length * 0.95);
        this.metrics.performance.p95ResponseTime = sorted[p95Index] || 0;
    }

    // Get all metrics
    async getMetrics() {
        // Get database counts
        const [ordersCount, paymentsCount] = await Promise.all([
            this.orderRepository.count(),
            this.paymentRepository.count(),
        ]);

        return {
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            memory: {
                used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
                total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
                unit: 'MB',
            },
            database: {
                orders: ordersCount,
                payments: paymentsCount,
            },
            runtime: {
                orders: this.metrics.orders,
                payments: this.metrics.payments,
                idempotency: {
                    ...this.metrics.idempotency,
                    hitRate: this.calculateHitRate(),
                },
                webhooks: this.metrics.webhooks,
                performance: {
                    avgResponseTime: Math.round(this.metrics.performance.avgResponseTime),
                    p95ResponseTime: Math.round(this.metrics.performance.p95ResponseTime),
                    unit: 'ms',
                },
            },
        };
    }

    private calculateHitRate(): string {
        const total = this.metrics.idempotency.cacheHits + this.metrics.idempotency.cacheMisses;
        if (total === 0) return '0%';
        return `${Math.round((this.metrics.idempotency.cacheHits / total) * 100)}%`;
    }

    // Reset metrics (for testing or new day)
    resetMetrics() {
        this.metrics = {
            orders: { total: 0, successful: 0, failed: 0, stockConflicts: 0 },
            payments: { total: 0, successful: 0, failed: 0 },
            idempotency: { cacheHits: 0, cacheMisses: 0 },
            webhooks: { total: 0, replays: 0 },
            performance: { avgResponseTime: 0, p95ResponseTime: 0, requests: [] },
        };
    }
}
