import { usePermissions } from '@/hooks/usePermissions';
import { Permission } from '@/lib/permissions';

interface PermissionGateProps {
    permission: Permission;
    fallback?: React.ReactNode;
    children: React.ReactNode;
}

/**
 * Permission Gate Component
 * Conditionally renders children based on user permissions
 * 
 * @example
 * <PermissionGate permission={Permission.PRODUCTS_DELETE}>
 *   <button onClick={handleDelete}>Delete</button>
 * </PermissionGate>
 * 
 * @example With fallback
 * <PermissionGate 
 *   permission={Permission.PRODUCTS_EDIT}
 *   fallback={<p>You don't have permission to edit</p>}
 * >
 *   <EditForm />
 * </PermissionGate>
 */
export function PermissionGate({ permission, fallback, children }: PermissionGateProps) {
    const { can } = usePermissions();

    if (!can(permission)) {
        return fallback ? <>{fallback}</> : null;
    }

    return <>{children}</>;
}

interface AnyPermissionGateProps {
    permissions: Permission[];
    fallback?: React.ReactNode;
    children: React.ReactNode;
}

/**
 * Requires ANY of the specified permissions
 */
export function AnyPermissionGate({ permissions, fallback, children }: AnyPermissionGateProps) {
    const { canAny } = usePermissions();

    if (!canAny(permissions)) {
        return fallback ? <>{fallback}</> : null;
    }

    return <>{children}</>;
}

interface AllPermissionsGateProps {
    permissions: Permission[];
    fallback?: React.ReactNode;
    children: React.ReactNode;
}

/**
 * Requires ALL of the specified permissions
 */
export function AllPermissionsGate({ permissions, fallback, children }: AllPermissionsGateProps) {
    const { canAll } = usePermissions();

    if (!canAll(permissions)) {
        return fallback ? <>{fallback}</> : null;
    }

    return <>{children}</>;
}
