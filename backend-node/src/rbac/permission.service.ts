import { Injectable } from '@nestjs/common';
import { AdminRole, Resource, Action, PERMISSION_MATRIX } from './rbac.types';

/**
 * Permission Service
 * Core RBAC logic
 */
@Injectable()
export class PermissionService {
    /**
     * Check if a role has permission for a resource/action
     */
    hasPermission(role: AdminRole, resource: Resource, action: Action): boolean {
        const rolePermissions = PERMISSION_MATRIX[role];

        if (!rolePermissions) {
            return false;
        }

        const resourceActions = rolePermissions[resource];

        if (!resourceActions) {
            return false;
        }

        return resourceActions.includes(action);
    }

    /**
     * Get all permissions for a role
     */
    getRolePermissions(role: AdminRole): Record<Resource, Action[]> {
        return PERMISSION_MATRIX[role] || {};
    }

    /**
     * Check if role can perform any action on a resource
     */
    canAccessResource(role: AdminRole, resource: Resource): boolean {
        const rolePermissions = PERMISSION_MATRIX[role];
        const resourceActions = rolePermissions?.[resource];
        return resourceActions && resourceActions.length > 0;
    }

    /**
     * Get all resources a role can access
     */
    getAccessibleResources(role: AdminRole): Resource[] {
        const rolePermissions = PERMISSION_MATRIX[role];
        return Object.entries(rolePermissions)
            .filter(([_, actions]) => actions.length > 0)
            .map(([resource, _]) => resource as Resource);
    }

    /**
     * Validate if a role change is allowed
     * OWNER can change any role
     * MANAGER can only assign SUPPORT/VIEWER
     * Others cannot assign roles
     */
    canAssignRole(assignerRole: AdminRole, targetRole: AdminRole): boolean {
        if (assignerRole === AdminRole.OWNER) {
            return true;
        }

        if (assignerRole === AdminRole.MANAGER) {
            return targetRole === AdminRole.SUPPORT || targetRole === AdminRole.VIEWER;
        }

        return false;
    }
}
