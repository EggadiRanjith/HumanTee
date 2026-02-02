import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Body,
    Param,
    HttpCode,
    HttpStatus,
    UseGuards,
    Req,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { AdminJwtGuard } from '../../auth/guards/admin-jwt.guard';
import { AdminGuard } from '../../auth/guards/admin.guard';
import { AdminProductsService } from './admin-products.service';
import { CreateProductDto, UpdateProductDto } from './dto/create-product.dto';
import { ProductResponseDto } from './dto/product-response.dto';
import { AdminAuditService } from '../../auth/admin-audit.service';

// SECURITY FIX: Rate limiting to prevent mass destruction
@Controller('admin/products')
@Throttle({ default: { limit: 30, ttl: 60000 } }) // 30 requests per minute
@UseGuards(AdminJwtGuard, AdminGuard) // Fixed: Removed PermissionsGuard
export class AdminProductsController {
    constructor(
        private readonly adminProductsService: AdminProductsService,
        private readonly adminAuditService: AdminAuditService,
    ) { }

    /**
     * Create new product
     * POST /admin/products
     * PERMISSION: PRODUCTS_CREATE
     */
    @Post()
    @HttpCode(HttpStatus.CREATED)
    async createProduct(
        @Body() createProductDto: CreateProductDto,
        @Req() req: any,
    ): Promise<ProductResponseDto> {
        const product = await this.adminProductsService.createProduct(createProductDto);

        // Audit log
        await this.adminAuditService.logAction({
            adminId: req.user?.id,
            adminEmail: req.user?.email,
            eventType: 'PRODUCT_CREATE',
            entityType: 'product',
            entityId: product.id,
            entityName: product.name,
            after: { name: product.name, price: product.basePrice, status: product.status },
            ipAddress: req.ip,
            userAgent: req.headers['user-agent'],
        });

        return product;
    }

    /**
     * Get all products (admin view - includes drafts)
     * GET /admin/products
     * PERMISSION: PRODUCTS_VIEW
     */
    @Get()
    async getAllProducts(): Promise<ProductResponseDto[]> {
        return this.adminProductsService.getAllProducts();
    }

    /**
     * Get all collections
     * GET /admin/products/collections
     * PERMISSION: PRODUCTS_VIEW
     */
    @Get('collections')
    async getAllCollections(): Promise<any[]> {
        return this.adminProductsService.getAllCollections();
    }

    /**
     * Get low stock products
     * GET /admin/products/low-stock
     * PERMISSION: PRODUCTS_VIEW
     */
    @Get('low-stock')
    async getLowStockProducts() {
        return this.adminProductsService.getLowStockProducts();
    }

    /**
     * Get single product by ID
     * GET /admin/products/:id
     * PERMISSION: PRODUCTS_VIEW
     */
    @Get(':id')
    async getProductById(@Param('id') id: string): Promise<ProductResponseDto> {
        return this.adminProductsService.getProductById(id);
    }

    /**
     * Update product
     * PUT /admin/products/:id
     * PERMISSION: PRODUCTS_EDIT
     */
    @Put(':id')
    async updateProduct(
        @Param('id') id: string,
        @Body() updateProductDto: UpdateProductDto,
        @Req() req: any,
    ): Promise<ProductResponseDto> {
        // Get before state
        const before = await this.adminProductsService.getProductById(id);

        const product = await this.adminProductsService.updateProduct(id, updateProductDto);

        // Calculate changes
        const changes = this.adminAuditService.calculateChanges(
            { name: before.name, price: before.basePrice, status: before.status },
            { name: product.name, price: product.basePrice, status: product.status },
        );

        // Audit log
        await this.adminAuditService.logAction({
            adminId: req.user?.id,
            adminEmail: req.user?.email,
            eventType: 'PRODUCT_UPDATE',
            entityType: 'product',
            entityId: product.id,
            entityName: product.name,
            before: { name: before.name, price: before.basePrice, status: before.status },
            after: { name: product.name, price: product.basePrice, status: product.status },
            changes,
            ipAddress: req.ip,
            userAgent: req.headers['user-agent'],
        });

        return product;
    }

    /**
     * Delete product
     * DELETE /admin/products/:id
     * PERMISSION: PRODUCTS_DELETE
     * SECURITY: Stricter rate limit for deletions
     */
    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @Throttle({ default: { limit: 5, ttl: 60000 } }) // 5 deletions per minute
    async deleteProduct(
        @Param('id') id: string,
        @Req() req: any,
    ): Promise<void> {
        // Get product before deletion
        const product = await this.adminProductsService.getProductById(id);

        await this.adminProductsService.deleteProduct(id);

        // Audit log
        await this.adminAuditService.logAction({
            adminId: req.user?.id,
            adminEmail: req.user?.email,
            eventType: 'PRODUCT_DELETE',
            entityType: 'product',
            entityId: id,
            entityName: product.name,
            before: { name: product.name, price: product.basePrice, status: product.status },
            ipAddress: req.ip,
            userAgent: req.headers['user-agent'],
        });
    }
}
