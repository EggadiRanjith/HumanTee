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
import { AdminJwtGuard } from '../../auth/guards/admin-jwt.guard';
import { PermissionsGuard } from '../../common/permissions/permissions.guard';
import { RequirePermissions } from '../../common/permissions/permissions.decorator';
import { Permission } from '../../common/permissions/permissions';
import { AdminProductsService } from './admin-products.service';
import { CreateProductDto, UpdateProductDto } from './dto/create-product.dto';
import { ProductResponseDto } from './dto/product-response.dto';

@Controller('admin/products')
@UseGuards(AdminJwtGuard, PermissionsGuard)
export class AdminProductsController {
    constructor(private readonly adminProductsService: AdminProductsService) { }

    /**
     * Create new product
     * POST /admin/products
     * PERMISSION: PRODUCTS_CREATE
     */
    @Post()
    @HttpCode(HttpStatus.CREATED)
    @RequirePermissions(Permission.PRODUCTS_CREATE)
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
    @RequirePermissions(Permission.PRODUCTS_VIEW)
    async getAllProducts(): Promise<ProductResponseDto[]> {
        return this.adminProductsService.getAllProducts();
    }

    /**
     * Get all collections
     * GET /admin/products/collections
     * PERMISSION: PRODUCTS_VIEW
     */
    @Get('collections')
    @RequirePermissions(Permission.PRODUCTS_VIEW)
    async getAllCollections(): Promise<any[]> {
        return this.adminProductsService.getAllCollections();
    }

    /**
     * Get single product by ID
     * GET /admin/products/:id
     * PERMISSION: PRODUCTS_VIEW
     */
    @Get(':id')
    @RequirePermissions(Permission.PRODUCTS_VIEW)
    async getProductById(@Param('id') id: string): Promise<ProductResponseDto> {
        return this.adminProductsService.getProductById(id);
    }

    /**
     * Update product
     * PUT /admin/products/:id
     * PERMISSION: PRODUCTS_EDIT
     */
    @Put(':id')
    @RequirePermissions(Permission.PRODUCTS_EDIT)
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
     */
    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @RequirePermissions(Permission.PRODUCTS_DELETE)
    async deleteProduct(@Param('id') id: string): Promise<void> {
        return this.adminProductsService.deleteProduct(id);
    }
}
