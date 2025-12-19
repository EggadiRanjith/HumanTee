import {
    Controller,
    Get,
    Post,
    Patch,
    Body,
    Param,
    UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt.guard';
import { AdminRoleGuard } from '../../auth/guards/admin-role.guard';
import { AdminProductsService } from './admin-products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ChangeStatusDto } from './dto/change-status.dto';

/**
 * AdminProductsController
 * FIX 1: Uses guard composition, not inheritance
 */
@Controller('admin/products')
@UseGuards(JwtAuthGuard, AdminRoleGuard) // FIX 1: Composition
export class AdminProductsController {
    constructor(
        private readonly adminProductsService: AdminProductsService,
    ) { }

    /**
     * POST /admin/products
     * Create new product (always DRAFT)
     */
    @Post()
    async createProduct(@Body() dto: CreateProductDto) {
        return this.adminProductsService.createProduct(dto);
    }

    /**
     * GET /admin/products
     * List all products (admin view - includes DRAFT/ARCHIVED)
     */
    @Get()
    async findAll() {
        const products = await this.adminProductsService.findAll();
        return { products };
    }

    /**
     * GET /admin/products/:id
     * Get single product (admin view)
     */
    @Get(':id')
    async findById(@Param('id') id: string) {
        return this.adminProductsService.findById(id);
    }

    /**
     * PATCH /admin/products/:id
     * Update product (safe fields only, no slug)
     */
    @Patch(':id')
    async updateProduct(
        @Param('id') id: string,
        @Body() dto: UpdateProductDto,
    ) {
        return this.adminProductsService.updateProduct(id, dto);
    }

    /**
     * POST /admin/products/:id/status
     * Change product status (controlled transitions)
     */
    @Post(':id/status')
    async changeStatus(
        @Param('id') id: string,
        @Body() dto: ChangeStatusDto,
    ) {
        return this.adminProductsService.changeStatus(id, dto);
    }
}
