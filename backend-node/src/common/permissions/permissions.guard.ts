import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from './permissions.decorator';
import { Permission, hasPermission, hasAnyPermission, hasAllPermissions } from './permissions';

/**
 * Permissions Guard
 * Validates that the authenticated user has required permissions
 * 
 * SECURITY: Prevents unauthorized access to protected resources
 */
@Injectable()
export class PermissionsGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        // Get required permissions from decorator
        const requiredPermissions = this.reflector.getAllAndOverride<Permission[] | { any: Permission[] } | { all: Permission[] }>(
            PERMISSIONS_KEY,
            [context.getHandler(), context.getClass()]
        );

        // No permissions required
        if (!requiredPermissions) {
            return true;
        }

        // Get user from request (set by JWT guard)
        const request = context.switchToHttp().getRequest();
        const user = request.user;

        if (!user || !user.role) {
            throw new ForbiddenException('User role not found');
        }

        const userRole = user.role;

        // Handle different permission check types
        if (Array.isArray(requiredPermissions)) {
            // Simple array: require ALL permissions
            const hasAllRequired = requiredPermissions.every(permission =>
                hasPermission(userRole, permission)
            );

            if (!hasAllRequired) {
                throw new ForbiddenException(
                    `Insufficient permissions. Required: ${requiredPermissions.join(', ')}`
                );
            }

            return true;
        }

        // Handle "any" permissions
        if ('any' in requiredPermissions) {
            const hasAny = hasAnyPermission(userRole, requiredPermissions.any);

            if (!hasAny) {
                throw new ForbiddenException(
                    `Insufficient permissions. Required any of: ${requiredPermissions.any.join(', ')}`
                );
            }

            return true;
        }

        // Handle "all" permissions
        if ('all' in requiredPermissions) {
            const hasAll = hasAllPermissions(userRole, requiredPermissions.all);

            if (!hasAll) {
                throw new ForbiddenException(
                    `Insufficient permissions. Required all of: ${requiredPermissions.all.join(', ')}`
                );
            }

            return true;
        }

        return false;
    }
}
