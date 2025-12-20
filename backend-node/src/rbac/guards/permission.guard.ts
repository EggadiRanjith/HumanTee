import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PermissionService } from '../permission.service';
import { Resource, Action } from '../rbac.types';

/**
 * Permission Guard
 * Enforces RBAC on all protected routes
 * CRITICAL: This is the security layer
 */
@Injectable()
export class PermissionGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        private permissionService: PermissionService,
    ) { }

    canActivate(context: ExecutionContext): boolean {
        // Get required permission from decorator
        const requiredPermission = this.reflector.get<{ resource: Resource; action: Action }>(
            'permission',
            context.getHandler(),
        );

        // If no permission required, allow access
        if (!requiredPermission) {
            return true;
        }

        const request = context.switchToHttp().getRequest();
        const user = request.user;

        // User must be authenticated
        if (!user) {
            throw new ForbiddenException('Authentication required');
        }

        // User must be admin
        if (!user.is_admin) {
            throw new ForbiddenException('Admin access required');
        }

        // User must have admin_role
        if (!user.admin_role) {
            throw new ForbiddenException('Admin role not assigned');
        }

        // Check permission
        const hasPermission = this.permissionService.hasPermission(
            user.admin_role,
            requiredPermission.resource,
            requiredPermission.action,
        );

        if (!hasPermission) {
            throw new ForbiddenException(
                `Insufficient permissions: ${requiredPermission.action} on ${requiredPermission.resource}`,
            );
        }

        return true;
    }
}
