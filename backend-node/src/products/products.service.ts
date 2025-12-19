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
     * Get all ACTIVE products with their ACTIVE variants
     */
    async findAll(): Promise<ProductResponseDto[]> {
        const products = await this.productRepo.find({
            where: { status: ProductStatus.ACTIVE },
            relations: ['variants'],
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
            relations: ['variants'],
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
     * FIX 4: Transform DECIMAL to number
     * Transform Product entity to DTO
     */
    private transformProduct(product: Product): ProductResponseDto {
        return {
            id: product.id,
            title: product.title,
            slug: product.slug,
            description: product.description,
            status: product.status,
            // Filter only active variants and transform
            variants: product.variants
                ? product.variants
                    .filter((v) => v.is_active)
                    .map((v) => this.transformVariant(v))
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
            color: variant.color,
            price: Number(variant.price), // CRITICAL: Convert DECIMAL string to number
            stock: variant.stock_quantity,
            isActive: variant.is_active,
        };
    }
}
