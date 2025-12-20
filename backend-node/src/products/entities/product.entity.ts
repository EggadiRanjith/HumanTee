import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    VersionColumn,
    OneToMany,
    Index,
} from 'typeorm';
import { ProductVariant } from './product-variant.entity';
import { ProductImage } from './product-image.entity';
import { ProductCollectionMap } from './product-collection-map.entity';
import { ProductStatus } from '../enums/product-status.enum';
import { InventoryMode } from '../enums/inventory-mode.enum';

/**
 * Product Entity (PRODUCTION-GRADE)
 * Container for product information with full e-commerce fields
 */
@Entity('products')
@Index('idx_products_featured_active', ['is_featured', 'status', 'created_at'])
@Index('idx_products_low_stock', ['track_inventory', 'stock_quantity', 'low_stock_threshold'])
export class Product {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    // ========================================================================
    // BASIC INFO
    // ========================================================================
    @Column({ type: 'varchar', length: 255 })
    name: string;

    @Column({ type: 'varchar', length: 255, unique: true })
    @Index('IDX_PRODUCTS_SLUG')
    slug: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({
        type: 'enum',
        enum: ProductStatus,
        default: ProductStatus.DRAFT,
    })
    status: ProductStatus;

    // ========================================================================
    // OPTIMISTIC LOCKING (CRITICAL)
    // ========================================================================
    @VersionColumn()
    version: number;

    // ========================================================================
    // PRICING
    // ========================================================================
    @Column({ type: 'decimal', precision: 10, scale: 2 })
    base_price: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    compare_at_price?: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    cost_per_item?: number;

    @Column({ type: 'varchar', length: 3, default: 'INR' })
    currency: string;

    @Column({ type: 'boolean', default: true })
    taxable: boolean;

    // ========================================================================
    // INVENTORY
    // ========================================================================
    @Column({
        type: 'enum',
        enum: InventoryMode,
        default: InventoryMode.SINGLE,
    })
    inventory_mode: InventoryMode;

    @Column({ type: 'boolean', default: true })
    track_inventory: boolean;

    @Column({ type: 'varchar', length: 100, nullable: true })
    sku?: string;

    @Column({ type: 'int', default: 0 })
    stock_quantity: number;

    @Column({ type: 'boolean', default: false })
    continue_selling_when_out_of_stock: boolean;

    @Column({ type: 'int', nullable: true })
    low_stock_threshold?: number;

    // ========================================================================
    // ORGANIZATION
    // ========================================================================
    @Column({ type: 'boolean', default: false })
    @Index('IDX_PRODUCTS_IS_FEATURED')
    is_featured: boolean;

    @Column({ type: 'varchar', length: 50, default: 'T-Shirt' })
    product_type: string;

    @Column({ type: 'varchar', length: 50, default: 'Drop 1' })
    category: string;

    // ========================================================================
    // TIMESTAMPS
    // ========================================================================
    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    // ========================================================================
    // RELATIONS
    // ========================================================================
    @OneToMany(() => ProductVariant, (variant) => variant.product)
    variants: ProductVariant[];

    @OneToMany(() => ProductImage, (image) => image.product)
    images: ProductImage[];

    @OneToMany(() => ProductCollectionMap, (map) => map.product)
    collectionMaps: ProductCollectionMap[];
}

