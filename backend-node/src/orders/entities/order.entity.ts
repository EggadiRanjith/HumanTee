import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    OneToMany,
    JoinColumn,
} from 'typeorm';
import { AuthUser } from '../../entities/auth-user.entity';
import { OrderItem } from './order-item.entity';
import { Payment } from '../../payments/entities/payment.entity';
import { OrderStatus } from '../enums/order-status.enum';

/**
 * Order Entity
 * Phase 6: Immutable financial records
 * - Stock decremented at creation
 * - No edits after creation
 * - payment_order_id nullable (populated after Razorpay)
 */
@Entity('orders')
export class Order {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'uuid' })
    user_id: string;

    @Column({
        type: 'enum',
        enum: OrderStatus,
        default: OrderStatus.PENDING,
    })
    status: OrderStatus;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    total_amount: number;

    @Column({ type: 'varchar', length: 3, default: 'INR' })
    currency: string;

    @Column({ type: 'varchar', default: 'RAZORPAY' })
    payment_provider: string;

    @Column({ type: 'varchar', unique: true, nullable: true }) // CORRECTED: nullable
    payment_order_id: string | null;

    @Column({ type: 'timestamp', nullable: true }) // Phase 7: Fulfillment timestamp
    fulfilled_at: Date | null;

    @Column({ type: 'timestamp', nullable: true }) // Phase 7: Cancellation timestamp
    cancelled_at: Date | null;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    // Relations
    @ManyToOne(() => AuthUser)
    @JoinColumn({ name: 'user_id' })
    user: AuthUser;

    @OneToMany(() => OrderItem, (item) => item.order, { cascade: true })
    items: OrderItem[];

    @OneToMany(() => Payment, (payment) => payment.order)
    payments: Payment[];
}
