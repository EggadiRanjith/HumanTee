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
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { AdminJwtGuard } from '../../auth/guards/admin-jwt.guard';
import { AdminGuard } from '../../auth/guards/admin.guard';
import { AdminProductsService } from './admin-products.service';
import { CreateProductDto, UpdateProductDto } from './dto/create-product.dto';
import { ProductResponseDto } from './dto/product-response.dto';

// SECURITY FIX: Rate limiting to prevent mass destruction
@Controller('admin/products')
@Throttle({ default: { limit: 30, ttl: 60000 } }) // 30 requests per minute
@UseGuards(AdminJwtGuard, AdminGuard) // Fixed: Removed PermissionsGuard
export class AdminProductsController {
    constructor(private readonly adminProductsService: AdminProductsService) { }

    /**
     * Create new product
     * POST /admin/products
     * PERMISSION: PRODUCTS_CREATE
     */
    @Post()
    @HttpCode(HttpStatus.CREATED)
    async createProduct(
        @Body() createProductDto: CreateProductDto,
    ): Promise<ProductResponseDto> {
        return this.adminProductsService.createProduct(createProductDto);
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
    ): Promise<ProductResponseDto> {
        return this.adminProductsService.updateProduct(id, updateProductDto);
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
    async deleteProduct(@Param('id') id: string): Promise<void> {
        return this.adminProductsService.deleteProduct(id);
    }
}
