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

export enum PaymentStatus {
    INITIATED = 'initiated',
    PENDING = 'pending',
    AUTHORIZED = 'authorized',
    CAPTURED = 'captured',
    FAILED = 'failed',
}

@Entity('payments')
export class Payment {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'order_id' })
    orderId: string;

    @ManyToOne(() => Order, (order) => order.payments, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'order_id' })
    order: Order;

    // Payment gateway info
    @Column({ default: 'razorpay' })
    provider: string;

    @Column({ name: 'provider_payment_id', nullable: true })
    providerPaymentId: string;

    @Column({ name: 'provider_order_id', nullable: true })
    providerOrderId: string;

    // Payment details
    @Column({ type: 'decimal', precision: 10, scale: 2 })
    amount: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, name: 'refunded_amount', default: 0 })
    refundedAmount: number;

    @Column({ length: 3, default: 'INR' })
    currency: string;

    @Column({
        type: 'enum',
        enum: PaymentStatus,
        default: PaymentStatus.INITIATED,
    })
    status: PaymentStatus;

    @Column({ name: 'payment_method', nullable: true })
    paymentMethod: string;

    @Column({ type: 'text', name: 'failure_reason', nullable: true })
    failureReason: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
