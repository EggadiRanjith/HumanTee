/**
 * Ticket Card Component
 * Individual ticket display with status and details
 */

import Link from 'next/link';
import { memo } from 'react';
import { FiChevronRight } from 'react-icons/fi';
import { Ticket } from '../types';
import { getStatusConfig } from '../utils/ticketStatus';

interface TicketCardProps {
    ticket: Ticket;
}

const TicketCardComponent = ({ ticket }: TicketCardProps) => {
    const status = getStatusConfig(ticket.status);
    const StatusIcon = status.icon;

    return (
        <Link
            href={`/account/tickets/${ticket.id}`}
            className="group block p-5 rounded-2xl luxury-glass border border-white/10 bg-white/5 hover:bg-white/[0.08] transition-all"
        >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <span className="text-white font-medium tracking-wide">{ticket.ticketNumber}</span>
                        <div className={`px-2.5 py-1 rounded-full ${status.bg} ${status.text} flex items-center gap-1.5`}>
                            <StatusIcon className="w-3 h-3" />
                            <span className="text-[10px] uppercase font-bold tracking-wider">{status.label}</span>
                        </div>
                    </div>
                    <h3 className="text-white/80 text-sm font-light line-clamp-1 group-hover:text-white transition-colors">
                        {ticket.subject}
                    </h3>
                    <div className="flex items-center gap-4 text-[11px] text-white/30 uppercase tracking-widest">
                        <span>{new Date(ticket.createdAt).toLocaleDateString()}</span>
                        <span className="w-1 h-1 rounded-full bg-white/10" />
                        <span>Category: {ticket.category.replace('_', ' ')}</span>
                    </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 border-white/5 pt-4 sm:pt-0">
                    <div className="text-right">
                        <p className="text-white/40 text-[10px] uppercase tracking-widest">Last Activity</p>
                        <p className="text-white/60 text-xs mt-0.5">{new Date(ticket.updatedAt).toLocaleDateString()}</p>
                    </div>
                    <FiChevronRight className="w-5 h-5 text-white/20 group-hover:text-white/60 group-hover:translate-x-1 transition-all" />
                </div>
            </div>
        </Link>
    );
};

// Memoized export to prevent unnecessary re-renders
export const TicketCard = memo(TicketCardComponent, (prevProps, nextProps) => {
    return prevProps.ticket.id === nextProps.ticket.id;
});
