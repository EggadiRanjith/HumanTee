import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AdminAuditService } from '../../auth/admin-audit.service';

/**
 * Audit Interceptor
 * Automatically logs all admin actions
 * NO MANUAL LOGGING NEEDED!
 */
@Injectable()
export class AuditInterceptor implements NestInterceptor {
    constructor(private readonly auditService: AdminAuditService) { }

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request = context.switchToHttp().getRequest();
        const method = request.method;
        const url = request.url;
        const user = request.user;

        // SECURITY FIX: Log ALL admin actions (including GET for PII access tracking)
        if (!user || !user.isAdmin) {
            return next.handle();
        }

        // Generate correlation ID for request tracking
        const correlationId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        request.correlationId = correlationId;

        // Capture before state (from request body)
        const before = this.extractBeforeState(request);
        const entityInfo = this.extractEntityInfo(url, request);
        const startTime = Date.now();

        return next.handle().pipe(
            tap({
                next: async (response) => {
                    // Log successful operations (including GET requests)
                    if (entityInfo) {
                        // If entity name wasn't in request, try to get it from response
                        if (!entityInfo.name && response?.order?.orderNumber) {
                            entityInfo.name = response.order.orderNumber;
                        } else if (!entityInfo.name && response?.orderNumber) {
                            entityInfo.name = response.orderNumber;
                        }

                        const after = this.extractAfterState(response);
                        const changes = this.auditService.calculateChanges(before, after);

                        await this.auditService.logAction({
                            adminId: user.userId,
                            adminEmail: user.email,
                            eventType: this.determineEventType(method, url),
                            entityType: entityInfo.type,
                            entityId: entityInfo.id,
                            entityName: entityInfo.name,
                            before,
                            after,
                            changes,
                            ipAddress: request.ip || request.connection.remoteAddress,
                            userAgent: request.headers['user-agent'],
                        });
                    }
                },
                error: async (error) => {
                    // SECURITY FIX: Log failed attempts (permission bypass detection)
                    if (entityInfo) {
                        await this.auditService.logAction({
                            adminId: user.userId,
                            adminEmail: user.email,
                            eventType: `${this.determineEventType(method, url)}_FAILED`,
                            entityType: entityInfo.type,
                            entityId: entityInfo.id,
                            entityName: entityInfo.name,
                            before,
                            after: null,
                            changes: {
                                error: error.message,
                                statusCode: error.status || 500,
                            },
                            ipAddress: request.ip || request.connection.remoteAddress,
                            userAgent: request.headers['user-agent'],
                        });
                    }
                },
            }),
        );
    }

    /**
     * Extract entity information from URL and request body
     */
    private extractEntityInfo(url: string, request: any): { type: string; id: string; name?: string } | null {
        // Products: /admin/products/:id
        if (url.includes('/admin/products/')) {
            const id = url.split('/admin/products/')[1]?.split('/')[0];
            // Try to get SKU from variants array, fallback to product name
            const sku = request.body?.variants?.[0]?.sku || request.body?.sku;
            const name = sku || request.body?.name;
            return id ? { type: 'product', id, name } : null;
        }

        // Orders: /admin/orders/:id
        if (url.includes('/admin/orders/')) {
            const id = url.split('/admin/orders/')[1]?.split('/')[0];
            const name = request.body?.orderNumber || id;
            return id ? { type: 'order', id, name } : null;
        }

        // Tickets: /admin/tickets/:id
        if (url.includes('/admin/tickets/')) {
            const id = url.split('/admin/tickets/')[1]?.split('/')[0];
            const name = request.body?.ticketNumber || id;
            return id ? { type: 'ticket', id, name } : null;
        }

        // Discounts: /admin/discounts/:id
        if (url.includes('/admin/discounts/')) {
            const id = url.split('/admin/discounts/')[1]?.split('/')[0];
            const name = request.body?.code || request.body?.name;
            return id ? { type: 'discount', id, name } : null;
        }

        // Settings: /admin/settings/*
        if (url.includes('/admin/settings/')) {
            const settingsPage = url.split('/admin/settings/')[1]?.split('/')[0];
            let name = 'System Settings';

            // Map URL path to human-readable name
            if (settingsPage === 'header-footer') name = 'Header & Footer Settings';
            else if (settingsPage === 'homepage') name = 'Homepage Settings';
            else if (settingsPage === 'product-info') name = 'Product Info Settings';
            else if (settingsPage === 'shipping-taxes') name = 'Shipping & Taxes Settings';
            else if (settingsPage === 'maintenance') name = 'Maintenance Settings';

            return { type: 'settings', id: 'settings_1', name };
        }

        // Customers: /admin/customers/:id
        if (url.includes('/admin/customers/')) {
            const id = url.split('/admin/customers/')[1]?.split('/')[0];
            const name = request.body?.email || request.body?.fullName;
            return id ? { type: 'customer', id, name } : null;
        }

        return null;
    }

    /**
     * Determine event type from method and URL
     */
    private determineEventType(method: string, url: string): string {
        const entity = url.includes('/products/') ? 'PRODUCT'
            : url.includes('/orders/') ? 'ORDER'
                : url.includes('/tickets/') ? 'TICKET'
                    : url.includes('/discounts/') ? 'DISCOUNT'
                        : url.includes('/settings/') ? 'SETTINGS'
                            : url.includes('/customers/') ? 'CUSTOMER'
                                : 'UNKNOWN';

        switch (method) {
            case 'POST':
                // Check for specific actions
                if (url.includes('/reply')) return `${entity}_REPLIED`;
                return `${entity}_CREATED`;
            case 'PUT':
            case 'PATCH':
                // Check for specific actions in URL
                if (url.includes('/status')) return `${entity}_STATUS_CHANGED`;
                if (url.includes('/price')) return `${entity}_PRICE_CHANGED`;
                if (url.includes('/shipment')) return `${entity}_SHIPMENT_UPDATED`;
                return `${entity}_UPDATED`;
            case 'DELETE':
                return `${entity}_DELETED`;
            default:
                return `${entity}_MODIFIED`;
        }
    }

    /**
     * Extract before state from request
     */
    private extractBeforeState(request: any): any {
        // For updates, the current state should be fetched from DB
        // For now, we'll use request body as a placeholder
        return request.body || null;
    }

    /**
     * Extract after state from response
     */
    private extractAfterState(response: any): any {
        // Response usually contains the updated entity
        return response || null;
    }
}
