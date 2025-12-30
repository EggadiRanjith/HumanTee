import {
    Entity,
    PrimaryColumn,
    Column,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { Discount } from './discount.entity';
import { Order } from './order.entity';

@Entity('order_discounts')
export class OrderDiscount {
    @PrimaryColumn({ name: 'order_id', type: 'uuid' })
    orderId: string;

    @PrimaryColumn({ name: 'discount_id', type: 'uuid' })
    discountId: string;

    @ManyToOne(() => Order, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'order_id' })
    order: Order;

    @ManyToOne(() => Discount, { onDelete: 'SET NULL', nullable: true })
    @JoinColumn({ name: 'discount_id' })
    discount: Discount;

    @Column({ name: 'discount_code', type: 'varchar', length: 50 })
    discountCode: string;

    @Column({ name: 'discount_type', type: 'varchar', length: 20 })
    discountType: string;

    @Column({ name: 'discount_value', type: 'decimal', precision: 10, scale: 2 })
    discountValue: number;

    @Column({ name: 'applied_amount', type: 'decimal', precision: 10, scale: 2 })
    appliedAmount: number;
}
