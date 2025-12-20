/**
 * Admin Roles
 * Hierarchical permission system
 */
export enum AdminRole {
    OWNER = 'OWNER',       // Full access to everything
    MANAGER = 'MANAGER',   // Products, orders, customers (no settings/admin)
    SUPPORT = 'SUPPORT',   // Orders, customers (read products)
    VIEWER = 'VIEWER',     // Read-only access
}

/**
 * Resources that can be accessed
 */
export enum Resource {
    PRODUCTS = 'products',
    ORDERS = 'orders',
    CUSTOMERS = 'customers',
    SETTINGS = 'settings',
    ANALYTICS = 'analytics',
    AUDIT_LOGS = 'audit_logs',
    ADMIN = 'admin',
}

/**
 * Actions that can be performed on resources
 */
export enum Action {
    CREATE = 'create',
    READ = 'read',
    UPDATE = 'update',
    DELETE = 'delete',
    PUBLISH = 'publish',
    CANCEL = 'cancel',
    REFUND = 'refund',
}

/**
 * Permission Matrix
 * Defines what each role can do
 */
export const PERMISSION_MATRIX: Record<AdminRole, Record<Resource, Action[]>> = {
    [AdminRole.OWNER]: {
        [Resource.PRODUCTS]: [Action.CREATE, Action.READ, Action.UPDATE, Action.DELETE, Action.PUBLISH],
        [Resource.ORDERS]: [Action.READ, Action.UPDATE, Action.CANCEL, Action.REFUND],
        [Resource.CUSTOMERS]: [Action.READ, Action.UPDATE, Action.DELETE],
        [Resource.SETTINGS]: [Action.READ, Action.UPDATE],
        [Resource.ANALYTICS]: [Action.READ],
        [Resource.AUDIT_LOGS]: [Action.READ],
        [Resource.ADMIN]: [Action.CREATE, Action.READ, Action.UPDATE, Action.DELETE],
    },
    [AdminRole.MANAGER]: {
        [Resource.PRODUCTS]: [Action.CREATE, Action.READ, Action.UPDATE, Action.PUBLISH],
        [Resource.ORDERS]: [Action.READ, Action.UPDATE],
        [Resource.CUSTOMERS]: [Action.READ],
        [Resource.SETTINGS]: [],
        [Resource.ANALYTICS]: [Action.READ],
        [Resource.AUDIT_LOGS]: [],
        [Resource.ADMIN]: [],
    },
    [AdminRole.SUPPORT]: {
        [Resource.PRODUCTS]: [Action.READ],
        [Resource.ORDERS]: [Action.READ, Action.UPDATE],
        [Resource.CUSTOMERS]: [Action.READ],
        [Resource.SETTINGS]: [],
        [Resource.ANALYTICS]: [],
        [Resource.AUDIT_LOGS]: [],
        [Resource.ADMIN]: [],
    },
    [AdminRole.VIEWER]: {
        [Resource.PRODUCTS]: [Action.READ],
        [Resource.ORDERS]: [Action.READ],
        [Resource.CUSTOMERS]: [Action.READ],
        [Resource.SETTINGS]: [],
        [Resource.ANALYTICS]: [Action.READ],
        [Resource.AUDIT_LOGS]: [],
        [Resource.ADMIN]: [],
    },
};
