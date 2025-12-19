import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { Order } from './order.entity';
import { Product } from '../../products/entities/product.entity';
import { ProductVariant } from '../../products/entities/product-variant.entity';

/**
 * OrderItem Entity
 * Phase 6: Snapshot-based order items
 * - Nullable FKs (snapshots are authoritative)
 * - Immutable after creation
 */
@Entity('order_items')
export class OrderItem {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'uuid' })
    order_id: string;

    @Column({ type: 'uuid', nullable: true })
    product_id: string | null;

    @Column({ type: 'uuid', nullable: true })
    variant_id: string | null;

    @Column({ type: 'int' })
    quantity: number;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    price_snapshot: number;

    @Column({ type: 'varchar', length: 3 })
    currency: string;

    @Column({ type: 'text' })
    variant_label: string;

    @Column({ type: 'text' })
    product_title: string;

    @CreateDateColumn()
    created_at: Date;

    // Relations
    @ManyToOne(() => Order, (order) => order.items, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'order_id' })
    order: Order;

    @ManyToOne(() => Product, { nullable: true, onDelete: 'SET NULL' })
    @JoinColumn({ name: 'product_id' })
    product: Product;

    @ManyToOne(() => ProductVariant, { nullable: true, onDelete: 'SET NULL' })
    @JoinColumn({ name: 'variant_id' })
    variant: ProductVariant;
}
