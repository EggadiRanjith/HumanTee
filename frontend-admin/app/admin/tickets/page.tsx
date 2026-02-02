'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { useAdminTickets } from '@/lib/queries/useTickets';
import { TicketsHeader, TicketsSkeleton, TicketsEmpty, TicketsError, TicketCard } from './components';
import { FiSearch, FiFilter, FiLoader, FiAlertCircle, FiRotateCw, FiCheckCircle, FiMessageSquare, FiClock } from 'react-icons/fi';
import { FeatureDisabledModal } from '@/components/modals/FeatureDisabledModal';
import { getSystemFeatures } from '@/lib/api/system-features';

export default function TicketsPage() {
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [priorityFilter, setPriorityFilter] = useState('ALL');
    const [searchQuery, setSearchQuery] = useState('');
    // Sanitize search input for security
    const sanitizedSearch = searchQuery.trim().replace(/[<>"']/g, '');
    const [ticketsEnabled, setTicketsEnabled] = useState(true);
    const [ticketsDisabledSince, setTicketsDisabledSince] = useState<string>();

    // Use React Query hook - automatic caching and loading states
    const { data: tickets = [], isLoading, error, refetch } = useAdminTickets({
        status: statusFilter !== 'ALL' ? statusFilter.toLowerCase() : undefined,
        priority: priorityFilter !== 'ALL' ? priorityFilter.toLowerCase() : undefined,
        search: sanitizedSearch || undefined,
    });

    // Check if tickets are enabled
    useEffect(() => {
        async function checkFeatures() {
            try {
                const features = await getSystemFeatures();
                setTicketsEnabled(features.ticketsEnabled);
                setTicketsDisabledSince(features.ticketsDisabledSince);
            } catch (error) {
                // Ignore error, assume enabled
            }
        }
        checkFeatures();
    }, []);

    // Calculate stats - MUST be before conditional returns to maintain hook order
    const stats = useMemo(() => {
        return {
            open: tickets.filter((t: any) => t.status === 'open').length,
            inProgress: tickets.filter((t: any) => t.status === 'in_progress').length,
            waiting: tickets.filter((t: any) => t.status === 'waiting_on_customer').length,
            resolved: tickets.filter((t: any) => t.status === 'resolved' || t.status === 'closed').length
        };
    }, [tickets]);

    // Loading state
    if (isLoading) return <TicketsSkeleton />;

    // Error state
    if (error) return <TicketsError error={error} onRetry={() => refetch()} />;

    // Empty state
    if (tickets.length === 0) return <TicketsEmpty />;

    const getStatusStyle = (status: string) => {
        switch (status.toLowerCase()) {
            case 'open':
                return 'bg-orange-100 text-orange-700 border-orange-200';
            case 'in_progress':
                return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'waiting_on_customer':
                return 'bg-purple-100 text-purple-700 border-purple-200';
            case 'resolved':
                return 'bg-green-100 text-green-700 border-green-200';
            case 'closed':
                return 'bg-gray-100 text-gray-700 border-gray-200';
            default:
                return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    const getPriorityStyle = (priority: string) => {
        switch (priority.toLowerCase()) {
            case 'urgent':
                return 'bg-red-100 text-red-700 font-bold';
            case 'high':
                return 'bg-orange-100 text-orange-700';
            case 'medium':
                return 'bg-yellow-100 text-yellow-700';
            case 'low':
                return 'bg-gray-100 text-gray-700';
            default:
                return 'bg-gray-100 text-gray-700';
        }
    };

    const getTimeAgo = (dateStr: string) => {
        const date = new Date(dateStr);
        const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
        if (seconds < 60) return `${seconds}s ago`;
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes}m ago`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours}h ago`;
        const days = Math.floor(hours / 24);
        return `${days}d ago`;
    };

    return (
        <div className="space-y-4 md:space-y-6">
            {/* Feature Disabled Modal */}
            {!ticketsEnabled && (
                <FeatureDisabledModal
                    featureName="Support Tickets"
                    disabledSince={ticketsDisabledSince}
                    message="The support ticket system has been disabled. Users cannot create new support tickets."
                    settingsPath="/admin/settings/system"
                />
            )}

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 md:gap-4">
                <div>
                    <h1 className="text-lg md:text-xl lg:text-2xl font-semibold text-black">Support Tickets</h1>
                    <p className="text-xs md:text-sm text-gray-500 mt-1">Manage and respond to customer requests</p>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => refetch()}
                        className="p-1.5 md:p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                        title="Refresh"
                    >
                        <FiRotateCw className={`w-4 h-4 md:w-5 md:h-5 ${isLoading ? 'animate-spin' : ''}`} />
                    </button>
                </div>
            </div>

            {/* Stats Cards - Compact Mobile */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 md:gap-4">
                <div className="bg-white p-2.5 md:p-4 rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex items-center gap-2 md:gap-3 text-orange-600 mb-1">
                        <FiMessageSquare className="w-3 h-3 md:w-4 md:h-4" />
                        <span className="text-[10px] md:text-xs font-medium uppercase tracking-wider">Open</span>
                    </div>
                    <div className="text-xl md:text-2xl font-bold text-black">{stats.open}</div>
                </div>
                <div className="bg-white p-2.5 md:p-4 rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex items-center gap-2 md:gap-3 text-blue-600 mb-1">
                        <FiClock className="w-3 h-3 md:w-4 md:h-4" />
                        <span className="text-[10px] md:text-xs font-medium uppercase tracking-wider">In Progress</span>
                    </div>
                    <div className="text-xl md:text-2xl font-bold text-black">{stats.inProgress}</div>
                </div>
                <div className="bg-white p-2.5 md:p-4 rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex items-center gap-2 md:gap-3 text-purple-600 mb-1">
                        <FiAlertCircle className="w-3 h-3 md:w-4 md:h-4" />
                        <span className="text-[10px] md:text-xs font-medium uppercase tracking-wider">Waiting</span>
                    </div>
                    <div className="text-xl md:text-2xl font-bold text-black">{stats.waiting}</div>
                </div>
                <div className="bg-white p-2.5 md:p-4 rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex items-center gap-2 md:gap-3 text-green-600 mb-1">
                        <FiCheckCircle className="w-3 h-3 md:w-4 md:h-4" />
                        <span className="text-[10px] md:text-xs font-medium uppercase tracking-wider">Resolved</span>
                    </div>
                    <div className="text-xl md:text-2xl font-bold text-black">{stats.resolved}</div>
                </div>
            </div>

            {/* Filters Bar - Compact Mobile */}
            <div className="bg-white p-2.5 md:p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row gap-2 md:gap-4">
                <div className="relative flex-1">
                    <FiSearch className="absolute left-2.5 md:left-3 top-1/2 -translate-y-1/2 text-gray-400 w-3.5 h-3.5 md:w-4 md:h-4" />
                    <input
                        type="text"
                        placeholder="Search by ID, Subject, or Order Number..."
                        value={searchQuery}
                        onChange={(e: any) => setSearchQuery(e.target.value)}
                        className="w-full pl-8 md:pl-10 pr-3 md:pr-4 py-1.5 md:py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs md:text-sm focus:ring-2 focus:ring-black/5 focus:border-black outline-none transition-all"
                    />
                </div>
                <div className="flex gap-2">
                    <select
                        value={statusFilter}
                        onChange={(e: any) => setStatusFilter(e.target.value)}
                        className="px-2.5 md:px-3 py-1.5 md:py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs md:text-sm focus:ring-2 focus:ring-black/5 focus:border-black outline-none cursor-pointer"
                    >
                        <option value="ALL">All Status</option>
                        <option value="OPEN">Open</option>
                        <option value="IN_PROGRESS">In Progress</option>
                        <option value="WAITING_ON_CUSTOMER">Waiting</option>
                        <option value="RESOLVED">Resolved</option>
                        <option value="CLOSED">Closed</option>
                    </select>
                    <select
                        value={priorityFilter}
                        onChange={(e: any) => setPriorityFilter(e.target.value)}
                        className="px-2.5 md:px-3 py-1.5 md:py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs md:text-sm focus:ring-2 focus:ring-black/5 focus:border-black outline-none cursor-pointer"
                    >
                        <option value="ALL">All Priority</option>
                        <option value="URGENT">Urgent</option>
                        <option value="HIGH">High</option>
                        <option value="MEDIUM">Medium</option>
                        <option value="LOW">Low</option>
                    </select>
                </div>
            </div>

            {error && (
                <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 flex items-center gap-3 text-sm">
                    <FiAlertCircle className="w-5 h-5" />
                    {error}
                </div>
            )}

            {/* Desktop: Table */}
            <div className="hidden md:block bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50/50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">Ticket</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">Status</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">Priority</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">Customer</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">Last Activity</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {isLoading ? (
                                Array(5).fill(0).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan={6} className="px-6 py-8 bg-gray-50/20" />
                                    </tr>
                                ))
                            ) : tickets.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                        <FiMessageSquare className="w-8 h-8 mx-auto mb-3 opacity-20" />
                                        <p>No tickets found Matching your criteria</p>
                                    </td>
                                </tr>
                            ) : (
                                tickets.map((t: any) => (
                                    <tr key={t.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-black font-mono">{t.ticketNumber}</span>
                                                <span className="text-sm text-gray-600 mt-0.5 line-clamp-1">{t.subject}</span>
                                                <span className="text-[10px] text-gray-400 mt-1 uppercase tracking-wider">Order: {t.order?.orderNumber || 'N/A'}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 rounded-full text-[10px] uppercase font-bold border ${getStatusStyle(t.status)}`}>
                                                {t.status.replace(/_/g, ' ')}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 rounded-full text-[10px] uppercase font-bold ${getPriorityStyle(t.priority)}`}>
                                                {t.priority}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="text-sm text-black">{t.user?.name || 'Customer'}</span>
                                                <span className="text-[11px] text-gray-500">{t.user?.email}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {getTimeAgo(t.updatedAt)}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Link
                                                href={`/admin/tickets/${t.id}`}
                                                className="inline-flex items-center gap-2 px-4 py-1.5 border border-gray-200 rounded-lg text-xs font-medium hover:bg-black hover:text-white hover:border-black transition-all"
                                            >
                                                Handle
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Mobile: Cards - Compact */}
            <div className="md:hidden space-y-2.5 md:space-y-3">
                {tickets.map((ticket: any) => (
                    <TicketCard
                        key={ticket.id}
                        ticket={ticket}
                        getStatusStyle={getStatusStyle}
                        getPriorityStyle={getPriorityStyle}
                        getTimeAgo={getTimeAgo}
                    />
                ))}
            </div>
        </div>
    );
}


