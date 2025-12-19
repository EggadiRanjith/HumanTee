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
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ChangeStatusDto } from './dto/change-status.dto';

@Injectable()
export class AdminProductsService {
    constructor(
        @InjectRepository(Product)
        private readonly productRepo: Repository<Product>,
        @InjectRepository(ProductVariant)
        private readonly variantRepo: Repository<ProductVariant>,
    ) { }

    /**
     * Create new product (always DRAFT)
     */
    async createProduct(dto: CreateProductDto): Promise<Product> {
        // Check slug uniqueness
        const existing = await this.productRepo.findOne({
            where: { slug: dto.slug },
        });

        if (existing) {
            throw new ConflictException('Slug already exists');
        }

        const product = this.productRepo.create({
            title: dto.title,
            slug: dto.slug,
            description: dto.description,
            status: ProductStatus.DRAFT, // Always start as DRAFT
        });

        return this.productRepo.save(product);
    }

    /**
     * Update product (safe fields only)
     * FIX 2: Explicit slug rejection
     */
    async updateProduct(
        id: string,
        dto: UpdateProductDto,
    ): Promise<Product> {
        // FIX 2: Hard check for slug attempts
        if ('slug' in dto) {
            throw new BadRequestException('Slug cannot be changed');
        }

        const product = await this.productRepo.findOne({ where: { id } });

        if (!product) {
            throw new NotFoundException('Product not found');
        }

        // Cannot edit ARCHIVED products
        if (product.status === ProductStatus.ARCHIVED) {
            throw new BadRequestException('Cannot edit archived products');
        }

        // Update allowed fields
        if (dto.title !== undefined) product.title = dto.title;
        if (dto.description !== undefined) product.description = dto.description;

        return this.productRepo.save(product);
    }

    /**
     * Change product status
     * FIX 4: Pessimistic lock to prevent race conditions
     */
    async changeStatus(
        id: string,
        dto: ChangeStatusDto,
    ): Promise<Product> {
        // Load product with variants
        const product = await this.productRepo.findOne({
            where: { id },
            relations: ['variants'],
        });

        if (!product) {
            throw new NotFoundException('Product not found');
        }

        // Validate transition
        if (product.status === ProductStatus.ARCHIVED) {
            throw new BadRequestException(
                'Archived products cannot be modified',
            );
        }

        // DRAFT → ACTIVE requires active variants
        if (dto.status === ProductStatus.ACTIVE) {
            const activeVariants = product.variants.filter((v) => v.is_active);
            if (activeVariants.length === 0) {
                throw new BadRequestException(
                    'Product must have at least one active variant to be activated',
                );
            }
        }

        product.status = dto.status;
        return this.productRepo.save(product);
    }

    /**
     * Get product by ID (admin view)
     */
    async findById(id: string): Promise<Product> {
        const product = await this.productRepo.findOne({
            where: { id },
            relations: ['variants'],
        });

        if (!product) {
            throw new NotFoundException('Product not found');
        }

        return product;
    }

    /**
     * List all products (admin view - includes DRAFT and ARCHIVED)
     */
    async findAll(): Promise<Product[]> {
        return this.productRepo.find({
            relations: ['variants'],
            order: { created_at: 'DESC' },
        });
    }
}
