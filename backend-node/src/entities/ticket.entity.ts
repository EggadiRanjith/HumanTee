import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    OneToMany,
    CreateDateColumn,
    UpdateDateColumn,
    JoinColumn,
} from 'typeorm';
import { AuthUser } from './auth-user.entity';
import { Order } from './order.entity';
import { TicketMessage } from './ticket-message.entity';
import { TicketStatusHistory } from './ticket-status-history.entity';

export enum TicketStatus {
    OPEN = 'open',
    IN_PROGRESS = 'in_progress',
    WAITING_ON_CUSTOMER = 'waiting_on_customer',
    RESOLVED = 'resolved',
    CLOSED = 'closed',
}

export enum TicketPriority {
    LOW = 'low',
    MEDIUM = 'medium',
    HIGH = 'high',
    URGENT = 'urgent',
}

export enum TicketCategory {
    WRONG_ITEM = 'wrong_item',
    DAMAGED_PRODUCT = 'damaged_product',
    LATE_DELIVERY = 'late_delivery',
    MISSING_ITEMS = 'missing_items',
    QUALITY_ISSUE = 'quality_issue',
    OTHER = 'other',
}

@Entity('tickets')
export class Ticket {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true, name: 'ticket_number', length: 32 })
    ticketNumber: string;

    @Column({ name: 'order_id' })
    orderId: string;

    // RESTRICT prevents accidental order deletion from destroying ticket history
    @ManyToOne(() => Order, { onDelete: 'RESTRICT' })
    @JoinColumn({ name: 'order_id' })
    order: Order;

    @Column({ name: 'user_id' })
    userId: string;

    // RESTRICT prevents user deletion from destroying support history
    @ManyToOne(() => AuthUser, { onDelete: 'RESTRICT' })
    @JoinColumn({ name: 'user_id' })
    user: AuthUser;

    @Column({ name: 'assigned_to', nullable: true })
    assignedTo: string | null;

    // Admin user assigned to handle this ticket
    @ManyToOne(() => AuthUser, { onDelete: 'SET NULL' })
    @JoinColumn({ name: 'assigned_to' })
    assignedAdmin: AuthUser | null;

    // Validated at application layer for flexibility
    @Column({ length: 50 })
    category: string;

    @Column({ length: 200 })
    subject: string;

    @Column({ type: 'text' })
    description: string;

    @Column({
        type: 'enum',
        enum: TicketStatus,
        default: TicketStatus.OPEN,
    })
    status: TicketStatus;

    // Validated at application layer for flexibility
    @Column({ length: 20, default: 'medium' })
    priority: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    @Column({ type: 'timestamp', nullable: true, name: 'resolved_at' })
    resolvedAt: Date | null;

    @Column({ type: 'timestamp', nullable: true, name: 'closed_at' })
    closedAt: Date | null;

    @Column({ type: 'timestamp', nullable: true, name: 'first_viewed_at' })
    firstViewedAt: Date | null;

    // Relations
    @OneToMany(() => TicketMessage, (message) => message.ticket, { cascade: true })
    messages: TicketMessage[];

    @OneToMany(() => TicketStatusHistory, (history) => history.ticket, { cascade: true })
    statusHistory: TicketStatusHistory[];

    constructor(partial?: Partial<Ticket>) {
        if (partial) {
            Object.assign(this, partial);
        }
    }
}
