"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
    FiPlus,
    FiMessageSquare,
    FiClock,
    FiCheckCircle,
    FiAlertCircle,
    FiChevronRight,
    FiFilter,
    FiLoader
} from "react-icons/fi";
import Link from "next/link";
import apiClient from "@/lib/api-client";
import { useAuth } from "@/app/context/AuthContext";

export default function TicketListPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { isAuthenticated, isLoading: authLoading } = useAuth();
    const [tickets, setTickets] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const orderId = searchParams.get('orderId');

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            router.push('/login');
        }
    }, [authLoading, isAuthenticated, router]);

    useEffect(() => {
        const fetchTickets = async () => {
            try {
                const url = orderId ? `/tickets/order/${orderId}` : '/tickets';
                // Note: I need to handle /tickets (all user tickets) in backend if not already done
                // For now, I'll use the orderId if present, otherwise handle accordingly
                const response = await apiClient.get(url);
                setTickets(response.data);
            } catch (error) {
                console.error("Failed to fetch tickets:", error);
            } finally {
                setIsLoading(false);
            }
        };

        if (isAuthenticated) {
            fetchTickets();
        }
    }, [isAuthenticated, orderId]);

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'open':
                return { bg: 'bg-blue-500/10', text: 'text-blue-400', label: 'Open', icon: FiMessageSquare };
            case 'in_progress':
                return { bg: 'bg-amber-500/10', text: 'text-amber-400', label: 'In Progress', icon: FiClock };
            case 'waiting_on_customer':
                return { bg: 'bg-purple-500/10', text: 'text-purple-400', label: 'Action Needed', icon: FiAlertCircle };
            case 'resolved':
                return { bg: 'bg-green-500/10', text: 'text-green-400', label: 'Resolved', icon: FiCheckCircle };
            case 'closed':
                return { bg: 'bg-white/10', text: 'text-white/40', label: 'Closed', icon: FiCheckCircle };
            default:
                return { bg: 'bg-white/5', text: 'text-white/40', label: status, icon: FiMessageSquare };
        }
    };

    if (authLoading || isLoading) {
        return (
            <div className="min-h-screen brand-bg-dusk pt-[var(--header-height)] flex items-center justify-center">
                <FiLoader className="w-8 h-8 animate-spin text-white/40" />
            </div>
        );
    }

    return (
        <div className="min-h-screen brand-bg-dusk pt-[var(--header-height)]">
            <div className="max-w-screen-lg mx-auto px-4 sm:px-6 lg:px-10 pb-10 pt-8">

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
                    <div className="space-y-1">
                        <h1 className="text-[28px] sm:text-[36px] font-light tracking-[0.14em] uppercase text-white leading-tight">
                            Support Tickets
                        </h1>
                        <p className="text-white/45 text-[11px] sm:text-[12px] uppercase tracking-[0.22em]">
                            {orderId ? `Viewing tickets for order #${orderId.slice(0, 8)}` : 'Manage your support requests'}
                        </p>
                    </div>

                </div>

                {tickets.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 px-6 text-center luxury-glass border border-white/10 rounded-2xl bg-white/5">
                        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-6">
                            <FiMessageSquare className="w-8 h-8 text-white/20" />
                        </div>
                        <h3 className="text-white text-lg font-light tracking-wide mb-2">No tickets found</h3>
                        <p className="text-white/40 text-sm max-w-xs mx-auto">
                            {orderId
                                ? "We couldn't find any support tickets for this specific order."
                                : "You haven't raised any support tickets yet."}
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {tickets.map((ticket) => {
                            const status = getStatusStyle(ticket.status);
                            const StatusIcon = status.icon;

                            return (
                                <Link
                                    key={ticket.id}
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
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
