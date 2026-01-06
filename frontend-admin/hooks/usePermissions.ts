import { useAuth } from '@/app/context/AuthContext';
import { Permission, Role, hasPermission, hasAnyPermission, hasAllPermissions } from '@/lib/permissions';

/**
 * Permissions Hook
 * Provides permission checking utilities
 * 
 * @example
 * const { can, canAny, canAll } = usePermissions();
 * 
 * if (can(Permission.PRODUCTS_DELETE)) {
 *   // Show delete button
 * }
 */
export function usePermissions() {
    const { user } = useAuth();

    const userRole = user?.role as Role | undefined;

    /**
     * Check if user has a specific permission
     */
    const can = (permission: Permission): boolean => {
        if (!userRole) return false;
        return hasPermission(userRole, permission);
    };

    /**
     * Check if user has ANY of the specified permissions
     */
    const canAny = (permissions: Permission[]): boolean => {
        if (!userRole) return false;
        return hasAnyPermission(userRole, permissions);
    };

    /**
     * Check if user has ALL of the specified permissions
     */
    const canAll = (permissions: Permission[]): boolean => {
        if (!userRole) return false;
        return hasAllPermissions(userRole, permissions);
    };

    /**
     * Check if user cannot perform an action
     */
    const cannot = (permission: Permission): boolean => {
        return !can(permission);
    };

    return {
        can,
        canAny,
        canAll,
        cannot,
        role: userRole,
    };
}
