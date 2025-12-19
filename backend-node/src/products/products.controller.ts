import { Controller, Get, Param } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductResponseDto, VariantResponseDto } from './dto/product-response.dto';

/**
 * Products Controller
 * Read-only endpoints for Phase 1
 */
@Controller('products')
export class ProductsController {
    constructor(private readonly productsService: ProductsService) { }

    /**
     * GET /products
     * List all ACTIVE products with their ACTIVE variants
     */
    @Get()
    async findAll(): Promise<{ products: ProductResponseDto[] }> {
        const products = await this.productsService.findAll();
        return { products };
    }

    /**
     * GET /products/:slug
     * Get single ACTIVE product by slug
     */
    @Get(':slug')
    async findBySlug(
        @Param('slug') slug: string,
    ): Promise<ProductResponseDto> {
        return this.productsService.findBySlug(slug);
    }

    /**
     * GET /products/:id/variants
     * Get all ACTIVE variants for a product
     */
    @Get(':id/variants')
    async findVariants(
        @Param('id') id: string,
    ): Promise<{ variants: VariantResponseDto[] }> {
        const variants = await this.productsService.findVariantsByProductId(id);
        return { variants };
    }
}
