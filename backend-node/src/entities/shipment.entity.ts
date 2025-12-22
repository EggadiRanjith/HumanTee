import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
    JoinColumn,
} from 'typeorm';
import { Order } from './order.entity';

export enum ShipmentStatus {
    SHIPPED = 'shipped',
    DELIVERED = 'delivered',
}

@Entity('shipments')
export class Shipment {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'order_id' })
    orderId: string;

    @ManyToOne(() => Order, (order) => order.shipments, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'order_id' })
    order: Order;

    @Column({ nullable: true })
    carrier: string;

    @Column({ name: 'tracking_number', nullable: true })
    trackingNumber: string;

    @Column({
        type: 'enum',
        enum: ShipmentStatus,
        default: ShipmentStatus.SHIPPED,
    })
    status: ShipmentStatus;

    @Column({ type: 'timestamp', name: 'shipped_at', nullable: true })
    shippedAt: Date;

    @Column({ type: 'timestamp', name: 'delivered_at', nullable: true })
    deliveredAt: Date;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
}
