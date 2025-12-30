import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { ProductVariant } from './entities/product-variant.entity';
import { ProductStatus } from './enums/product-status.enum';
import { ProductResponseDto, VariantResponseDto } from './dto/product-response.dto';

@Injectable()
export class ProductsService {
    constructor(
        @InjectRepository(Product)
        private readonly productRepo: Repository<Product>,
        @InjectRepository(ProductVariant)
        private readonly variantRepo: Repository<ProductVariant>,
    ) { }

    /**
     * FIX 3: Enforce ACTIVE-only queries
     * Get all ACTIVE and FEATURED products with their ACTIVE variants
     */
    async findAll(): Promise<ProductResponseDto[]> {
        const products = await this.productRepo.find({
            where: {
                status: ProductStatus.ACTIVE,
                is_featured: true
            },
            relations: ['variants', 'images', 'collectionMaps', 'collectionMaps.collection'],  // ✅ Added collections
        });

        return products.map((product) => this.transformProduct(product));
    }

    /**
     * FIX 3: Enforce ACTIVE-only queries
     * Get single ACTIVE product by slug
     */
    async findBySlug(slug: string): Promise<ProductResponseDto> {
        const product = await this.productRepo.findOne({
            where: { slug, status: ProductStatus.ACTIVE },
            relations: ['variants', 'images', 'collectionMaps', 'collectionMaps.collection'],  // ✅ Added collections
        });

        if (!product) {
            throw new NotFoundException(`Product with slug "${slug}" not found`);
        }

        return this.transformProduct(product);
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
     * Shop Page: Get all ACTIVE products with optional filters
     * Supports filtering by productType, category, and collection
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

        // Filter by category (Drop 1, Drop 2, etc.)
        if (filters?.category) {
            query.andWhere('product.category = :category', {
                category: filters.category,
            });
        }

        // Filter by collection (requires join with collection map)
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
