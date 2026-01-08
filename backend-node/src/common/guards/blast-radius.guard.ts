import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AdminAuditService } from '../../auth/admin-audit.service';

/**
 * Blast Radius Guard
 * Prevents mass destruction by detecting bulk destructive operations
 * Fixes: No blast radius control
 */
@Injectable()
export class BlastRadiusGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        private auditService: AdminAuditService,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        const method = request.method;

        // Only check for destructive operations
        if (!user || !['DELETE', 'PATCH', 'PUT'].includes(method)) {
            return true;
        }

        // Get recent actions in last 5 minutes
        const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
        const recentActions = await this.auditService.getAuditLogs({
            userId: user.userId || user.id,
            startDate: fiveMinutesAgo.toISOString(),
            endDate: new Date().toISOString(),
        });

        // Count destructive actions
        const destructiveEvents = [
            'PRODUCT_DELETED',
            'ORDER_CANCELLED',
            'ORDER_REFUNDED',
            'CUSTOMER_DELETED',
            'DISCOUNT_DELETED',
        ];

        const destructiveCount = recentActions.filter(log =>
            destructiveEvents.some(event => log.eventType.includes(event))
        ).length;

        // Threshold: 10 destructive actions in 5 minutes
        if (destructiveCount >= 10) {
            throw new HttpException({
                statusCode: HttpStatus.TOO_MANY_REQUESTS,
                message: 'Too many destructive actions detected. Please contact a super admin to continue.',
                code: 'BLAST_RADIUS_LIMIT',
                details: {
                    actionsInLast5Min: destructiveCount,
                    threshold: 10,
                },
            }, HttpStatus.TOO_MANY_REQUESTS);
        }

        // Threshold: 5 deletions in 1 minute (stricter for DELETE)
        if (method === 'DELETE') {
            const oneMinuteAgo = new Date(Date.now() - 60 * 1000);
            const recentDeletes = recentActions.filter(log =>
                log.eventType.includes('DELETED') &&
                new Date(log.timestamp) > oneMinuteAgo
            ).length;

            if (recentDeletes >= 5) {
                throw new HttpException({
                    statusCode: HttpStatus.TOO_MANY_REQUESTS,
                    message: 'Too many deletions in a short time. Please slow down.',
                    code: 'DELETE_RATE_LIMIT',
                    details: {
                        deletionsInLast1Min: recentDeletes,
                        threshold: 5,
                    },
                }, HttpStatus.TOO_MANY_REQUESTS);
            }
        }

        return true;
    }
}
