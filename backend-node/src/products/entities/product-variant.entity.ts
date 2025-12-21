import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
    Index,
} from 'typeorm';
import { Product } from './product.entity';

/**
 * ProductVariant Entity (PRODUCTION-GRADE)
 * Sellable unit that owns price and stock
 */
@Entity('product_variants')
@Index('idx_variants_stock', ['product_id', 'is_active', 'stock_quantity'])
export class ProductVariant {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'uuid' })
    @Index('IDX_PRODUCT_VARIANTS_PRODUCT_ID')
    product_id: string;

    @Column({ type: 'varchar', length: 100, unique: true })
    @Index('IDX_PRODUCT_VARIANTS_SKU')
    sku: string;

    @Column({ type: 'boolean', default: false })
    sku_locked: boolean; // Prevents SKU changes after publish

    @Column({ type: 'varchar', length: 50 })
    size: string;


    @Column({ type: 'decimal', precision: 10, scale: 2 })
    price: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    price_override?: number; // Optional override

    @Column({ type: 'int', default: 0 })
    stock_quantity: number;



    @Column({ type: 'boolean', default: true })
    is_active: boolean;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @ManyToOne(() => Product, (product) => product.variants, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'product_id' })
    product: Product;
}
