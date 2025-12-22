import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    OneToMany,
    OneToOne,
    CreateDateColumn,
    UpdateDateColumn,
    BeforeInsert,
    BeforeUpdate,
    JoinColumn,
} from 'typeorm';
import { AuthUser } from './auth-user.entity';
import { OrderItem } from './order-item.entity';
import { OrderAddress } from './order-address.entity';
import { Payment } from './payment.entity';
import { Shipment } from './shipment.entity';
import { OrderStatusHistory } from './order-status-history.entity';

export enum OrderStatus {
    PENDING_PAYMENT = 'pending_payment',
    PAYMENT_FAILED = 'payment_failed',
    PROCESSING = 'processing',
    SHIPPED = 'shipped',
    DELIVERED = 'delivered',
    CANCELLED = 'cancelled',
}

@Entity('orders')
export class Order {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true, name: 'order_number' })
    orderNumber: string;

    @Column({ name: 'user_id' })
    userId: string;

    @ManyToOne(() => AuthUser)
    @JoinColumn({ name: 'user_id' })
    user: AuthUser;

    @Column({
        type: 'enum',
        enum: OrderStatus,
        default: OrderStatus.PENDING_PAYMENT,
    })
    status: OrderStatus;

    // IMMUTABLE FINANCIAL FIELDS AFTER PAYMENT
    @Column({ type: 'decimal', precision: 10, scale: 2 })
    subtotal: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, name: 'tax_amount', default: 0 })
    taxAmount: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, name: 'shipping_amount', default: 0 })
    shippingAmount: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, name: 'discount_amount', default: 0 })
    discountAmount: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, name: 'total_amount' })
    totalAmount: number;

    @Column({ length: 3, default: 'INR' })
    currency: string;

    @Column({ type: 'timestamp', nullable: true, name: 'completed_at' })
    completedAt: Date | null;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    // Relations
    @OneToMany(() => OrderItem, (item) => item.order, { cascade: true })
    items: OrderItem[];

    @OneToOne(() => OrderAddress, (address) => address.order, { cascade: true })
    address: OrderAddress;

    @OneToMany(() => Payment, (payment) => payment.order, { cascade: true })
    payments: Payment[];

    @OneToMany(() => Shipment, (shipment) => shipment.order)
    shipments: Shipment[];

    @OneToMany(() => OrderStatusHistory, (history) => history.order)
    statusHistory: OrderStatusHistory[];

    // Track original financial values for immutability check
    private originalFinancials: {
        subtotal?: number;
        taxAmount?: number;
        shippingAmount?: number;
        discountAmount?: number;
        totalAmount?: number;
    } = {};

    @BeforeInsert()
    @BeforeUpdate()
    validateTotals() {
        const calculated =
            Number(this.subtotal) +
            Number(this.taxAmount) +
            Number(this.shippingAmount) -
            Number(this.discountAmount);

        const total = Number(this.totalAmount);

        // Allow 1 cent difference for rounding
        if (Math.abs(calculated - total) > 0.01) {
            throw new Error(
                `Order total mismatch: calculated ${calculated.toFixed(2)}, actual ${total.toFixed(2)}`
            );
        }
    }

    @BeforeUpdate()
    lockFinancials() {
        if (!this.completedAt) {
            return; // Not completed yet, allow changes
        }

        // Check if any financial field changed
        const financialFields = [
            'subtotal',
            'taxAmount',
            'shippingAmount',
            'discountAmount',
            'totalAmount',
        ];

        for (const field of financialFields) {
            if (
                this.originalFinancials[field] !== undefined &&
                this.originalFinancials[field] !== this[field]
            ) {
                throw new Error(
                    `Cannot modify ${field} after order completion. Order is immutable.`
                );
            }
        }
    }

    // Store original values after load
    constructor(partial?: Partial<Order>) {
        if (partial) {
            Object.assign(this, partial);
            this.storeOriginalFinancials();
        }
    }

    private storeOriginalFinancials() {
        this.originalFinancials = {
            subtotal: this.subtotal,
            taxAmount: this.taxAmount,
            shippingAmount: this.shippingAmount,
            discountAmount: this.discountAmount,
            totalAmount: this.totalAmount,
        };
    }
}
