"use client";

import { useState, useEffect } from "react";
import { logError } from '@/lib/logger';
import { m, AnimatePresence } from "framer-motion";
import { FiX, FiPlusCircle, FiList, FiAlertCircle, FiChevronRight, FiLoader } from "react-icons/fi";
import { useRouter } from "next/navigation";
import apiClient from "@/lib/api-client";
import { useSettings } from "@/app/contexts/SettingsContext";

interface HelpActionModalProps {
    isOpen: boolean;
    onClose: () => void;
    orderId: string;
    orderNumber: string;
}

export function HelpActionModal({ isOpen, onClose, orderId, orderNumber }: HelpActionModalProps) {
    const router = useRouter();
    const [isChecking, setIsChecking] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Get settings for feature flags
    const { settings } = useSettings();

    // Body scroll lock
    useEffect(() => {
        if (isOpen) {
            const scrollY = window.scrollY;
            document.body.style.position = 'fixed';
            document.body.style.top = `-${scrollY}px`;
            document.body.style.width = '100%';
            document.body.style.overflow = 'hidden';
            return () => {
                const scrollY = document.body.style.top;
                document.body.style.position = '';
                document.body.style.top = '';
                document.body.style.width = '';
                document.body.style.overflow = '';
                window.scrollTo(0, parseInt(scrollY || '0') * -1);
            };
        }
    }, [isOpen]);

    const handleRaiseTicket = async () => {
        // ✅ Feature flag: Skip if tickets disabled
        if (!settings?.features?.ticketsEnabled) {
            setError('Support tickets are currently unavailable');
            return;
        }

        setError(null);
        setIsChecking(true);
        try {
            // Check for active ticket first
            const response = await apiClient.get(`/tickets/check/${orderId}`);

            if (response.data.hasActiveTicket) {
                // If active ticket exists, redirect to it
                onClose();
                router.push(`/account/tickets/${response.data.ticketId}`);
            } else {
                // If no active ticket, go to create ticket page
                onClose();
                router.push(`/account/tickets/create?orderId=${orderId}`);
            }
        } catch (err: any) {
            logError(err, "Failed to check active ticket");
            setError("Something went wrong. Please try again.");
        } finally {
            setIsChecking(false);
        }
    };

    const handleViewPastTickets = () => {
        onClose();
        router.push(`/account/tickets?orderId=${orderId}`);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            {/* Backdrop */}
            <m.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-black/80"
            />

            {/* Modal */}
            <m.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="relative w-full max-w-md bg-gradient-to-br from-[#0d0d1e] to-[#050512] border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
            >
                {/* Header */}
                <div className="p-6 border-b border-white/5 flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-light text-white tracking-wide">Support</h2>
                        <p className="text-white/40 text-xs mt-1 uppercase tracking-widest">Order {orderNumber}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
                    >
                        <FiX className="w-5 h-5 text-white" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                    {error && (
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm mb-4">
                            <FiAlertCircle className="w-4 h-4" />
                            {error}
                        </div>
                    )}

                    {/* Raise Ticket Button */}
                    <button
                        onClick={handleRaiseTicket}
                        disabled={isChecking}
                        className="w-full flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/[0.08] hover:border-white/20 transition-all group"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-violet-500/20 flex items-center justify-center text-violet-400">
                                {isChecking ? <FiLoader className="w-5 h-5 animate-spin" /> : <FiPlusCircle className="w-5 h-5" />}
                            </div>
                            <div className="text-left">
                                <p className="text-white font-medium">Raise a Ticket</p>
                                <p className="text-white/40 text-xs mt-0.5">Report an issue with this order</p>
                            </div>
                        </div>
                        <FiChevronRight className="w-5 h-5 text-white/20 group-hover:text-white/40 group-hover:translate-x-1 transition-all" />
                    </button>

                    {/* View Past Tickets Button */}
                    <button
                        onClick={handleViewPastTickets}
                        className="w-full flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/[0.08] hover:border-white/20 transition-all group"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/60">
                                <FiList className="w-5 h-5" />
                            </div>
                            <div className="text-left">
                                <p className="text-white font-medium">View Past Tickets</p>
                                <p className="text-white/40 text-xs mt-0.5">Check history for this order</p>
                            </div>
                        </div>
                        <FiChevronRight className="w-5 h-5 text-white/20 group-hover:text-white/40 group-hover:translate-x-1 transition-all" />
                    </button>
                </div>

                {/* Footer */}
                <div className="p-4 bg-white/[0.02] text-center border-t border-white/5">
                    <p className="text-white/30 text-[10px] uppercase tracking-[0.2em]">
                        HumanTee Customer Support
                    </p>
                </div>
            </m.div>
        </div>
    );
}
