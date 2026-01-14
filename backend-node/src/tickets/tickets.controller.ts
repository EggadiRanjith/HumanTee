import {
    Controller,
    Get,
    Post,
    Patch,
    Body,
    Param,
    Query,
    UseGuards,
    Request,
    UseInterceptors,
} from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { AddMessageDto } from './dto/add-message.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { AdminJwtGuard } from '../auth/guards/admin-jwt.guard';
import { AdminGuard } from '../auth/guards/admin.guard';
import { Throttle } from '@nestjs/throttler';
import { AuditInterceptor } from '../common/interceptors/audit.interceptor';

@Controller('tickets')
@UseGuards(JwtAuthGuard)
export class TicketsController {
    constructor(private readonly ticketsService: TicketsService) { }

    /**
     * Check if active ticket exists for an order
     * GET /api/tickets/check/:orderId
     */
    @Get('check/:orderId')
    async checkActiveTicket(@Param('orderId') orderId: string) {
        return this.ticketsService.checkActiveTicket(orderId);
    }

    /**
     * Create a new ticket
     * POST /api/tickets
     */
    @Post()
    async createTicket(@Request() req, @Body() createTicketDto: CreateTicketDto) {
        return this.ticketsService.createTicket(req.user.userId, createTicketDto);
    }

    /**
     * Get all tickets for a specific order
     * GET /api/tickets/order/:orderId
     */
    @Get('order/:orderId')
    async getTicketsForOrder(@Param('orderId') orderId: string, @Request() req) {
        return this.ticketsService.getTicketsForOrder(orderId, req.user.userId);
    }

    /**
     * Get ticket detail with paginated messages
     * GET /api/tickets/:ticketId?page=1&limit=20
     */
    @Get(':ticketId')
    async getTicketDetail(
        @Param('ticketId') ticketId: string,
        @Query('page') page?: string,
        @Query('limit') limit?: string,
        @Request() req?,
    ) {
        const pageNum = page ? parseInt(page, 10) : 1;
        const limitNum = limit ? parseInt(limit, 10) : 20;
        return this.ticketsService.getTicketDetail(ticketId, req.user.userId, pageNum, limitNum);
    }

    /**
     * Add message to ticket
     * POST /api/tickets/:ticketId/messages
     */
    @Throttle({ default: { limit: 1, ttl: 20000 } })
    @Post(':ticketId/messages')
    async addMessage(
        @Param('ticketId') ticketId: string,
        @Request() req,
        @Body() addMessageDto: AddMessageDto,
    ) {
        return this.ticketsService.addMessage(ticketId, req.user.userId, addMessageDto);
    }
}

/**
 * ADMIN CONTROLLER
 */
@Controller('admin/tickets')
@UseGuards(AdminJwtGuard, AdminGuard)
@UseInterceptors(AuditInterceptor)
export class AdminTicketsController {
    constructor(private readonly ticketsService: TicketsService) { }

    /**
     * Get all tickets with filters
     * GET /admin/tickets?status=open&priority=high&search=TKT-001
     */
    @Get()
    async getAllTickets(
        @Query('status') status?: string,
        @Query('priority') priority?: string,
        @Query('search') search?: string,
    ) {
        return this.ticketsService.getAllTickets({ status: status as any, priority, search });
    }

    /**
     * Get ticket detail (admin view) with paginated messages
     * GET /admin/tickets/:ticketId?page=1&limit=20
     */
    @Get(':ticketId')
    async getTicketDetail(
        @Param('ticketId') ticketId: string,
        @Query('page') page?: string,
        @Query('limit') limit?: string,
    ) {
        const pageNum = page ? parseInt(page, 10) : 1;
        const limitNum = limit ? parseInt(limit, 10) : 20;
        // Admin can view any ticket (no userId check)
        const ticket = await this.ticketsService.getTicketDetail(ticketId, null as any, pageNum, limitNum);
        return ticket;
    }

    /**
     * Update ticket (status, priority, assignment)
     * PATCH /admin/tickets/:ticketId
     */
    @Patch(':ticketId')
    async updateTicket(
        @Param('ticketId') ticketId: string,
        @Request() req,
        @Body() updateTicketDto: UpdateTicketDto,
    ) {
        return this.ticketsService.updateTicket(ticketId, req.user.userId, updateTicketDto);
    }

    /**
     * Admin reply to ticket
     * POST /admin/tickets/:ticketId/reply
     */
    @Post(':ticketId/reply')
    async adminReply(
        @Param('ticketId') ticketId: string,
        @Request() req,
        @Body() body: { message: string; attachments?: any[] },
    ) {
        return this.ticketsService.adminReply(ticketId, req.user.userId, body.message, body.attachments);
    }
}
