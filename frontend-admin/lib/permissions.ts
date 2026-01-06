/**
 * Frontend Permission Definitions
 * Must match backend permissions exactly
 */

export enum Permission {
    // Products
    PRODUCTS_VIEW = 'products:view',
    PRODUCTS_CREATE = 'products:create',
    PRODUCTS_EDIT = 'products:edit',
    PRODUCTS_DELETE = 'products:delete',
    PRODUCTS_PUBLISH = 'products:publish',

    // Orders
    ORDERS_VIEW = 'orders:view',
    ORDERS_EDIT = 'orders:edit',
    ORDERS_CANCEL = 'orders:cancel',
    ORDERS_REFUND = 'orders:refund',

    // Customers
    CUSTOMERS_VIEW = 'customers:view',
    CUSTOMERS_EDIT = 'customers:edit',
    CUSTOMERS_DELETE = 'customers:delete',

    // Discounts
    DISCOUNTS_VIEW = 'discounts:view',
    DISCOUNTS_CREATE = 'discounts:create',
    DISCOUNTS_EDIT = 'discounts:edit',
    DISCOUNTS_DELETE = 'discounts:delete',

    // Analytics
    ANALYTICS_VIEW = 'analytics:view',
    ANALYTICS_EXPORT = 'analytics:export',

    // Settings
    SETTINGS_VIEW = 'settings:view',
    SETTINGS_EDIT = 'settings:edit',

    // Users & Roles
    USERS_VIEW = 'users:view',
    USERS_CREATE = 'users:create',
    USERS_EDIT = 'users:edit',
    USERS_DELETE = 'users:delete',
    ROLES_MANAGE = 'roles:manage',
}

export enum Role {
    SUPER_ADMIN = 'super_admin',
    ADMIN = 'admin',
    MANAGER = 'manager',
    EDITOR = 'editor',
    VIEWER = 'viewer',
}

/**
 * Role-Permission Mapping
 * MUST match backend exactly
 */
export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
    [Role.SUPER_ADMIN]: Object.values(Permission),

    [Role.ADMIN]: [
        Permission.PRODUCTS_VIEW,
        Permission.PRODUCTS_CREATE,
        Permission.PRODUCTS_EDIT,
        Permission.PRODUCTS_DELETE,
        Permission.PRODUCTS_PUBLISH,
        Permission.ORDERS_VIEW,
        Permission.ORDERS_EDIT,
        Permission.ORDERS_CANCEL,
        Permission.ORDERS_REFUND,
        Permission.CUSTOMERS_VIEW,
        Permission.CUSTOMERS_EDIT,
        Permission.DISCOUNTS_VIEW,
        Permission.DISCOUNTS_CREATE,
        Permission.DISCOUNTS_EDIT,
        Permission.DISCOUNTS_DELETE,
        Permission.ANALYTICS_VIEW,
        Permission.ANALYTICS_EXPORT,
        Permission.SETTINGS_VIEW,
        Permission.SETTINGS_EDIT,
    ],

    [Role.MANAGER]: [
        Permission.PRODUCTS_VIEW,
        Permission.PRODUCTS_CREATE,
        Permission.PRODUCTS_EDIT,
        Permission.PRODUCTS_PUBLISH,
        Permission.ORDERS_VIEW,
        Permission.ORDERS_EDIT,
        Permission.ORDERS_CANCEL,
        Permission.CUSTOMERS_VIEW,
        Permission.CUSTOMERS_EDIT,
        Permission.DISCOUNTS_VIEW,
        Permission.ANALYTICS_VIEW,
        Permission.SETTINGS_VIEW,
    ],

    [Role.EDITOR]: [
        Permission.PRODUCTS_VIEW,
        Permission.PRODUCTS_CREATE,
        Permission.PRODUCTS_EDIT,
        Permission.ORDERS_VIEW,
        Permission.CUSTOMERS_VIEW,
        Permission.DISCOUNTS_VIEW,
        Permission.ANALYTICS_VIEW,
    ],

    [Role.VIEWER]: [
        Permission.PRODUCTS_VIEW,
        Permission.ORDERS_VIEW,
        Permission.CUSTOMERS_VIEW,
        Permission.DISCOUNTS_VIEW,
        Permission.ANALYTICS_VIEW,
    ],
};

/**
 * Check if a role has a specific permission
 */
export function hasPermission(role: Role, permission: Permission): boolean {
    const permissions = ROLE_PERMISSIONS[role];
    return permissions ? permissions.includes(permission) : false;
}

/**
 * Check if a role has any of the specified permissions
 */
export function hasAnyPermission(role: Role, permissions: Permission[]): boolean {
    return permissions.some(permission => hasPermission(role, permission));
}

/**
 * Check if a role has all of the specified permissions
 */
export function hasAllPermissions(role: Role, permissions: Permission[]): boolean {
    return permissions.every(permission => hasPermission(role, permission));
}

/**
 * Get all permissions for a role
 */
export function getRolePermissions(role: Role): Permission[] {
    return ROLE_PERMISSIONS[role] || [];
}
