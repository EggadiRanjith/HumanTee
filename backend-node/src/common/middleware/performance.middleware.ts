/**
 * Performance Monitoring Middleware
 * Tracks API requests, database queries, and costs
 * 
 * Usage: Add to main.ts before routes
 */

import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

// Storage for request metrics
interface RequestMetrics {
    method: string;
    path: string;
    startTime: number;
    endTime?: number;
    duration?: number;
    statusCode?: number;
    dbQueries?: number;
    dbQueryTime?: number;
    userId?: string;
}

// Global metrics store
const metricsStore: RequestMetrics[] = [];
let currentRequest: RequestMetrics | null = null;

@Injectable()
export class PerformanceMiddleware implements NestMiddleware {
    private readonly logger = new Logger('PerformanceMonitor');

    use(req: Request, res: Response, next: NextFunction) {
        const startTime = Date.now();

        // Create request metrics
        const metrics: RequestMetrics = {
            method: req.method,
            path: req.path,
            startTime,
            dbQueries: 0,
            dbQueryTime: 0,
            userId: (req as any).user?.id || 'guest'
        };

        // Store current request for DB query tracking
        currentRequest = metrics;

        // Capture response
        const originalSend = res.send;
        res.send = function (data) {
            metrics.endTime = Date.now();
            metrics.duration = metrics.endTime - metrics.startTime;
            metrics.statusCode = res.statusCode;

            // Store metrics
            metricsStore.push(metrics);

            // Log if slow or has many queries
            if (metrics.duration > 1000 || metrics.dbQueries! > 5) {
                console.warn(
                    `⚠️ SLOW REQUEST: ${metrics.method} ${metrics.path} - ${metrics.duration}ms, ${metrics.dbQueries} DB queries (${metrics.dbQueryTime}ms)`
                );
            } else {
                console.log(
                    `✅ ${metrics.method} ${metrics.path} - ${metrics.duration}ms, ${metrics.dbQueries} DB queries`
                );
            }

            // Clear current request
            currentRequest = null;

            return originalSend.call(this, data);
        };

        next();
    }
}

// Export function to track DB queries
export function trackDBQuery(queryTime: number) {
    if (currentRequest) {
        currentRequest.dbQueries = (currentRequest.dbQueries || 0) + 1;
        currentRequest.dbQueryTime = (currentRequest.dbQueryTime || 0) + queryTime;
    }
}

// Export function to get metrics
export function getMetrics() {
    return metricsStore;
}

// Export function to get summary
export function getMetricsSummary() {
    const grouped: Record<string, {
        count: number;
        totalTime: number;
        avgTime: number;
        totalQueries: number;
        avgQueries: number;
        maxTime: number;
        minTime: number;
    }> = {};

    metricsStore.forEach(m => {
        const key = `${m.method} ${m.path}`;
        if (!grouped[key]) {
            grouped[key] = {
                count: 0,
                totalTime: 0,
                avgTime: 0,
                totalQueries: 0,
                avgQueries: 0,
                maxTime: 0,
                minTime: Infinity
            };
        }

        const g = grouped[key];
        g.count++;
        g.totalTime += m.duration || 0;
        g.totalQueries += m.dbQueries || 0;
        g.maxTime = Math.max(g.maxTime, m.duration || 0);
        g.minTime = Math.min(g.minTime, m.duration || 0);
    });

    // Calculate averages
    Object.values(grouped).forEach(g => {
        g.avgTime = Math.round(g.totalTime / g.count);
        g.avgQueries = Math.round(g.totalQueries / g.count);
    });

    return grouped;
}

// Export function to clear metrics
export function clearMetrics() {
    metricsStore.length = 0;
}
