/**
 * Ticket Card Component
 * Mobile-friendly card layout for tickets list
 */

import Link from 'next/link';
import { FiMessageSquare, FiClock, FiUser, FiPackage } from 'react-icons/fi';

interface TicketCardProps {
    ticket: any;
    getStatusStyle: (status: string) => string;
    getPriorityStyle: (priority: string) => string;
    getTimeAgo: (date: string) => string;
}

export function TicketCard({ ticket, getStatusStyle, getPriorityStyle, getTimeAgo }: TicketCardProps) {
    return (
        <Link href={`/admin/tickets/${ticket.id}`}>
            <div className="bg-white rounded-lg border border-gray-200 p-3 hover:shadow-md transition-all active:scale-[0.98]">
                {/* Header */}
                <div className="flex items-start justify-between mb-2">
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                            <span className="text-sm font-bold font-mono text-black">
                                {ticket.ticketNumber}
                            </span>
                            {!ticket.firstViewedAt && (
                                <span className="bg-red-500 text-white px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wide">
                                    NEW
                                </span>
                            )}
                            <span className={`text-[9px] uppercase font-bold px-2 py-0.5 rounded border ${getStatusStyle(ticket.status)}`}>
                                {ticket.status.replace(/_/g, ' ')}
                            </span>
                        </div>
                        <p className="text-sm text-gray-700 line-clamp-2 mb-1.5">
                            {ticket.subject}
                        </p>
                    </div>
                </div>

                {/* Priority Badge */}
                <div className="mb-2">
                    <span className={`text-[9px] uppercase font-bold px-2 py-0.5 rounded ${getPriorityStyle(ticket.priority)}`}>
                        {ticket.priority} Priority
                    </span>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-100">
                    <div>
                        <div className="flex items-center gap-1 text-gray-400 mb-1">
                            <FiUser className="w-3 h-3" />
                            <span className="text-[10px] uppercase font-bold">Customer</span>
                        </div>
                        <p className="text-xs font-medium text-black truncate">
                            {ticket.user?.name || 'Customer'}
                        </p>
                        <p className="text-[10px] text-gray-500 truncate">
                            {ticket.user?.email}
                        </p>
                    </div>
                    <div>
                        <div className="flex items-center gap-1 text-gray-400 mb-1">
                            <FiPackage className="w-3 h-3" />
                            <span className="text-[10px] uppercase font-bold">Order</span>
                        </div>
                        <p className="text-xs font-medium text-black">
                            {ticket.order?.orderNumber || 'N/A'}
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
                    <div className="flex items-center gap-1 text-gray-500">
                        <FiClock className="w-3 h-3" />
                        <span className="text-xs">{getTimeAgo(ticket.updatedAt)}</span>
                    </div>
                    <span className="text-xs font-medium text-black">
                        Handle →
                    </span>
                </div>
            </div>
        </Link>
    );
}
