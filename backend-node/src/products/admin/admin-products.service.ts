import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Product } from '../entities/product.entity';
import { ProductVariant } from '../entities/product-variant.entity';
import { ProductImage } from '../entities/product-image.entity';
import { Collection } from '../entities/collection.entity';
import { ProductCollectionMap } from '../entities/product-collection-map.entity';
import { ProductStatus } from '../enums/product-status.enum';
import { InventoryMode } from '../enums/inventory-mode.enum';
import { CreateProductDto, UpdateProductDto } from './dto/create-product.dto';
import { ProductResponseDto } from './dto/product-response.dto';

@Injectable()
export class AdminProductsService {
    constructor(
        @InjectRepository(Product)
        private readonly productRepo: Repository<Product>,
        @InjectRepository(ProductVariant)
        private readonly variantRepo: Repository<ProductVariant>,
        @InjectRepository(ProductImage)
        private readonly imageRepo: Repository<ProductImage>,
        @InjectRepository(Collection)
        private readonly collectionRepo: Repository<Collection>,
        @InjectRepository(ProductCollectionMap)
        private readonly collectionMapRepo: Repository<ProductCollectionMap>,
    ) { }

    /**
     * Create new product with all relations
     */
    async createProduct(dto: CreateProductDto): Promise<ProductResponseDto> {
        // Generate slug from name
        const slug = this.generateSlug(dto.name);

        // Check slug uniqueness
        const existing = await this.productRepo.findOne({ where: { slug } });
        if (existing) {
            throw new ConflictException('Product with similar name already exists');
        }

        // Validate SKU based on inventory mode
        await this.validateSKU(dto);

        // Create product
        let initialStock = dto.stock || 0;
        if (dto.inventoryMode === 'VARIANT' && dto.variants) {
            initialStock = dto.variants.reduce((sum, v) => sum + (Number(v.stock) || 0), 0);
        }

        const product = this.productRepo.create({
            name: dto.name,
            slug,
            description: dto.description,
            product_type: dto.productType,
            category: dto.category,
            base_price: dto.price,
            compare_at_price: dto.compareAtPrice,
            cost_per_item: dto.costPerItem,
            currency: dto.currency || 'INR',
            taxable: dto.taxable ?? true,
            inventory_mode: dto.inventoryMode as any,
            track_inventory: dto.trackInventory,
            stock_quantity: initialStock,
            sku: dto.inventoryMode === 'SINGLE' ? dto.sku : undefined,
            continue_selling_when_out_of_stock: dto.continueSellingWhenOutOfStock ?? false,
            low_stock_threshold: dto.lowStockThreshold,
            status: dto.status as any || ProductStatus.DRAFT,
            is_featured: dto.isFeatured ?? false,
        });

        const savedProduct = await this.productRepo.save(product);

        // Create variants if VARIANT mode
        if (dto.inventoryMode === 'VARIANT' && dto.variants) {
            for (const variantDto of dto.variants) {
                const variant = this.variantRepo.create({
                    product_id: savedProduct.id,
                    size: variantDto.size,
                    sku: variantDto.sku,
                    sku_locked: false,
                    price: dto.price,
                    price_override: variantDto.priceOverride,
                    stock_quantity: variantDto.stock,
                    is_active: true,
                });
                await this.variantRepo.save(variant);
            }
        }

        // Create images
        if (dto.images && dto.images.length > 0) {
            for (const imageDto of dto.images) {
                const image = this.imageRepo.create({
                    product_id: savedProduct.id,
                    url: imageDto.url,
                    alt_text: imageDto.altText,
                    status: 'ACTIVE',
                    is_primary: imageDto.isPrimary,
                    display_order: imageDto.order,
                    uploaded_at: new Date(),
                });
                await this.imageRepo.save(image);
            }
        }

        // Link to collections
        if (dto.collections && dto.collections.length > 0) {
            await this.linkCollections(savedProduct.id, dto.collections);
        }

        return this.getProductById(savedProduct.id);
    }

    /**
     * Update existing product
     */
    async updateProduct(id: string, dto: UpdateProductDto): Promise<ProductResponseDto> {
        const product = await this.productRepo.findOne({ where: { id } });

        if (!product) {
            throw new NotFoundException('Product not found');
        }

        // Update basic fields
        if (dto.name) product.name = dto.name;
        if (dto.description) product.description = dto.description;
        if (dto.productType) product.product_type = dto.productType;
        if (dto.category) product.category = dto.category;
        if (dto.price !== undefined) product.base_price = dto.price;
        if (dto.compareAtPrice !== undefined) product.compare_at_price = dto.compareAtPrice;
        if (dto.costPerItem !== undefined) product.cost_per_item = dto.costPerItem;
        if (dto.taxable !== undefined) product.taxable = dto.taxable;
        if (dto.inventoryMode) product.inventory_mode = dto.inventoryMode as any;
        if (dto.trackInventory !== undefined) product.track_inventory = dto.trackInventory;
        if (dto.stock !== undefined) product.stock_quantity = dto.stock;
        if (dto.sku) product.sku = dto.sku;
        if (dto.continueSellingWhenOutOfStock !== undefined) {
            product.continue_selling_when_out_of_stock = dto.continueSellingWhenOutOfStock;
        }
        if (dto.lowStockThreshold !== undefined) product.low_stock_threshold = dto.lowStockThreshold;
        if (dto.status) product.status = dto.status as any;
        if (dto.isFeatured !== undefined) product.is_featured = dto.isFeatured;

        await this.productRepo.save(product);

        // Update variants if provided
        if (dto.variants) {
            // Delete existing variants
            await this.variantRepo.delete({ product_id: id });

            let totalStock = 0;
            // Create new variants
            for (const variantDto of dto.variants) {
                const variantStock = Number(variantDto.stock) || 0;
                totalStock += variantStock;

                const variant = this.variantRepo.create({
                    product_id: id,
                    size: variantDto.size,
                    sku: variantDto.sku,
                    sku_locked: false,
                    price: product.base_price,
                    price_override: variantDto.priceOverride,
                    stock_quantity: variantStock,
                    is_active: true,
                });
                await this.variantRepo.save(variant);
            }

            // Sync aggregate stock to product table if in VARIANT mode
            if (product.inventory_mode === 'VARIANT' as any) {
                product.stock_quantity = totalStock;
                await this.productRepo.save(product);
            }
        }

        // Update images if provided
        if (dto.images) {
            // Delete existing images
            await this.imageRepo.delete({ product_id: id });

            // Create new images
            for (const imageDto of dto.images) {
                const image = this.imageRepo.create({
                    product_id: id,
                    url: imageDto.url,
                    alt_text: imageDto.altText,
                    status: 'ACTIVE',
                    is_primary: imageDto.isPrimary,
                    display_order: imageDto.order,
                    uploaded_at: new Date(),
                });
                await this.imageRepo.save(image);
            }
        }

        // Update collections if provided
        if (dto.collections) {
            await this.collectionMapRepo.delete({ product_id: id });
            await this.linkCollections(id, dto.collections);
        }

        return this.getProductById(id);
    }

    /**
     * Get single product by ID with all relations
     */
    async getProductById(id: string): Promise<ProductResponseDto> {
        const product = await this.productRepo.findOne({
            where: { id },
            relations: ['variants', 'images', 'collectionMaps', 'collectionMaps.collection'],
        });

        if (!product) {
            throw new NotFoundException('Product not found');
        }

        return this.transformToResponse(product);
    }

    /**
     * Get all products (admin view - includes drafts)
     */
    async getAllProducts(): Promise<ProductResponseDto[]> {
        const products = await this.productRepo.find({
            relations: ['variants', 'images', 'collectionMaps', 'collectionMaps.collection'],
            order: { created_at: 'DESC' },
        });

        return products.map(p => this.transformToResponse(p));
    }

    /**
     * Delete product
     */
    async deleteProduct(id: string): Promise<void> {
        const product = await this.productRepo.findOne({ where: { id } });

        if (!product) {
            throw new NotFoundException('Product not found');
        }

        await this.productRepo.remove(product);
    }

    /**
     * Get all collections
     */
    async getAllCollections(): Promise<Collection[]> {
        return this.collectionRepo.find({
            order: { name: 'ASC' },
        });
    }

    // ========================================================================
    // HELPER METHODS
    // ========================================================================

    private generateSlug(name: string): string {
        return name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');
    }

    private async validateSKU(dto: CreateProductDto): Promise<void> {
        // Skip strict validation for drafts
        if (dto.status === 'DRAFT') return;

        if (dto.inventoryMode === 'SINGLE') {
            if (!dto.sku) {
                throw new BadRequestException('SKU required in SINGLE inventory mode');
            }
            if (dto.variants && dto.variants.length > 0) {
                throw new BadRequestException('Variants not allowed in SINGLE inventory mode');
            }

            // Check SKU uniqueness
            const existing = await this.productRepo.findOne({ where: { sku: dto.sku } });
            if (existing) {
                throw new ConflictException(`SKU ${dto.sku} already exists`);
            }
        } else {
            if (!dto.variants || dto.variants.length === 0) {
                throw new BadRequestException('At least one variant required in VARIANT mode');
            }

            // Check variant SKUs uniqueness
            const skus = dto.variants.map(v => v.sku);
            const uniqueSkus = new Set(skus);
            if (skus.length !== uniqueSkus.size) {
                throw new BadRequestException('Duplicate SKUs in variants');
            }

            const existingVariants = await this.variantRepo.find({
                where: { sku: In(skus) },
            });
            if (existingVariants.length > 0) {
                throw new ConflictException(
                    `SKUs already exist: ${existingVariants.map(v => v.sku).join(', ')}`
                );
            }
        }
    }

    private async linkCollections(productId: string, collectionSlugs: string[]): Promise<void> {
        for (let i = 0; i < collectionSlugs.length; i++) {
            const collection = await this.collectionRepo.findOne({
                where: { slug: collectionSlugs[i] },
            });

            if (collection) {
                const map = this.collectionMapRepo.create({
                    product_id: productId,
                    collection_id: collection.id,
                    position: i,
                    added_at: new Date(),
                });
                await this.collectionMapRepo.save(map);
            }
        }
    }

    private transformToResponse(product: Product): ProductResponseDto {
        return {
            id: product.id,
            name: product.name,
            slug: product.slug,
            description: product.description,
            productType: product.product_type,
            category: product.category,
            basePrice: Number(product.base_price),
            compareAtPrice: product.compare_at_price ? Number(product.compare_at_price) : undefined,
            costPerItem: product.cost_per_item ? Number(product.cost_per_item) : undefined,
            currency: product.currency,
            taxable: product.taxable,
            inventoryMode: product.inventory_mode,
            trackInventory: product.track_inventory,
            stock: product.stock_quantity,
            sku: product.sku,
            continueSellingWhenOutOfStock: product.continue_selling_when_out_of_stock,
            lowStockThreshold: product.low_stock_threshold,
            status: product.status,
            isFeatured: product.is_featured,
            images: product.images?.map(img => ({
                id: img.id,
                url: img.url,
                altText: img.alt_text,
                status: img.status,
                isPrimary: img.is_primary,
                displayOrder: img.display_order,
                uploadedAt: img.uploaded_at,
            })) || [],
            variants: product.variants?.map(v => ({
                id: v.id,
                size: v.size,
                sku: v.sku,
                skuLocked: v.sku_locked,
                stock: v.stock_quantity,
                priceOverride: v.price_override ? Number(v.price_override) : undefined,
                isActive: v.is_active,
            })) || [],
            collections: product.collectionMaps?.map(map => ({
                id: map.collection.id,
                name: map.collection.name,
                slug: map.collection.slug,
                position: map.position,
            })) || [],
            version: product.version,
            createdAt: product.created_at,
            updatedAt: product.updated_at,
        };
    }
}
