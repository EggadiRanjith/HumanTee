/**
 * Tickets List Page (FRONTEND-ONLY)
 * 
 * RULES:
 * - UI only, no workflow enforcement
 * - No backend assumptions
 * - Lifecycle clearly visualized
 * - Backend-ready for permissions & actions
 */

'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';

type TicketStatus = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
type TicketPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
type TicketCategory = 'ORDER' | 'PRODUCT' | 'SHIPPING' | 'PAYMENT' | 'OTHER';

interface Ticket {
    id: string;
    subject: string;
    userEmail: string;
    status: TicketStatus;
    priority: TicketPriority;
    category: TicketCategory;
    createdAt: Date;
    orderId?: string;
}

// Mock data (UI-only)
const mockTickets: Ticket[] = [
    {
        id: 'TCK-1023',
        subject: 'Order not delivered',
        userEmail: 'user@gmail.com',
        status: 'OPEN',
        priority: 'HIGH',
        category: 'SHIPPING',
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        orderId: 'ORD-001',
    },
    {
        id: 'TCK-1022',
        subject: 'Product size issue',
        userEmail: 'customer@example.com',
        status: 'IN_PROGRESS',
        priority: 'MEDIUM',
        category: 'PRODUCT',
        createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
    },
    {
        id: 'TCK-1021',
        subject: 'Payment failed but amount deducted',
        userEmail: 'john@example.com',
        status: 'RESOLVED',
        priority: 'URGENT',
        category: 'PAYMENT',
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
        orderId: 'ORD-002',
    },
];

export default function TicketsListPage() {
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [priorityFilter, setPriorityFilter] = useState('ALL');
    const [searchQuery, setSearchQuery] = useState('');

    const filteredTickets = useMemo(() => {
        let filtered = mockTickets;

        if (statusFilter !== 'ALL') {
            filtered = filtered.filter((t) => t.status === statusFilter);
        }

        if (priorityFilter !== 'ALL') {
            filtered = filtered.filter((t) => t.priority === priorityFilter);
        }

        if (searchQuery) {
            filtered = filtered.filter(
                (t) =>
                    t.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    t.userEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    t.id.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        return filtered;
    }, [statusFilter, priorityFilter, searchQuery]);

    const getStatusColor = (status: TicketStatus) => {
        switch (status) {
            case 'OPEN':
                return 'bg-orange-100 text-orange-700';
            case 'IN_PROGRESS':
                return 'bg-blue-100 text-blue-700';
            case 'RESOLVED':
                return 'bg-green-100 text-green-700';
            case 'CLOSED':
                return 'bg-gray-100 text-gray-700';
            default:
                return 'bg-gray-100 text-gray-700';
        }
    };

    const getPriorityColor = (priority: TicketPriority) => {
        switch (priority) {
            case 'URGENT':
                return 'bg-red-100 text-red-700';
            case 'HIGH':
                return 'bg-orange-100 text-orange-700';
            case 'MEDIUM':
                return 'bg-yellow-100 text-yellow-700';
            case 'LOW':
                return 'bg-gray-100 text-gray-700';
            default:
                return 'bg-gray-100 text-gray-700';
        }
    };

    const getTimeAgo = (date: Date) => {
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
        <div className="space-y-4 sm:space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-xl sm:text-2xl font-semibold text-black">Support Tickets</h1>
                <p className="text-xs sm:text-sm text-gray-600 mt-1">
                    Manage customer support requests
                </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4">
                    <div className="text-xs sm:text-sm text-gray-600 mb-1">Open</div>
                    <div className="text-lg sm:text-2xl font-semibold text-orange-600">
                        {mockTickets.filter((t) => t.status === 'OPEN').length}
                    </div>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4">
                    <div className="text-xs sm:text-sm text-gray-600 mb-1">In Progress</div>
                    <div className="text-lg sm:text-2xl font-semibold text-blue-600">
                        {mockTickets.filter((t) => t.status === 'IN_PROGRESS').length}
                    </div>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4">
                    <div className="text-xs sm:text-sm text-gray-600 mb-1">Resolved</div>
                    <div className="text-lg sm:text-2xl font-semibold text-green-600">
                        {mockTickets.filter((t) => t.status === 'RESOLVED').length}
                    </div>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4">
                    <div className="text-xs sm:text-sm text-gray-600 mb-1">Closed</div>
                    <div className="text-lg sm:text-2xl font-semibold text-gray-600">
                        {mockTickets.filter((t) => t.status === 'CLOSED').length}
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <input
                        type="text"
                        placeholder="Search tickets..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-black focus:border-black outline-none"
                    />
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-black focus:border-black outline-none"
                    >
                        <option value="ALL">All Status</option>
                        <option value="OPEN">Open</option>
                        <option value="IN_PROGRESS">In Progress</option>
                        <option value="RESOLVED">Resolved</option>
                        <option value="CLOSED">Closed</option>
                    </select>
                    <select
                        value={priorityFilter}
                        onChange={(e) => setPriorityFilter(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-black focus:border-black outline-none"
                    >
                        <option value="ALL">All Priority</option>
                        <option value="URGENT">Urgent</option>
                        <option value="HIGH">High</option>
                        <option value="MEDIUM">Medium</option>
                        <option value="LOW">Low</option>
                    </select>
                </div>
            </div>

            {/* Tickets Table (Desktop) */}
            <div className="hidden lg:block bg-white rounded-lg border border-gray-200 overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="text-left px-6 py-3 text-xs font-medium text-gray-600 uppercase">
                                Ticket ID
                            </th>
                            <th className="text-left px-6 py-3 text-xs font-medium text-gray-600 uppercase">
                                Subject
                            </th>
                            <th className="text-left px-6 py-3 text-xs font-medium text-gray-600 uppercase">
                                User
                            </th>
                            <th className="text-left px-6 py-3 text-xs font-medium text-gray-600 uppercase">
                                Status
                            </th>
                            <th className="text-left px-6 py-3 text-xs font-medium text-gray-600 uppercase">
                                Priority
                            </th>
                            <th className="text-left px-6 py-3 text-xs font-medium text-gray-600 uppercase">
                                SLA
                            </th>
                            <th className="text-left px-6 py-3 text-xs font-medium text-gray-600 uppercase">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {filteredTickets.map((ticket) => (
                            <tr key={ticket.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="text-sm font-mono text-black">{ticket.id}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-sm font-medium text-black">{ticket.subject}</div>
                                    <div className="text-xs text-gray-600">{ticket.category}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-sm text-gray-600">{ticket.userEmail}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <span
                                        className={`px-2 py-1 text-xs font-medium rounded ${getStatusColor(
                                            ticket.status
                                        )}`}
                                    >
                                        {ticket.status.replace('_', ' ')}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <span
                                        className={`px-2 py-1 text-xs font-medium rounded ${getPriorityColor(
                                            ticket.priority
                                        )}`}
                                    >
                                        {ticket.priority}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-sm text-gray-600">⏱️ {getTimeAgo(ticket.createdAt)}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <Link
                                        href={`/admin/tickets/${ticket.id}`}
                                        className="text-sm text-black hover:underline font-medium"
                                    >
                                        View
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Tickets Cards (Mobile) */}
            <div className="lg:hidden space-y-3">
                {filteredTickets.map((ticket) => (
                    <div key={ticket.id} className="bg-white rounded-lg border border-gray-200 p-4">
                        <div className="flex justify-between items-start mb-3">
                            <div>
                                <div className="text-sm font-mono text-black">{ticket.id}</div>
                                <div className="text-sm font-medium text-black mt-1">{ticket.subject}</div>
                                <div className="text-xs text-gray-600 mt-1">{ticket.userEmail}</div>
                            </div>
                            <span
                                className={`px-2 py-1 text-xs font-medium rounded ${getStatusColor(ticket.status)}`}
                            >
                                {ticket.status.replace('_', ' ')}
                            </span>
                        </div>
                        <div className="flex items-center gap-2 mb-3">
                            <span className={`px-2 py-1 text-xs font-medium rounded ${getPriorityColor(ticket.priority)}`}>
                                {ticket.priority}
                            </span>
                            <span className="text-xs text-gray-600">⏱️ {getTimeAgo(ticket.createdAt)}</span>
                        </div>
                        <Link
                            href={`/admin/tickets/${ticket.id}`}
                            className="text-sm text-black hover:underline font-medium"
                        >
                            View Ticket
                        </Link>
                    </div>
                ))}
            </div>

            {/* Empty State */}
            {filteredTickets.length === 0 && (
                <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                    <div className="text-4xl mb-4">🎫</div>
                    <h3 className="text-lg font-medium text-black mb-2">No tickets found</h3>
                    <p className="text-sm text-gray-600 mb-4">Try adjusting your filters</p>
                    <button
                        onClick={() => {
                            setSearchQuery('');
                            setStatusFilter('ALL');
                            setPriorityFilter('ALL');
                        }}
                        className="text-sm text-black hover:underline font-medium"
                    >
                        Clear filters
                    </button>
                </div>
            )}
        </div>
    );
}
