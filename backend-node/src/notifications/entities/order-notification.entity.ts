import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    ManyToOne,
    JoinColumn,
    Index,
} from 'typeorm';
import { Order } from '../../entities';
import { NotificationType } from '../enums/notification-type.enum';

/**
 * OrderNotification Entity
 * Phase 7: Email idempotency tracking
 * - Prevents duplicate emails
 * - Unique constraint on order_id + type
 */
@Entity('order_notifications')
@Index(['orderId', 'type'], { unique: true }) // CORRECTED: Idempotency
export class OrderNotification {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'uuid', name: 'order_id' })
    orderId: string;

    @Column({
        type: 'enum',
        enum: NotificationType,
    })
    type: NotificationType;

    @Column({ type: 'varchar' })
    recipient: string; // Email address

    @CreateDateColumn({ name: 'sent_at' })
    sentAt: Date;

    // Relations
    @ManyToOne(() => Order)
    @JoinColumn({ name: 'order_id' })
    order: Order;
}
