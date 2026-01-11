"use client";

import { useState, useEffect, use, useRef } from "react";
import { logError } from '@/lib/logger';
import { useRouter } from "next/navigation";
import {
    FiArrowLeft,
    FiSend,
    FiClock,
    FiCheckCircle,
    FiAlertCircle,
    FiUser,
    FiShield,
    FiLoader,
    FiMessageSquare,
    FiPaperclip,
    FiPlus,
    FiX
} from "react-icons/fi";
import Link from "next/link";
import apiClient from "@/lib/api-client";
import { useAuth } from "@/app/contexts/AuthContext";

// CRITICAL: Prevent any scrolling before component even renders
if (typeof window !== 'undefined') {
    window.history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);
}

export default function TicketDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const { id } = use(params);
    const { user, isAuthenticated, isLoading: authLoading } = useAuth();

    const [ticket, setTicket] = useState<any | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [newMessage, setNewMessage] = useState("");
    const [isSending, setIsSending] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [attachments, setAttachments] = useState<{ url: string; name: string; type: string; size: number }[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const [isInitialLoad, setIsInitialLoad] = useState(true);
    const MAX_IMAGES = 5;

    const scrollToBottom = () => {
        // Removed smooth behavior to prevent unwanted scrolling on page load
        messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
    };

    // Prevent browser scroll restoration - force scroll to top
    useEffect(() => {
        // Disable automatic scroll restoration
        if ('scrollRestoration' in window.history) {
            window.history.scrollRestoration = 'manual';
        }

        // Force immediate scroll to top without animation
        window.scrollTo(0, 0);

        // Cleanup: restore default behavior when component unmounts
        return () => {
            if ('scrollRestoration' in window.history) {
                window.history.scrollRestoration = 'auto';
            }
        };
    }, []);

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            router.push(`/login?redirect=/account/tickets/${id}`);
        }
    }, [authLoading, isAuthenticated, router]);

    useEffect(() => {
        const fetchTicket = async () => {
            try {
                const response = await apiClient.get(`/tickets/${id}`);
                setTicket(response.data);
                setIsInitialLoad(false);
            } catch (error) {
                logError(error, "Failed to fetch ticket");
                setError("Failed to load ticket details.");
            } finally {
                setIsLoading(false);
            }
        };

        if (isAuthenticated) {
            fetchTicket();
        }
    }, [isAuthenticated, id]);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const messagesContainerRef = useRef<HTMLDivElement>(null);

    // CRITICAL: Force messages container to stay at top on mount
    useEffect(() => {
        if (messagesContainerRef.current) {
            messagesContainerRef.current.scrollTop = 0;
        }
    }, [ticket]);

    useEffect(() => {
        // Auto-scroll to bottom when new messages arrive
        if (ticket?.messages && !isInitialLoad) {
            scrollToBottom();
        }
    }, [ticket?.messages, isInitialLoad]);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        const remainingSlots = MAX_IMAGES - attachments.length;
        if (remainingSlots <= 0) {
            setError(`Maximum ${MAX_IMAGES} images allowed.`);
            return;
        }

        const selectedFiles = Array.from(files).slice(0, remainingSlots);
        setIsUploading(true);
        setError(null);

        try {
            const uploadPromises = selectedFiles.map(async (file) => {
                const formData = new FormData();
                formData.append('file', file);
                const res = await apiClient.post('/upload/image', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                return {
                    url: res.data.url,
                    name: file.name,
                    type: file.type,
                    size: file.size
                };
            });

            const results = await Promise.all(uploadPromises);
            setAttachments(prev => [...prev, ...results]);
        } catch (err: any) {
            logError(err, "Upload failed");
            setError("Some images failed to upload. Please try again.");
        } finally {
            setIsUploading(false);
            e.target.value = '';
        }
    };

    const removeAttachment = (index: number) => {
        setAttachments(prev => prev.filter((_, i) => i !== index));
    };

    const consecutiveUserMessages = ticket?.messages
        ? [...ticket.messages].reverse().findIndex(msg => msg.isAdminReply) === -1
            ? ticket.messages.length
            : [...ticket.messages].reverse().findIndex(msg => msg.isAdminReply)
        : 0;

    const isLimitReached = consecutiveUserMessages >= 5;

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || isSending || isUploading || isLimitReached) return;

        setIsSending(true);
        setError(null);

        try {
            const response = await apiClient.post(`/tickets/${id}/messages`, {
                message: newMessage.trim(),
                attachments: attachments.length > 0 ? attachments : undefined
            });

            // Update local ticket state with new message
            setTicket((prev: any) => ({
                ...prev,
                messages: [...prev.messages, {
                    ...response.data,
                    user: user // Attach current user info for UI
                }]
            }));
            setNewMessage("");
            setAttachments([]);

            // Add a small delay before allowing more messages for UX
            setTimeout(() => {
                setIsSending(false);
            }, 2000);
        } catch (err: any) {
            logError(err, "Failed to send message");
            // Extract specific error message from backend
            const errorMessage = err.response?.data?.message || err.message || "Failed to send message. Please try again.";
            setError(errorMessage);
            setIsSending(false);
        }
    };

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'open':
                return { bg: 'bg-blue-500/10', text: 'text-blue-400', label: 'Open' };
            case 'in_progress':
                return { bg: 'bg-amber-500/10', text: 'text-amber-400', label: 'In Progress' };
            case 'waiting_on_customer':
                return { bg: 'bg-purple-500/10', text: 'text-purple-400', label: 'Action Needed' };
            case 'resolved':
                return { bg: 'bg-green-500/10', text: 'text-green-400', label: 'Resolved' };
            case 'closed':
                return { bg: 'bg-white/10', text: 'text-white/40', label: 'Closed' };
            default:
                return { bg: 'bg-white/5', text: 'text-white/40', label: status };
        }
    };

    if (authLoading || isLoading) {
        return (
            <div className="min-h-screen brand-bg-dusk pt-[var(--header-height)] flex items-center justify-center">
                <FiLoader className="w-8 h-8 animate-spin text-white/40" />
            </div>
        );
    }

    if (!ticket) {
        return (
            <div className="min-h-screen brand-bg-dusk pt-[var(--header-height)] flex items-center justify-center">
                <div className="text-center">
                    <p className="text-white/40 mb-4">Ticket not found</p>
                    <Link href="/account/tickets">
                        <button className="text-white/60 hover:text-white text-sm">← Back to Tickets</button>
                    </Link>
                </div>
            </div>
        );
    }

    const currentStatus = getStatusStyle(ticket.status);

    return (
        <div className="min-h-screen brand-bg-dusk pt-[var(--header-height)] flex flex-col">
            <div className="max-w-screen-lg mx-auto w-full px-4 sm:px-6 lg:px-10 pb-10 pt-8 flex-1 flex flex-col">

                {/* Header Section */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4 mb-6 sm:mb-8">
                    <div className="flex items-center gap-3 sm:gap-4">
                        <Link href={ticket.orderId ? `/orders/${ticket.orderId}` : "/account/tickets"}>
                            <button className="p-2 sm:p-2.5 rounded-full bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-all">
                                <FiArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                            </button>
                        </Link>
                        <div className="min-w-0">
                            <div className="flex items-center gap-2 sm:gap-3">
                                <h1 className="text-lg sm:text-xl md:text-2xl font-light text-white tracking-wide truncate">{ticket.ticketNumber}</h1>
                                <span className={`px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider flex-shrink-0 ${currentStatus.bg} ${currentStatus.text}`}>
                                    {currentStatus.label}
                                </span>
                            </div>
                            <p className="text-white/40 text-[9px] sm:text-[10px] md:text-xs mt-1 uppercase tracking-widest truncate">
                                {ticket.category.replace('_', ' ')} • Opened {new Date(ticket.createdAt).toLocaleDateString()}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-3">
                        <div className="text-left sm:text-right">
                            <p className="text-white/30 text-[9px] sm:text-[10px] uppercase tracking-widest">Subject</p>
                            <p className="text-white/70 text-xs sm:text-sm font-light mt-0.5 max-w-xs">{ticket.subject}</p>
                        </div>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 flex flex-col lg:flex-row gap-4 sm:gap-6">

                    {/* Chat Window */}
                    <div className="flex-1 flex flex-col luxury-glass border border-white/10 rounded-xl sm:rounded-2xl bg-white/5 overflow-hidden">

                        {/* Messages Area */}
                        <div
                            ref={messagesContainerRef}
                            className="flex-1 p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-6 overflow-y-auto"
                            style={{
                                maxHeight: '600px',
                                minHeight: '400px',
                                scrollBehavior: 'auto'
                            }}
                        >
                            {ticket.messages.map((msg: any) => {
                                const isMe = msg.userId === user?.id && !msg.isAdminReply;
                                return (
                                    <div
                                        key={msg.id}
                                        className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div className={`flex gap-3 max-w-[85%] sm:max-w-[70%] ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                                            <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center mt-auto ${msg.isAdminReply ? 'bg-fuchsia-600/20 text-fuchsia-400' : 'bg-white/10 text-white/40'}`}>
                                                {msg.isAdminReply ? <FiShield className="w-4 h-4" /> : <FiUser className="w-4 h-4" />}
                                            </div>
                                            <div className={`flex flex-col space-y-1 ${isMe ? 'items-end' : 'items-start'}`}>
                                                <div className="flex items-center gap-2 mb-1 px-1">
                                                    <span className="text-[10px] text-white/30 uppercase tracking-widest">
                                                        {msg.isAdminReply ? 'Customer Support' : (isMe ? 'You' : msg.user?.name || 'Customer')}
                                                    </span>
                                                    <span className="text-[10px] text-white/20">• {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                </div>
                                                <div className={`p-4 rounded-2xl text-sm leading-relaxed ${isMe
                                                    ? 'bg-gradient-to-br from-violet-600 to-fuchsia-600 text-white shadow-lg shadow-violet-500/10 rounded-tr-none'
                                                    : (msg.isAdminReply ? 'bg-white/10 text-white border border-fuchsia-500/20 rounded-tl-none' : 'bg-white/5 text-white/80 border border-white/5 rounded-tl-none')
                                                    }`}>
                                                    {msg.message}
                                                    {msg.attachments && msg.attachments.length > 0 && (
                                                        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-2 border-t border-white/10 pt-4">
                                                            {msg.attachments.map((file: any, i: number) => (
                                                                <a
                                                                    key={i}
                                                                    href={file.url}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="relative aspect-square rounded-xl overflow-hidden border border-white/10 bg-white/5 hover:border-white/20 transition-all group"
                                                                >
                                                                    <img
                                                                        src={file.url}
                                                                        alt={file.name || 'Attachment'}
                                                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                                    />
                                                                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                                        <FiPaperclip className="w-4 h-4 text-white" />
                                                                    </div>
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

                        {/* Input Area */}
                        {['resolved', 'closed'].includes(ticket.status) ? (
                            <div className="p-6 bg-white/[0.03] border-t border-white/5 text-center space-y-4">
                                <p className="text-white/40 text-[10px] uppercase tracking-[0.2em] font-medium">
                                    This ticket is {ticket.status}.
                                </p>
                                <p className="text-white/30 text-[10px] uppercase tracking-widest leading-relaxed">
                                    Our support team usually reviews tickets within 24-48 business hours.<br />
                                    <span className="text-violet-400/50">Note: You can send up to 5 consecutive messages before needing an admin reply.</span><br />
                                    You will receive an email notification when an admin replies.
                                </p>
                            </div>
                        ) : (
                            <form onSubmit={handleSendMessage} className="p-4 bg-white/[0.03] border-t border-white/5 space-y-4">
                                {/* Error Message */}
                                {error && (
                                    <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs" role="alert">
                                        <FiAlertCircle className="w-4 h-4 flex-shrink-0" />
                                        <p>{error}</p>
                                    </div>
                                )}

                                {/* Safe Message Limit Note */}
                                {isLimitReached && (
                                    <div className="flex items-center gap-2 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs" role="status">
                                        <FiAlertCircle className="w-4 h-4 flex-shrink-0" />
                                        <p>You have reached the limit of 5 consecutive messages. Please wait for an admin response before sending more.</p>
                                    </div>
                                )}

                                {attachments.length > 0 && (
                                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                                        {attachments.map((file, idx) => (
                                            <div key={idx} className="relative w-16 h-16 rounded-lg overflow-hidden border border-white/10 flex-shrink-0">
                                                <img src={file.url} alt="preview" className="w-full h-full object-cover" />
                                                <button
                                                    type="button"
                                                    onClick={() => removeAttachment(idx)}
                                                    className="absolute top-0.5 right-0.5 p-1 rounded-full bg-black/60 text-white"
                                                >
                                                    <FiX className="w-2.5 h-2.5" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <div className="relative flex items-end gap-2 sm:gap-3">
                                    <label className={`
                                        p-3 px-3 sm:px-4 rounded-xl border border-white/10 bg-white/5 
                                        text-white/40 hover:text-white hover:border-white/20 transition-all cursor-pointer
                                        flex items-center justify-center flex-shrink-0
                                        ${isUploading ? 'opacity-50 pointer-events-none' : ''}
                                    `}>
                                        <input
                                            type="file"
                                            multiple
                                            accept="image/*"
                                            className="hidden"
                                            onChange={handleFileChange}
                                            disabled={isUploading}
                                        />
                                        {isUploading ? (
                                            <FiLoader className="w-5 h-5 animate-spin" />
                                        ) : (
                                            <FiPlus className="w-5 h-5" />
                                        )}
                                    </label>

                                    <textarea
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' && !e.shiftKey) {
                                                e.preventDefault();
                                                handleSendMessage(e);
                                            }
                                        }}
                                        placeholder={isLimitReached ? "Waiting for admin response..." : "Type message..."}
                                        rows={1}
                                        disabled={isLimitReached}
                                        className={`flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-white/30 transition-all resize-none max-h-32 scrollbar-none ${isLimitReached ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    />
                                    <button
                                        type="submit"
                                        disabled={(!newMessage.trim() && attachments.length === 0) || isSending || isUploading || isLimitReached}
                                        className="p-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white hover:brightness-110 transition-all shadow-lg shadow-violet-500/20 disabled:grayscale disabled:opacity-50 flex-shrink-0"
                                    >
                                        {isSending ? <FiLoader className="w-5 h-5 animate-spin" /> : <FiSend className="w-5 h-5" />}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>

                    {/* Sidebar Area */}
                    <div className="w-full lg:w-72 space-y-6">

                        {/* Order Context */}
                        <div className="p-5 rounded-2xl luxury-glass border border-white/10 bg-white/5">
                            <h3 className="text-white/30 text-[10px] uppercase tracking-widest mb-4">Linked Order</h3>
                            <div className="space-y-3">
                                <p className="text-white font-light text-sm">{ticket.order?.orderNumber}</p>
                                <Link href={`/orders/${ticket.orderId}`}>
                                    <button className="text-[10px] text-violet-400 uppercase tracking-widest hover:text-violet-300 transition-colors">
                                        View Order Details →
                                    </button>
                                </Link>
                            </div>
                        </div>

                        {/* Recent Activity / Audit Log */}
                        <div className="p-5 rounded-2xl luxury-glass border border-white/10 bg-white/5">
                            <h3 className="text-white/30 text-[10px] uppercase tracking-widest mb-4">Status History</h3>
                            <div className="space-y-4">
                                {ticket.statusHistory?.map((entry: any) => (
                                    <div key={entry.id} className="flex gap-3">
                                        <div className="w-1.5 h-1.5 rounded-full bg-white/20 mt-1.5 flex-shrink-0" />
                                        <div>
                                            <p className="text-[11px] text-white/70">
                                                Status changed to <span className="text-white font-medium">{entry.toStatus.replace('_', ' ')}</span>
                                            </p>
                                            <p className="text-[9px] text-white/20 uppercase tracking-widest mt-0.5">
                                                {new Date(entry.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                </div>

            </div>
        </div>
    );
}
