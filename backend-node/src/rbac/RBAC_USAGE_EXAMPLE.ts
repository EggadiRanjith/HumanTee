/**
 * EXAMPLE: How to use RBAC in controllers
 * 
 * This shows how to protect endpoints with granular permissions
 */

import { Controller, Get, Post, Patch, Delete, UseGuards, Param, Body } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { PermissionGuard } from '../rbac/guards/permission.guard';
import { RequirePermission } from '../rbac/decorators/require-permission.decorator';
import { Resource, Action } from '../rbac/rbac.types';

@Controller('admin/products')
@UseGuards(JwtAuthGuard, PermissionGuard) // Apply to all routes
export class AdminProductsController {

    /**
     * List products - VIEWER can access
     */
    @Get()
    @RequirePermission({ resource: Resource.PRODUCTS, action: Action.READ })
    async findAll() {
        // All roles with READ permission can access
        return { products: [] };
    }

    /**
     * Create product - Only OWNER and MANAGER
     */
    @Post()
    @RequirePermission({ resource: Resource.PRODUCTS, action: Action.CREATE })
    async create(@Body() dto: any) {
        // Only OWNER and MANAGER can create
        return { product: {} };
    }

    /**
     * Update product - Only OWNER and MANAGER
     */
    @Patch(':id')
    @RequirePermission({ resource: Resource.PRODUCTS, action: Action.UPDATE })
    async update(@Param('id') id: string, @Body() dto: any) {
        // Only OWNER and MANAGER can update
        return { product: {} };
    }

    /**
     * Delete product - Only OWNER
     */
    @Delete(':id')
    @RequirePermission({ resource: Resource.PRODUCTS, action: Action.DELETE })
    async delete(@Param('id') id: string) {
        // Only OWNER can delete
        return { success: true };
    }

    /**
     * Publish product - Only OWNER and MANAGER
     */
    @Post(':id/publish')
    @RequirePermission({ resource: Resource.PRODUCTS, action: Action.PUBLISH })
    async publish(@Param('id') id: string) {
        // Only OWNER and MANAGER can publish
        return { product: {} };
    }
}

/**
 * Permission Matrix Reference:
 * 
 * OWNER:
 * - products: CREATE, READ, UPDATE, DELETE, PUBLISH ✅
 * - orders: READ, UPDATE, CANCEL, REFUND ✅
 * - customers: READ, UPDATE, DELETE ✅
 * - settings: READ, UPDATE ✅
 * - analytics: READ ✅
 * - audit_logs: READ ✅
 * - admin: CREATE, READ, UPDATE, DELETE ✅
 * 
 * MANAGER:
 * - products: CREATE, READ, UPDATE, PUBLISH ✅
 * - orders: READ, UPDATE ✅
 * - customers: READ ✅
 * - analytics: READ ✅
 * - settings: ❌
 * - audit_logs: ❌
 * - admin: ❌
 * 
 * SUPPORT:
 * - products: READ ✅
 * - orders: READ, UPDATE ✅
 * - customers: READ ✅
 * - settings: ❌
 * - analytics: ❌
 * - audit_logs: ❌
 * - admin: ❌
 * 
 * VIEWER:
 * - products: READ ✅
 * - orders: READ ✅
 * - customers: READ ✅
 * - analytics: READ ✅
 * - settings: ❌
 * - audit_logs: ❌
 * - admin: ❌
 */
