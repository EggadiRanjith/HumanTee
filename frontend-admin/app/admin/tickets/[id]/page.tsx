'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import apiClient from '@/lib/api-client';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import {
    FiArrowLeft, FiSend, FiClock, FiCheckCircle,
    FiAlertCircle, FiUser, FiShield, FiLoader,
    FiMessageSquare, FiPaperclip, FiInfo, FiTrendingUp
} from 'react-icons/fi';

export default function TicketDetailPage() {
    const params = useParams();
    const router = useRouter();
    const queryClient = useQueryClient();
    const ticketId = params.id as string;
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const [ticket, setTicket] = useState<any | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isActionLoading, setIsActionLoading] = useState(false);
    const [replyText, setReplyText] = useState('');
    const [error, setError] = useState<string | null>(null);

    // Form states for updates
    const [status, setStatus] = useState('');
    const [priority, setPriority] = useState('');
    const [assignedTo, setAssignedTo] = useState('');
    const [updateNote, setUpdateNote] = useState('');

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });
    };

    useEffect(() => {
        fetchTicket();
    }, [ticketId]);

    useEffect(() => {
        if (ticket?.messages) {
            scrollToBottom();
        }
    }, [ticket?.messages]);

    const fetchTicket = async () => {
        setIsLoading(true);
        try {
            const response = await apiClient.get(`/admin/tickets/${ticketId}`);
            const data = response.data;
            setTicket(data);
            setStatus(data.status);
            setPriority(data.priority);
            setAssignedTo(data.assignedTo || '');
        } catch (err: any) {
            // Failed to fetch ticket
            setError("Failed to load ticket details.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSendReply = async () => {
        if (!replyText.trim()) return;
        setIsActionLoading(true);
        try {
            await apiClient.post(`/admin/tickets/${ticketId}/reply`, {
                message: replyText,
                attachments: []
            });
            setReplyText('');
            await fetchTicket();
            // Invalidate tickets cache so list page shows updated data
            queryClient.invalidateQueries({ queryKey: ['admin-tickets'] });
            toast.success("Reply sent successfully!");
        } catch (err: any) {
            toast.error("Failed to send reply. Please try again.");
        } finally {
            setIsActionLoading(false);
        }
    };

    const handleUpdateTicket = async () => {
        setIsActionLoading(true);
        try {
            await apiClient.patch(`/admin/tickets/${ticketId}`, {
                status,
                priority,
                assignedTo: assignedTo || null,
                note: updateNote || `Updated ticket properties`
            });
            setUpdateNote('');
            await fetchTicket();
            // Invalidate tickets cache so list page shows updated data
            queryClient.invalidateQueries({ queryKey: ['admin-tickets'] });
            toast.success("Ticket updated successfully!");
        } catch (err: any) {
            // Failed to update ticket
            toast.error("Failed to update ticket attributes.");
        } finally {
            setIsActionLoading(false);
        }
    };

    const getStatusStyle = (s: string) => {
        switch (s?.toLowerCase()) {
            case 'open': return 'bg-orange-100 text-orange-700 border-orange-200';
            case 'in_progress': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'waiting_on_customer': return 'bg-purple-100 text-purple-700 border-purple-200';
            case 'resolved': return 'bg-green-100 text-green-700 border-green-200';
            case 'closed': return 'bg-gray-100 text-gray-700 border-gray-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <FiLoader className="w-8 h-8 animate-spin text-gray-400" />
            </div>
        );
    }

    if (!ticket) {
        return (
            <div className="text-center py-20">
                <FiAlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-black">Ticket not found</h3>
                <Link href="/admin/tickets" className="text-sm text-blue-600 hover:underline mt-2 inline-block">
                    Back to Tickets
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Top Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-3 sm:p-4 rounded-xl border border-gray-200 shadow-sm">
                <div className="flex items-center gap-4">
                    <Link href="/admin/tickets">
                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                            <FiArrowLeft className="w-5 h-5 text-gray-600" />
                        </button>
                    </Link>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                            <h1 className="text-xl font-bold text-black font-mono">{ticket.ticketNumber}</h1>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-bold border ${getStatusStyle(ticket.status)}`}>
                                {ticket.status.replace(/_/g, ' ')}
                            </span>
                        </div>
                        <p className="text-xs sm:text-sm text-gray-500 mt-0.5 line-clamp-1">{ticket.subject}</p>
                    </div>
                </div>
                <div className="flex gap-2 flex-wrap">
                    <button
                        onClick={() => router.push(`/admin/orders/${ticket.orderId}`)}
                        className="px-4 py-2 border border-gray-200 rounded-lg text-xs font-medium hover:bg-gray-50 transition-all flex items-center gap-2"
                    >
                        <FiTrendingUp className="w-3.5 h-3.5" /> View Order
                    </button>
                    <button
                        onClick={fetchTicket}
                        className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        <FiClock className={`w-4 h-4 ${isActionLoading ? 'animate-spin' : ''}`} />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Chat History */}
                <div className="lg:col-span-2 flex flex-col bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden" style={{ height: 'calc(100vh - 250px)', maxHeight: '700px', minHeight: '500px' }}>
                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50/30">
                        {ticket.messages?.map((msg: any) => {
                            const isAdmin = msg.isAdminReply;
                            return (
                                <div key={msg.id} className={`flex ${isAdmin ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`flex gap-3 max-w-[85%] ${isAdmin ? 'flex-row-reverse' : 'flex-row'}`}>
                                        <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${isAdmin ? 'bg-black text-white' : 'bg-blue-100 text-blue-600'}`}>
                                            {isAdmin ? <FiShield className="w-4 h-4" /> : <FiUser className="w-4 h-4" />}
                                        </div>
                                        <div className="space-y-1">
                                            <div className={`flex items-center gap-2 mb-1 ${isAdmin ? 'justify-end' : 'justify-start'}`}>
                                                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                                                    {isAdmin ? 'Admin' : (msg.user?.profile?.full_name || 'Customer')}
                                                </span>
                                                <span className="text-[10px] text-gray-400 font-mono">
                                                    {new Date(msg.createdAt).toLocaleString([], { hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'short' })}
                                                </span>
                                            </div>
                                            <div className={`p-4 rounded-2xl text-sm leading-relaxed ${isAdmin
                                                ? 'bg-black text-white rounded-tr-none'
                                                : 'bg-white text-black border border-gray-200 shadow-sm rounded-tl-none'
                                                }`}>
                                                {msg.message}

                                                {/* Attachments */}
                                                {msg.attachments && msg.attachments.length > 0 && (
                                                    <div className="mt-4 grid grid-cols-2 gap-2">
                                                        {msg.attachments.map((file: any, idx: number) => (
                                                            <a
                                                                key={idx}
                                                                href={file.url}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 bg-gray-50 hover:opacity-90 transition-opacity"
                                                            >
                                                                <img
                                                                    src={file.url}
                                                                    alt={file.name || 'Attachment'}
                                                                    className="w-full h-full object-cover"
                                                                />
                                                            </a>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Reply Input */}
                    <div className="p-4 border-t border-gray-100 bg-white">
                        <div className="relative">
                            <textarea
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                placeholder="Type your response to the customer..."
                                className="w-full pl-4 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-black/5 focus:border-black outline-none transition-all resize-none min-h-[100px]"
                            />
                            <button
                                onClick={handleSendReply}
                                disabled={!replyText.trim() || isActionLoading}
                                className="absolute right-3 bottom-3 p-3 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 transition-all shadow-md"
                            >
                                {isActionLoading ? <FiLoader className="w-5 h-5 animate-spin" /> : <FiSend className="w-5 h-5" />}
                            </button>
                        </div>
                        <div className="mt-2 flex items-center justify-between px-1">
                            <span className="text-[10px] text-gray-400 uppercase tracking-widest flex items-center gap-1.5 font-medium">
                                <FiInfo className="w-3 h-3" /> Customer will be notified via email
                            </span>
                            <button className="text-[10px] text-gray-400 hover:text-black uppercase tracking-widest font-medium transition-colors">
                                Use Template
                            </button>
                        </div>
                    </div>
                </div>

                {/* Sidebar Controls - Stack on mobile */}
                <div className="space-y-4 lg:space-y-6">

                    {/* Customer & Order Card */}
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                            Context
                        </h3>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                                    <FiUser className="w-5 h-5" />
                                </div>
                                <div className="flex-1 overflow-hidden">
                                    <p className="text-sm font-bold text-black truncate">{ticket.user?.profile?.full_name || 'Unknown'}</p>
                                    <p className="text-xs text-gray-500 truncate">{ticket.user?.email}</p>
                                </div>
                            </div>
                            <div className="pt-4 border-t border-gray-100">
                                <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-2 font-medium">Linked Order</p>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-mono text-black">{ticket.order?.orderNumber}</span>
                                    <Link href={`/admin/orders/${ticket.orderId}`} className="text-xs text-blue-600 hover:underline">
                                        Open →
                                    </Link>
                                </div>
                                <p className="text-[11px] text-gray-500 mt-1">
                                    Total: ₹{Number(ticket.order?.totalAmount || 0).toFixed(2)}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Management Controls */}
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mb-4">
                            Management
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <label className="text-[10px] text-gray-500 uppercase tracking-widest mb-1.5 block font-bold">Status</label>
                                <select
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-black transition-all cursor-pointer"
                                >
                                    <option value="open">Open</option>
                                    <option value="in_progress">In Progress</option>
                                    <option value="waiting_on_customer">Waiting</option>
                                    <option value="resolved">Resolved</option>
                                    <option value="closed">Closed</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-[10px] text-gray-500 uppercase tracking-widest mb-1.5 block font-bold">Priority</label>
                                <select
                                    value={priority}
                                    onChange={(e) => setPriority(e.target.value)}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-black transition-all cursor-pointer"
                                >
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
                                    <option value="urgent">Urgent</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-[10px] text-gray-500 uppercase tracking-widest mb-1.5 block font-bold">Assign To</label>
                                <input
                                    type="text"
                                    value={assignedTo}
                                    onChange={(e) => setAssignedTo(e.target.value)}
                                    placeholder="Admin User ID (UUID)"
                                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-black transition-all"
                                />
                            </div>
                            <div className="pt-2">
                                <textarea
                                    value={updateNote}
                                    onChange={(e) => setUpdateNote(e.target.value)}
                                    placeholder="Add a note for this change (optional)"
                                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-black transition-all resize-none mb-3"
                                    rows={2}
                                />
                                <button
                                    onClick={handleUpdateTicket}
                                    disabled={isActionLoading}
                                    className="w-full py-2.5 bg-black text-white rounded-lg text-xs font-bold uppercase tracking-[0.15em] hover:bg-gray-800 transition-all shadow-lg shadow-black/10 disabled:grayscale"
                                >
                                    {isActionLoading ? <FiLoader className="w-4 h-4 animate-spin mx-auto" /> : 'Apply Updates'}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Audit Log (Brief) */}
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mb-4 flex items-center justify-between">
                            Activity Log
                            <FiList className="w-3.5 h-3.5" />
                        </h3>
                        <div className="space-y-4">
                            {ticket.statusHistory?.slice(0, 5).map((log: any) => (
                                <div key={log.id} className="relative pl-5 border-l border-gray-100 pb-1">
                                    <div className="absolute left-[-4.5px] top-1.5 w-2 h-2 rounded-full bg-gray-200" />
                                    <p className="text-[11px] leading-relaxed text-gray-600">
                                        Status set to <span className="font-bold text-black uppercase text-[10px]">{log.toStatus.replace(/_/g, ' ')}</span>
                                    </p>
                                    <p className="text-[9px] text-gray-400 mt-0.5">
                                        {new Date(log.createdAt).toLocaleDateString()} • {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

import { FiList } from 'react-icons/fi';

