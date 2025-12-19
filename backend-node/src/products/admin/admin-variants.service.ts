import {
    Injectable,
    NotFoundException,
    BadRequestException,
    ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../entities/product.entity';
import { ProductVariant } from '../entities/product-variant.entity';
import { ProductStatus } from '../enums/product-status.enum';
import { CreateVariantDto } from './dto/create-variant.dto';
import { UpdateVariantDto } from './dto/update-variant.dto';

@Injectable()
export class AdminVariantsService {
    constructor(
        @InjectRepository(Product)
        private readonly productRepo: Repository<Product>,
        @InjectRepository(ProductVariant)
        private readonly variantRepo: Repository<ProductVariant>,
    ) { }

    /**
     * Create variant for product
     */
    async createVariant(
        productId: string,
        dto: CreateVariantDto,
    ): Promise<ProductVariant> {
        const product = await this.productRepo.findOne({
            where: { id: productId },
        });

        if (!product) {
            throw new NotFoundException('Product not found');
        }

        // Cannot add variants to ARCHIVED products
        if (product.status === ProductStatus.ARCHIVED) {
            throw new BadRequestException(
                'Cannot add variants to archived products',
            );
        }

        // Check SKU uniqueness
        const existing = await this.variantRepo.findOne({
            where: { sku: dto.sku },
        });

        if (existing) {
            throw new ConflictException('SKU already exists');
        }

        const variant = this.variantRepo.create({
            product_id: productId,
            sku: dto.sku,
            size: dto.size,
            color: dto.color,
            price: dto.price,
            stock_quantity: dto.stockQuantity,
            is_active: true,
        });

        return this.variantRepo.save(variant);
    }

    /**
     * Update variant
     * FIX 3: Prevent deactivating last active variant of ACTIVE product
     */
    async updateVariant(
        id: string,
        dto: UpdateVariantDto,
    ): Promise<ProductVariant> {
        const variant = await this.variantRepo.findOne({
            where: { id },
            relations: ['product'],
        });

        if (!variant) {
            throw new NotFoundException('Variant not found');
        }

        // Cannot edit variants of ARCHIVED products
        if (variant.product.status === ProductStatus.ARCHIVED) {
            throw new BadRequestException(
                'Cannot edit variants of archived products',
            );
        }

        // FIX 3: Prevent deactivating last active variant
        if (
            dto.isActive === false &&
            variant.product.status === ProductStatus.ACTIVE
        ) {
            const activeCount = await this.variantRepo.count({
                where: {
                    product_id: variant.product.id,
                    is_active: true,
                },
            });

            if (activeCount <= 1) {
                throw new BadRequestException(
                    'Cannot deactivate last active variant of an ACTIVE product',
                );
            }
        }

        // Update allowed fields
        if (dto.price !== undefined) variant.price = dto.price;
        if (dto.stockQuantity !== undefined)
            variant.stock_quantity = dto.stockQuantity;
        if (dto.isActive !== undefined) variant.is_active = dto.isActive;

        return this.variantRepo.save(variant);
    }

    /**
     * Get variant by ID (admin view)
     */
    async findById(id: string): Promise<ProductVariant> {
        const variant = await this.variantRepo.findOne({
            where: { id },
            relations: ['product'],
        });

        if (!variant) {
            throw new NotFoundException('Variant not found');
        }

        return variant;
    }

    /**
     * List all variants for a product (admin view)
     */
    async findByProductId(productId: string): Promise<ProductVariant[]> {
        return this.variantRepo.find({
            where: { product_id: productId },
            order: { created_at: 'DESC' },
        });
    }
}
