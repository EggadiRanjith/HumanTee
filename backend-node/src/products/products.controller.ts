import { Controller, Get, Param, Query } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { ProductsService } from './products.service';
import { ProductResponseDto, VariantResponseDto } from './dto/product-response.dto';
import { ShopQueryDto } from './dto/shop-query.dto';

/**
 * Products Controller
 * Read-only endpoints for Phase 1
 */
@Controller('products')
@Throttle({ default: { limit: 60, ttl: 60000 } }) // 60 requests per minute
export class ProductsController {
    constructor(private readonly productsService: ProductsService) { }

    /**
     * GET /products
     * List all ACTIVE and FEATURED products with their ACTIVE variants
     */
    @Get()
    async findAll(): Promise<{ products: ProductResponseDto[] }> {
        const products = await this.productsService.findAll();
        return { products };
    }

    /**
     * GET /products/shop
     * List all ACTIVE products with optional filters
     * Query params: productType, category, collection
     */
    @Get('shop')
    async findForShop(
        @Query() query: ShopQueryDto,
    ): Promise<{
        products: ProductResponseDto[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }> {
        return this.productsService.findForShop({
            productType: query.productType,
            category: query.category,
            collection: query.collection,
            page: query.page ? parseInt(query.page, 10) : 1,
            limit: query.limit ? parseInt(query.limit, 10) : 12,
        });
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
