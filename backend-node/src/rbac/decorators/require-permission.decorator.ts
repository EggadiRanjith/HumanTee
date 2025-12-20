import { SetMetadata } from '@nestjs/common';
import { Resource, Action } from '../rbac.types';

/**
 * Decorator to require specific permission
 * Usage: @RequirePermission({ resource: Resource.PRODUCTS, action: Action.DELETE })
 */
export const RequirePermission = (permission: { resource: Resource; action: Action }) =>
    SetMetadata('permission', permission);
