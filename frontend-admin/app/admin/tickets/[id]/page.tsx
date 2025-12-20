/**
 * Ticket Detail Page (FRONTEND-ONLY)
 * 
 * RULES:
 * - No send logic yet (UI state only)
 * - No workflow enforcement
 * - RBAC can be UI-disabled for now
 * - Backend will control permissions & actions later
 */

'use client';

import { useParams } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';

type TicketStatus = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
type TicketPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

interface Message {
    id: string;
    from: 'USER' | 'ADMIN';
    text: string;
    timestamp: Date;
    adminEmail?: string;
}

interface Ticket {
    id: string;
    subject: string;
    userEmail: string;
    userName: string;
    status: TicketStatus;
    priority: TicketPriority;
    category: string;
    orderId?: string;
    createdAt: Date;
    messages: Message[];
}

export default function TicketDetailPage() {
    const params = useParams();
    const ticketId = params.id as string;

    // Mock data (UI-only)
    const [ticket] = useState<Ticket>({
        id: ticketId,
        subject: 'Order not delivered',
        userEmail: 'user@gmail.com',
        userName: 'John Doe',
        status: 'OPEN',
        priority: 'HIGH',
        category: 'SHIPPING',
        orderId: 'ORD-001',
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        messages: [
            {
                id: '1',
                from: 'USER',
                text: 'I ordered a t-shirt 5 days ago but it hasn\'t been delivered yet. Order ID: ORD-001',
                timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
            },
            {
                id: '2',
                from: 'ADMIN',
                text: 'Hi John, I\'m looking into this for you. Let me check with our shipping partner.',
                timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
                adminEmail: 'support@humantee.com',
            },
        ],
    });

    const [replyText, setReplyText] = useState('');
    const [newStatus, setNewStatus] = useState(ticket.status);
    const [newPriority, setNewPriority] = useState(ticket.priority);

    const handleSendReply = () => {
        // UI-only: No actual send logic
        if (!replyText.trim()) return;

        console.log('Reply (UI-only):', replyText);
        alert('Reply sent! (UI-only, no backend)');
        setReplyText('');
    };

    const handleStatusChange = () => {
        // UI-only: No workflow enforcement
        console.log('Status changed to:', newStatus);
        alert(`Status updated to ${newStatus}! (UI-only)`);
    };

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

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <Link
                    href="/admin/tickets"
                    className="text-sm text-gray-600 hover:text-black mb-3 inline-block"
                >
                    ← Back to tickets
                </Link>
                <div>
                    <h1 className="text-xl sm:text-2xl font-semibold text-black">
                        Ticket #{ticket.id}
                    </h1>
                    <p className="text-xs sm:text-sm text-gray-600 mt-1">
                        {ticket.subject}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Panel - Messages */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Message Thread */}
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold text-black mb-4">Conversation</h2>
                        <div className="space-y-4 mb-6">
                            {ticket.messages.map((message) => (
                                <div
                                    key={message.id}
                                    className={`flex ${message.from === 'ADMIN' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-[80%] rounded-lg p-4 ${message.from === 'ADMIN'
                                                ? 'bg-black text-white'
                                                : 'bg-gray-100 text-black'
                                            }`}
                                    >
                                        <div className="text-sm">{message.text}</div>
                                        <div
                                            className={`text-xs mt-2 ${message.from === 'ADMIN' ? 'text-gray-300' : 'text-gray-600'
                                                }`}
                                        >
                                            {message.from === 'ADMIN' && message.adminEmail && (
                                                <span>{message.adminEmail} • </span>
                                            )}
                                            {message.timestamp.toLocaleString()}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Reply Box */}
                        <div className="border-t border-gray-200 pt-4">
                            <label className="block text-sm font-medium text-gray-900 mb-2">
                                Reply to Customer
                            </label>
                            <textarea
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                rows={4}
                                placeholder="Type your reply..."
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none"
                            />
                            <div className="flex justify-between items-center mt-3">
                                <button className="text-sm text-gray-600 hover:text-black">
                                    📎 Attach File (UI only)
                                </button>
                                <button
                                    onClick={handleSendReply}
                                    disabled={!replyText.trim()}
                                    className="bg-black hover:bg-gray-900 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Send Reply
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Panel - Metadata & Actions */}
                <div className="space-y-6">
                    {/* Ticket Metadata */}
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold text-black mb-4">Ticket Details</h2>
                        <div className="space-y-3">
                            <div>
                                <div className="text-sm text-gray-600 mb-1">Status</div>
                                <select
                                    value={newStatus}
                                    onChange={(e) => setNewStatus(e.target.value as TicketStatus)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-black focus:border-black outline-none"
                                >
                                    <option value="OPEN">Open</option>
                                    <option value="IN_PROGRESS">In Progress</option>
                                    <option value="RESOLVED">Resolved</option>
                                    <option value="CLOSED">Closed</option>
                                </select>
                            </div>
                            <div>
                                <div className="text-sm text-gray-600 mb-1">Priority</div>
                                <select
                                    value={newPriority}
                                    onChange={(e) => setNewPriority(e.target.value as TicketPriority)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-black focus:border-black outline-none"
                                >
                                    <option value="LOW">Low</option>
                                    <option value="MEDIUM">Medium</option>
                                    <option value="HIGH">High</option>
                                    <option value="URGENT">Urgent</option>
                                </select>
                            </div>
                            <div>
                                <div className="text-sm text-gray-600 mb-1">Category</div>
                                <div className="text-black font-medium">{ticket.category}</div>
                            </div>
                            <button
                                onClick={handleStatusChange}
                                className="w-full bg-black hover:bg-gray-900 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm"
                            >
                                Update Ticket
                            </button>
                        </div>
                    </div>

                    {/* Customer Info */}
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold text-black mb-4">Customer</h2>
                        <div className="space-y-2">
                            <div>
                                <div className="text-sm text-gray-600 mb-1">Name</div>
                                <div className="text-black font-medium">{ticket.userName}</div>
                            </div>
                            <div>
                                <div className="text-sm text-gray-600 mb-1">Email</div>
                                <div className="text-black">{ticket.userEmail}</div>
                            </div>
                            {ticket.orderId && (
                                <div>
                                    <div className="text-sm text-gray-600 mb-1">Related Order</div>
                                    <Link
                                        href={`/admin/orders/${ticket.orderId}`}
                                        className="text-black font-medium hover:underline"
                                    >
                                        {ticket.orderId}
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold text-black mb-4">Quick Actions</h2>
                        <div className="space-y-2">
                            <button className="w-full text-left px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                                Mark In Progress
                            </button>
                            <button className="w-full text-left px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                                Mark Resolved
                            </button>
                            <button className="w-full text-left px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                                Close Ticket
                            </button>
                        </div>
                        <p className="text-xs text-gray-600 mt-3">
                            ⚠️ UI-only. Backend will control permissions later.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
