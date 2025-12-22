import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
    JoinColumn,
} from 'typeorm';
import { Ticket } from './ticket.entity';
import { AuthUser } from './auth-user.entity';

@Entity('ticket_messages')
export class TicketMessage {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'ticket_id' })
    ticketId: string;

    @ManyToOne(() => Ticket, (ticket) => ticket.messages, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'ticket_id' })
    ticket: Ticket;

    @Column({ name: 'user_id' })
    userId: string;

    @ManyToOne(() => AuthUser)
    @JoinColumn({ name: 'user_id' })
    user: AuthUser;

    @Column({ type: 'text' })
    message: string;

    @Column({ name: 'is_admin_reply', default: false })
    isAdminReply: boolean;

    @Column({ type: 'jsonb', nullable: true })
    attachments: { url: string; name: string }[] | null;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    constructor(partial?: Partial<TicketMessage>) {
        if (partial) {
            Object.assign(this, partial);
        }
    }
}
