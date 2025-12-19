import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { Order } from '../../orders/entities/order.entity';
import { PaymentStatus } from '../enums/payment-status.enum';

/**
 * Payment Entity
 * Phase 6: Razorpay payment tracking
 * - provider_payment_id UNIQUE for idempotency
 * - raw_payload for audit trail
 */
@Entity('payments')
export class Payment {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'uuid' })
    order_id: string;

    @Column({ type: 'varchar', default: 'RAZORPAY' })
    provider: string;

    @Column({ type: 'varchar', unique: true, nullable: true }) // CORRECTED: for idempotency
    provider_payment_id: string | null;

    @Column({ type: 'varchar' })
    provider_order_id: string; // Razorpay order ID

    @Column({
        type: 'enum',
        enum: PaymentStatus,
        default: PaymentStatus.CREATED,
    })
    status: PaymentStatus;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    amount: number;

    @Column({ type: 'varchar', length: 3 })
    currency: string;

    @Column({ type: 'jsonb', nullable: true })
    raw_payload: any;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    // Relations
    @ManyToOne(() => Order, (order) => order.payments)
    @JoinColumn({ name: 'order_id' })
    order: Order;
}
