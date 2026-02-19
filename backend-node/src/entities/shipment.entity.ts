import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
    UpdateDateColumn,
    JoinColumn,
} from 'typeorm';
import { Order } from './order.entity';

export enum ShipmentStatus {
    MANIFESTED = 'manifested',    // Shipment created with carrier (AWB assigned)
    PICKED_UP = 'picked_up',     // Carrier picked up from warehouse
    IN_TRANSIT = 'in_transit',
    OUT_FOR_DELIVERY = 'out_for_delivery',
    SHIPPED = 'shipped',          // Legacy — kept for existing data
    DELIVERED = 'delivered',
    FAILED = 'failed',            // Delivery attempt failed (NDR)
    RTO = 'rto',                  // Return to origin
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

    // Delhivery-specific fields
    @Column({ name: 'delhivery_awb', nullable: true })
    delhiveryAwb: string;

    @Column({ name: 'delhivery_shipment_id', nullable: true })
    delhiveryShipmentId: string;

    @Column({
        type: 'enum',
        enum: ShipmentStatus,
        default: ShipmentStatus.MANIFESTED,
    })
    status: ShipmentStatus;

    @Column({ type: 'timestamp', name: 'shipped_at', nullable: true })
    shippedAt: Date;

    @Column({ type: 'timestamp', name: 'delivered_at', nullable: true })
    deliveredAt: Date;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
