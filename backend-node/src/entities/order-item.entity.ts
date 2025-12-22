import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
    JoinColumn,
} from 'typeorm';
import { Order } from './order.entity';

@Entity('order_items')
export class OrderItem {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'order_id' })
    orderId: string;

    @ManyToOne(() => Order, (order) => order.items, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'order_id' })
    order: Order;

    // Product references (for admin lookup)
    @Column({ name: 'product_id' })
    productId: string;

    @Column({ name: 'variant_id' })
    variantId: string;

    // IMMUTABLE SNAPSHOTS - Prices can change later
    @Column({ name: 'product_name_snapshot' })
    productNameSnapshot: string;

    @Column({ name: 'variant_label_snapshot' })
    variantLabelSnapshot: string;

    @Column({ name: 'sku_snapshot' })
    skuSnapshot: string;

    @Column({ name: 'image_url_snapshot', nullable: true })
    imageUrlSnapshot: string;

    // Pricing breakdown
    @Column({ type: 'int' })
    quantity: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, name: 'unit_price' })
    unitPrice: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, name: 'tax_amount', default: 0 })
    taxAmount: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, name: 'discount_amount', default: 0 })
    discountAmount: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, name: 'line_total' })
    lineTotal: number;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
}
