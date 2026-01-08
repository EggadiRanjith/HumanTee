import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, Like } from 'typeorm';
import { Ticket, TicketMessage, TicketStatusHistory, TicketStatus } from '../entities';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { AddMessageDto } from './dto/add-message.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';

@Injectable()
export class TicketsService {
    constructor(
        @InjectRepository(Ticket)
        private ticketRepository: Repository<Ticket>,
        @InjectRepository(TicketMessage)
        private messageRepository: Repository<TicketMessage>,
        @InjectRepository(TicketStatusHistory)
        private statusHistoryRepository: Repository<TicketStatusHistory>,
    ) { }

    /**
     * Check if an active ticket exists for an order
     * Active = open, in_progress, or waiting_on_customer
     */
    async checkActiveTicket(orderId: string): Promise<{ hasActiveTicket: boolean; ticketId?: string }> {
        const activeTicket = await this.ticketRepository.findOne({
            where: {
                orderId,
                status: In([TicketStatus.OPEN, TicketStatus.IN_PROGRESS, TicketStatus.WAITING_ON_CUSTOMER]),
            },
        });

        return {
            hasActiveTicket: !!activeTicket,
            ticketId: activeTicket?.id,
        };
    }

    /**
     * Create a new ticket for an order
     * Prevents duplicate active tickets via DB constraint
     */
    async createTicket(userId: string, createTicketDto: CreateTicketDto): Promise<Ticket> {
        // Generate unique ticket number
        const ticketNumber = await this.generateTicketNumber();

        const ticket = this.ticketRepository.create({
            ticketNumber,
            orderId: createTicketDto.orderId,
            userId,
            category: createTicketDto.category,
            subject: createTicketDto.subject,
            description: createTicketDto.description,
            status: TicketStatus.OPEN,
            priority: 'medium',
        });

        try {
            const savedTicket = await this.ticketRepository.save(ticket);

            // Create initial message with description
            await this.messageRepository.save({
                ticketId: savedTicket.id,
                userId,
                message: createTicketDto.description,
                isAdminReply: false,
                attachments: createTicketDto.attachments || null,
            });

            // Create status history entry
            await this.statusHistoryRepository.save({
                ticketId: savedTicket.id,
                fromStatus: null,
                toStatus: TicketStatus.OPEN,
                changedBy: userId,
                note: 'Ticket created',
            });

            return savedTicket;
        } catch (error) {
            // Handle unique constraint violation (duplicate active ticket)
            if (error.code === '23505') {
                throw new BadRequestException('An active ticket already exists for this order');
            }
            throw error;
        }
    }

    /**
     * Get all tickets for a specific order
     */
    async getTicketsForOrder(orderId: string, userId: string): Promise<Ticket[]> {
        return this.ticketRepository.find({
            where: { orderId, userId },
            relations: ['messages', 'statusHistory'],
            order: { createdAt: 'DESC' },
        });
    }

    /**
     * Get ticket detail with full conversation
     */
    async getTicketDetail(ticketId: string, userId: string): Promise<Ticket> {
        const ticket = await this.ticketRepository.findOne({
            where: { id: ticketId, userId },
            relations: ['user', 'user.profile', 'messages', 'messages.user', 'messages.user.profile', 'statusHistory', 'statusHistory.changedByUser', 'order'],
        });

        if (!ticket) {
            throw new NotFoundException('Ticket not found');
        }

        return ticket;
    }

    /**
     * Add a message to a ticket
     */
    async addMessage(ticketId: string, userId: string, addMessageDto: AddMessageDto): Promise<TicketMessage> {
        const ticket = await this.ticketRepository.findOne({
            where: { id: ticketId, userId },
        });

        if (!ticket) {
            throw new NotFoundException('Ticket not found');
        }

        // Prevent messaging on closed/resolved tickets
        if (ticket.status === TicketStatus.CLOSED || ticket.status === TicketStatus.RESOLVED) {
            throw new BadRequestException(`Cannot add messages to ${ticket.status} tickets. Please create a new ticket if you need further assistance.`);
        }

        // Check 5-message limit safeguard
        const lastMessages = await this.messageRepository.find({
            where: { ticketId },
            order: { createdAt: 'DESC' },
            take: 5,
        });

        let consecutiveUserMessages = 0;
        for (const msg of lastMessages) {
            if (msg.isAdminReply) break;
            consecutiveUserMessages++;
        }

        if (consecutiveUserMessages >= 5) {
            throw new BadRequestException('You have reached the limit of 5 consecutive messages. Please wait for an admin response.');
        }

        const message = this.messageRepository.create({
            ticketId,
            userId,
            message: addMessageDto.message,
            isAdminReply: false,
            attachments: addMessageDto.attachments || null,
        });

        return this.messageRepository.save(message);
    }

    /**
     * ADMIN: Get all tickets with filters
     */
    async getAllTickets(filters?: {
        status?: TicketStatus;
        priority?: string;
        search?: string;
    }): Promise<Ticket[]> {
        const query = this.ticketRepository.createQueryBuilder('ticket')
            .leftJoinAndSelect('ticket.user', 'user')
            .leftJoinAndSelect('ticket.order', 'order')
            .leftJoinAndSelect('ticket.assignedAdmin', 'assignedAdmin');

        if (filters?.status) {
            query.andWhere('ticket.status = :status', { status: filters.status });
        }

        if (filters?.priority) {
            query.andWhere('ticket.priority = :priority', { priority: filters.priority });
        }

        if (filters?.search) {
            query.andWhere(
                '(ticket.ticketNumber LIKE :search OR ticket.subject LIKE :search OR order.orderNumber LIKE :search)',
                { search: `%${filters.search}%` },
            );
        }

        return query.orderBy('ticket.createdAt', 'DESC').getMany();
    }

    /**
     * ADMIN: Update ticket (status, priority, assignment)
     */
    async updateTicket(ticketId: string, adminId: string, updateTicketDto: UpdateTicketDto): Promise<Ticket> {
        const ticket = await this.ticketRepository.findOne({ where: { id: ticketId } });

        if (!ticket) {
            throw new NotFoundException('Ticket not found');
        }

        const oldStatus = ticket.status;

        // Update fields
        if (updateTicketDto.status) {
            ticket.status = updateTicketDto.status;
        }
        if (updateTicketDto.priority) {
            ticket.priority = updateTicketDto.priority;
        }
        if (updateTicketDto.assignedTo !== undefined) {
            ticket.assignedTo = updateTicketDto.assignedTo;
        }

        const updatedTicket = await this.ticketRepository.save(ticket);

        // Create status history if status changed
        if (updateTicketDto.status && oldStatus !== updateTicketDto.status) {
            await this.statusHistoryRepository.save({
                ticketId,
                fromStatus: oldStatus,
                toStatus: updateTicketDto.status,
                changedBy: adminId,
                note: updateTicketDto.note || null,
            });
        }

        return updatedTicket;
    }

    /**
     * ADMIN: Reply to ticket
     */
    async adminReply(ticketId: string, adminId: string, message: string, attachments?: any[]): Promise<TicketMessage> {
        const ticket = await this.ticketRepository.findOne({ where: { id: ticketId } });

        if (!ticket) {
            throw new NotFoundException('Ticket not found');
        }

        // Prevent admin replies on closed/resolved tickets
        if (ticket.status === TicketStatus.CLOSED || ticket.status === TicketStatus.RESOLVED) {
            throw new BadRequestException(`Cannot reply to ${ticket.status} tickets. Please reopen the ticket first if needed.`);
        }

        const reply = this.messageRepository.create({
            ticketId,
            userId: adminId,
            message,
            isAdminReply: true,
            attachments: attachments || null,
        });

        return this.messageRepository.save(reply);
    }

    /**
     * Generate unique ticket number (TKT-YYYYMMDD-XXXXX)
     */
    private async generateTicketNumber(): Promise<string> {
        const date = new Date();
        const dateStr = date.toISOString().split('T')[0].replace(/-/g, '');

        // Get count of tickets created today
        const count = await this.ticketRepository.count({
            where: {
                ticketNumber: Like(`TKT-${dateStr}-%`),
            },
        });

        const sequence = (count + 1).toString().padStart(5, '0');
        return `TKT-${dateStr}-${sequence}`;
    }
}
