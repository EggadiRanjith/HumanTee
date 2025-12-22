import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
    JoinColumn,
} from 'typeorm';
import { Ticket, TicketStatus } from './ticket.entity';
import { AuthUser } from './auth-user.entity';

@Entity('ticket_status_history')
export class TicketStatusHistory {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'ticket_id' })
    ticketId: string;

    @ManyToOne(() => Ticket, (ticket) => ticket.statusHistory, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'ticket_id' })
    ticket: Ticket;

    @Column({ name: 'from_status', type: 'varchar', length: 20, nullable: true })
    fromStatus: string | null;

    @Column({ name: 'to_status', type: 'varchar', length: 20 })
    toStatus: string;

    @Column({ name: 'changed_by' })
    changedBy: string;

    @ManyToOne(() => AuthUser, { onDelete: 'RESTRICT' })
    @JoinColumn({ name: 'changed_by' })
    changedByUser: AuthUser;

    @Column({ type: 'text', nullable: true })
    note: string | null;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    constructor(partial?: Partial<TicketStatusHistory>) {
        if (partial) {
            Object.assign(this, partial);
        }
    }
}
