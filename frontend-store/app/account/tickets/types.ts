/**
 * Support Tickets Types
 * Complete type definitions for ticket data
 */

export type TicketStatus = 'open' | 'in_progress' | 'waiting_on_customer' | 'resolved' | 'closed';
export type TicketCategory = 'order' | 'product' | 'shipping' | 'payment' | 'other';
export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Ticket {
    id: string;
    ticketNumber: string;
    subject: string;
    category: TicketCategory;
    status: TicketStatus;
    priority?: TicketPriority;
    createdAt: string;
    updatedAt: string;
    orderId?: string;
    orderNumber?: string;
}

export interface TicketFilters {
    status?: TicketStatus | 'all';
    category?: TicketCategory | 'all';
    search?: string;
    sortBy?: 'newest' | 'oldest' | 'priority-high' | 'priority-low';
    page?: number;
    limit?: number;
    orderId?: string;
}
