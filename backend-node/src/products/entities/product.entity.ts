import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
    Index,
} from 'typeorm';
import { ProductVariant } from './product-variant.entity';
import { ProductStatus } from '../enums/product-status.enum';

/**
 * Product Entity
 * Container for product information
 * Does NOT own price (variants do)
 */
@Entity('products')
export class Product {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 255 })
    title: string;

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

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    // FIX 1: NO cascade - let DB handle deletes, services handle writes
    @OneToMany(() => ProductVariant, (variant) => variant.product)
    variants: ProductVariant[];
}
