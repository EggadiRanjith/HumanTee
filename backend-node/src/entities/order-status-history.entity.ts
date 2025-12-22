import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
    JoinColumn,
} from 'typeorm';
import { Order, OrderStatus } from './order.entity';

@Entity('order_status_history')
export class OrderStatusHistory {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'order_id' })
    orderId: string;

    @ManyToOne(() => Order, (order) => order.statusHistory, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'order_id' })
    order: Order;

    @Column({ name: 'from_status', nullable: true })
    fromStatus: OrderStatus;

    @Column({ name: 'to_status' })
    toStatus: OrderStatus;

    @Column({ name: 'changed_by', nullable: true })
    changedBy: string; // User ID who made the change

    @Column({ type: 'text', nullable: true })
    reason: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
}
