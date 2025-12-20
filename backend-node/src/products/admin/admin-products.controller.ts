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
} from '@nestjs/common';
import { AdminProductsService } from './admin-products.service';
import { CreateProductDto, UpdateProductDto } from './dto/create-product.dto';
import { ProductResponseDto } from './dto/product-response.dto';

@Controller('admin/products')
// @UseGuards(JwtAuthGuard) // TODO: Add auth guard
export class AdminProductsController {
    constructor(private readonly adminProductsService: AdminProductsService) { }

    /**
     * Create new product
     * POST /admin/products
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
     */
    @Get()
    async getAllProducts(): Promise<ProductResponseDto[]> {
        return this.adminProductsService.getAllProducts();
    }

    /**
     * Get single product by ID
     * GET /admin/products/:id
     */
    @Get(':id')
    async getProductById(@Param('id') id: string): Promise<ProductResponseDto> {
        return this.adminProductsService.getProductById(id);
    }

    /**
     * Update product
     * PUT /admin/products/:id
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
     */
    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async deleteProduct(@Param('id') id: string): Promise<void> {
        return this.adminProductsService.deleteProduct(id);
    }
}
