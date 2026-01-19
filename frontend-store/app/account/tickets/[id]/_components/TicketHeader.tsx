"use client";

import { FiArrowLeft } from "react-icons/fi";
import Link from "next/link";

interface TicketHeaderProps {
    ticketNumber: string;
    status: string;
    category: string;
    createdAt: string;
    subject: string;
    orderId?: string;
}

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

export default function TicketHeader({
    ticketNumber,
    status,
    category,
    createdAt,
    subject,
    orderId,
}: TicketHeaderProps) {
    const currentStatus = getStatusStyle(status);

    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-4">
                <Link href={orderId ? `/orders/${orderId}` : "/account/tickets"}>
                    <button className="p-2.5 rounded-full bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-all">
                        <FiArrowLeft className="w-5 h-5" />
                    </button>
                </Link>
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-xl sm:text-2xl font-light text-white tracking-wide">
                            {ticketNumber}
                        </h1>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider ${currentStatus.bg} ${currentStatus.text}`}>
                            {currentStatus.label}
                        </span>
                    </div>
                    <p className="text-white/40 text-xs mt-1 uppercase tracking-widest">
                        {category?.replace('_', ' ') || 'General'} • Opened on {new Date(createdAt).toLocaleDateString()}
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                    <p className="text-white/30 text-[10px] uppercase tracking-widest">Subject</p>
                    <p className="text-white/70 text-sm font-light mt-0.5">{subject}</p>
                </div>
            </div>
        </div>
    );
}
