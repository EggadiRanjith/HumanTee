import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Detailed Logger Middleware
 * Logs every API request with full context including:
 * - Request details (method, path, query, body)
 * - Response details (status, duration, size)
 * - Database queries (count, timing, SQL)
 * - Cost estimation
 */
@Injectable()
export class DetailedLoggerMiddleware implements NestMiddleware {
    private readonly logger = new Logger('DetailedLogger');
    private logFile: string;
    private logsDir: string;

    constructor() {
        // Create logs directory
        this.logsDir = path.join(process.cwd(), 'logs');
        this.logFile = path.join(this.logsDir, 'api-requests.log');

        if (!fs.existsSync(this.logsDir)) {
            fs.mkdirSync(this.logsDir, { recursive: true });
            this.logger.log(`📁 Created logs directory: ${this.logsDir}`);
        }
    }

    use(req: Request, res: Response, next: NextFunction) {
        const startTime = Date.now();
        const requestId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

        // Store request context for DB query tracking
        (req as any).requestId = requestId;
        (req as any).dbQueries = [];
        (req as any).dbQueryCount = 0;
        (req as any).dbQueryTime = 0;
        (req as any).startTime = startTime;

        // Store in global context for DB interceptor
        (global as any).currentRequest = req;

        // Create log entry
        const logEntry: any = {
            requestId,
            timestamp: new Date().toISOString(),
            method: req.method,
            path: req.path,
            query: req.query,
            body: this.sanitizeBody(req.body),
            headers: {
                userAgent: req.headers['user-agent'],
                referer: req.headers['referer'],
                origin: req.headers['origin']
            },
            userId: (req as any).user?.id || 'guest',
            ip: req.ip || req.connection.remoteAddress
        };

        // Intercept response
        const originalSend = res.send;
        const self = this;

        res.send = function (data: any) {
            const endTime = Date.now();
            const duration = endTime - startTime;

            // Complete log entry
            const completeLog = {
                ...logEntry,
                duration: `${duration}ms`,
                durationMs: duration,
                statusCode: res.statusCode,
                dbQueries: (req as any).dbQueryCount,
                dbQueryTime: `${(req as any).dbQueryTime}ms`,
                dbQueryTimeMs: (req as any).dbQueryTime,
                dbQueriesDetail: (req as any).dbQueries.slice(0, 10), // First 10 queries only
                responseSize: data ? Buffer.byteLength(typeof data === 'string' ? data : JSON.stringify(data)) : 0,
                // Cost estimation (adjust based on your infrastructure)
                cost: {
                    compute: ((duration / 1000) * 0.001).toFixed(8), // $0.001 per GB-second
                    database: ((req as any).dbQueryCount * 0.0000001).toFixed(8), // $0.0000001 per query
                    request: (0.0000002).toFixed(8), // $0.0000002 per request
                    total: (((duration / 1000) * 0.001) + ((req as any).dbQueryCount * 0.0000001) + 0.0000002).toFixed(8)
                }
            };

            // Write to log file (async, non-blocking)
            fs.appendFile(
                self.logFile,
                JSON.stringify(completeLog) + '\n',
                (err) => {
                    if (err) {
                        self.logger.error(`Failed to write log: ${err.message}`);
                    }
                }
            );

            // Console log with color coding
            const color = duration < 500 ? '\x1b[32m' : duration < 1000 ? '\x1b[33m' : '\x1b[31m';
            const reset = '\x1b[0m';
            const icon = duration < 500 ? '✅' : duration < 1000 ? '⚠️' : '🔴';

            console.log(
                `${color}${icon} [${requestId.substr(-6)}] ${req.method} ${req.path} - ${duration}ms, ${(req as any).dbQueryCount} queries, $${completeLog.cost.total}${reset}`
            );

            // Warn on slow requests or too many queries
            if (duration > 1000 || (req as any).dbQueryCount > 5) {
                console.warn(`\n⚠️  SLOW REQUEST DETECTED:`);
                console.warn(`   Request ID: ${requestId}`);
                console.warn(`   Path: ${req.method} ${req.path}`);
                console.warn(`   Duration: ${duration}ms`);
                console.warn(`   DB Queries: ${(req as any).dbQueryCount} (${(req as any).dbQueryTime}ms)`);
                console.warn(`   Cost: $${completeLog.cost.total}`);

                if ((req as any).dbQueries.length > 0) {
                    console.warn(`   Top queries:`);
                    (req as any).dbQueries.slice(0, 3).forEach((q: any, i: number) => {
                        console.warn(`     ${i + 1}. ${q.duration} - ${q.query.substring(0, 80)}...`);
                    });
                }
                console.warn('');
            }

            // Clear global context
            (global as any).currentRequest = null;

            return originalSend.call(this, data);
        };

        next();
    }

    private sanitizeBody(body: any): any {
        if (!body) return {};
        const sanitized = { ...body };

        // Remove sensitive fields
        const sensitiveFields = ['password', 'token', 'refreshToken', 'accessToken', 'secret'];
        sensitiveFields.forEach(field => {
            if (sanitized[field]) {
                sanitized[field] = '[REDACTED]';
            }
        });

        return sanitized;
    }
}
