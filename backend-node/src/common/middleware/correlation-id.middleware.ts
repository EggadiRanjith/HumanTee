import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'crypto';

/**
 * Correlation ID Middleware
 * Adds unique correlation ID to each request for distributed tracing
 */
@Injectable()
export class CorrelationIdMiddleware implements NestMiddleware {
    private readonly logger = new Logger(CorrelationIdMiddleware.name);

    use(req: Request, res: Response, next: NextFunction) {
        // Generate or use existing correlation ID
        const correlationId = req.headers['x-correlation-id'] as string || randomUUID();

        // Attach to request object for access in controllers/services
        (req as any).correlationId = correlationId;

        // Set response header for client-side tracing
        res.setHeader('x-correlation-id', correlationId);

        // Log request start
        this.logger.log({
            event: 'request_start',
            correlationId,
            method: req.method,
            path: req.path,
            ip: req.ip,
            userAgent: req.headers['user-agent'],
            timestamp: new Date().toISOString(),
        });

        // Measure response time
        const startTime = Date.now();

        // Log response on finish
        res.on('finish', () => {
            const duration = Date.now() - startTime;

            this.logger.log({
                event: 'request_complete',
                correlationId,
                method: req.method,
                path: req.path,
                statusCode: res.statusCode,
                duration: `${duration}ms`,
                timestamp: new Date().toISOString(),
            });
        });

        next();
    }
}
