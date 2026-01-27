import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { ProductVariant } from './entities/product-variant.entity';
import { ProductStatus } from './enums/product-status.enum';
import { ProductResponseDto, VariantResponseDto } from './dto/product-response.dto';
import { CacheService } from '../redis/cache.service';

@Injectable()
export class ProductsService {
    constructor(
        @InjectRepository(Product)
        private readonly productRepo: Repository<Product>,
        @InjectRepository(ProductVariant)
        private readonly variantRepo: Repository<ProductVariant>,
        private readonly cacheService: CacheService,
    ) { }

    /**
     * Get all ACTIVE and FEATURED products with Redis caching
     * Cache: 10 minutes (featured products change rarely)
     */
    async findAll(): Promise<ProductResponseDto[]> {
        return this.cacheService.remember(
            'products:featured',
            async () => {
                const products = await this.productRepo.find({
                    where: {
                        status: ProductStatus.ACTIVE,
                        is_featured: true
                    },
                    relations: ['variants', 'images', 'collectionMaps', 'collectionMaps.collection'],
                });
                return products.map((product) => this.transformProduct(product));
            },
            { ttl: 7200 } // 2 hours - featured products change rarely
        );
    }

    /**
     * ✅ OPTIMIZED: Get ALL ACTIVE products (summary data only)
     * Returns minimal data for product lists/grids (~1-2MB instead of 13MB)
     * Use findBySlug() for full product details
     * Cache: 2 hours (product list changes rarely)
     */
    async getAllProducts(): Promise<any[]> {
        return this.cacheService.remember(
            'products:all',
            async () => {
                const products = await this.productRepo.find({
                    where: {
                        status: ProductStatus.ACTIVE
                    },
                    relations: ['images', 'variants'], // Need primary image and stock check
                    order: {
                        created_at: 'DESC'
                    }
                });
                return products.map((product) => this.transformProductSummary(product));
            },
            { ttl: 7200 } // 2 hours - all products, summary data only
        );
    }

    /**
     * Get single ACTIVE product by slug with Redis caching
     * Cache: 5 minutes (product details change occasionally)
     */
    async findBySlug(slug: string): Promise<ProductResponseDto> {
        return this.cacheService.remember(
            `product:slug:${slug}`,
            async () => {
                const product = await this.productRepo.findOne({
                    where: { slug, status: ProductStatus.ACTIVE },
                    relations: ['variants', 'images', 'collectionMaps', 'collectionMaps.collection'],
                });

                if (!product) {
                    throw new NotFoundException(`Product with slug "${slug}" not found`);
                }

                return this.transformProduct(product);
            },
            { ttl: 3600 } // 1 hour - product details change occasionally
        );
    }

    /**
     * Get all ACTIVE variants for a product
     */
    async findVariantsByProductId(productId: string): Promise<VariantResponseDto[]> {
        const variants = await this.variantRepo.find({
            where: { product_id: productId, is_active: true },
        });

        return variants.map((variant) => this.transformVariant(variant));
    }

    /**
     * Shop Page: Get all ACTIVE products with optional filters and Redis caching
     * Cache: 5 minutes per filter combination
     */
    async findForShop(filters?: {
        productType?: string;
        category?: string;
        collection?: string;
        page?: number;
        limit?: number;
    }): Promise<{
        products: ProductResponseDto[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }> {
        const page = filters?.page || 1;
        const limit = filters?.limit || 12;

        // Create cache key from filters
        const cacheKey = `shop:${filters?.productType || 'all'}:${filters?.category || 'all'}:${filters?.collection || 'all'}:${page}:${limit}`;

        return this.cacheService.remember(
            cacheKey,
            async () => {
                const skip = (page - 1) * limit;

                const query = this.productRepo
                    .createQueryBuilder('product')
                    .leftJoinAndSelect('product.variants', 'variants')
                    .leftJoinAndSelect('product.images', 'images')
                    .leftJoinAndSelect('product.collectionMaps', 'collectionMaps')
                    .leftJoinAndSelect('collectionMaps.collection', 'collection')
                    .where('product.status = :status', { status: ProductStatus.ACTIVE });

                // Filter by product type
                if (filters?.productType) {
                    query.andWhere('product.product_type = :productType', {
                        productType: filters.productType,
                    });
                }

                // Filter by category
                if (filters?.category) {
                    query.andWhere('product.category = :category', {
                        category: filters.category,
                    });
                }

                // Filter by collection
                if (filters?.collection) {
                    query
                        .innerJoin('product.collectionMaps', 'collectionMap')
                        .innerJoin('collectionMap.collection', 'collection')
                        .andWhere('collection.slug = :collectionSlug', {
                            collectionSlug: filters.collection,
                        })
                        .andWhere('collection.is_active = :isActive', { isActive: true });
                }

                const [products, total] = await query
                    .skip(skip)
                    .take(limit)
                    .getManyAndCount();

                return {
                    products: products.map((product) => this.transformProduct(product)),
                    total,
                    page,
                    limit,
                    totalPages: Math.ceil(total / limit),
                };
            },
            { ttl: 300 } // 5 minutes
        );
    }

    /**
     * FIX 4: Transform DECIMAL to number
     * Transform Product entity to DTO
     */
    private transformProduct(product: Product): ProductResponseDto {
        return {
            id: product.id,
            title: product.name,
            slug: product.slug,
            description: product.description,
            status: product.status,
            category: product.category,
            // ✅ Added: Base price and compare-at price for pricing display
            basePrice: Number(product.base_price),
            compareAtPrice: product.compare_at_price ? Number(product.compare_at_price) : undefined,
            // Map the first collection's name/slug if available
            collection: product.collectionMaps && product.collectionMaps.length > 0
                ? product.collectionMaps[0].collection?.name
                : undefined,
            // Filter only active variants and transform
            variants: product.variants
                ? product.variants
                    .filter((v) => v.is_active)
                    .map((v) => this.transformVariant(v))
                : [],
            // ✅ Added: Include images with camelCase fields
            images: product.images
                ? product.images
                    .filter((img) => img.status === 'ACTIVE')  // Only active images
                    .map((img) => ({
                        id: img.id,
                        url: img.url,
                        altText: img.alt_text,
                        isPrimary: img.is_primary,
                        displayOrder: img.display_order,
                    }))
                : [],
        };
    }

    /**
     * Transform Product entity to summary DTO (optimized for lists/grids)
     * Returns only essential fields, no variants, single primary image
     */
    private transformProductSummary(product: Product): any {
        // Find primary image or use first active image
        const primaryImage = product.images?.find(img => img.is_primary && img.status === 'ACTIVE')
            || product.images?.find(img => img.status === 'ACTIVE');

        // Check if ANY active variant has stock > 0
        const hasStock = product.variants?.some(v => v.is_active && v.stock_quantity > 0) || false;

        return {
            id: product.id,
            title: product.name,
            slug: product.slug,
            category: product.category,
            basePrice: Number(product.base_price),
            compareAtPrice: product.compare_at_price ? Number(product.compare_at_price) : undefined,
            primaryImage: primaryImage ? primaryImage.url : null,
            inStock: hasStock,
        };
    }

    /**
     * FIX 4: Transform DECIMAL to number
     * Postgres returns DECIMAL as string, must convert to number
     */
    private transformVariant(variant: ProductVariant): VariantResponseDto {
        return {
            id: variant.id,
            sku: variant.sku,
            size: variant.size,
            price: Number(variant.price), // CRITICAL: Convert DECIMAL string to number
            stock: variant.stock_quantity,
            isActive: variant.is_active,
        };
    }
}
