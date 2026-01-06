import { SetMetadata } from '@nestjs/common';
import { Permission } from './permissions';

/**
 * Permissions Decorator
 * Use on controller methods to require specific permissions
 * 
 * @example
 * @RequirePermissions(Permission.PRODUCTS_DELETE)
 * @Delete(':id')
 * async deleteProduct(@Param('id') id: string) {
 *   // Only users with PRODUCTS_DELETE permission can access this
 * }
 */
export const PERMISSIONS_KEY = 'permissions';
export const RequirePermissions = (...permissions: Permission[]) =>
    SetMetadata(PERMISSIONS_KEY, permissions);

/**
 * Require ANY of the specified permissions
 */
export const RequireAnyPermission = (...permissions: Permission[]) =>
    SetMetadata(PERMISSIONS_KEY, { any: permissions });

/**
 * Require ALL of the specified permissions
 */
export const RequireAllPermissions = (...permissions: Permission[]) =>
    SetMetadata(PERMISSIONS_KEY, { all: permissions });
