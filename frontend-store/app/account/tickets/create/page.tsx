"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { logError } from '@/lib/logger';
import { useSearchParams, useRouter } from "next/navigation";
import {
    FiArrowLeft,
    FiSend,
    FiAlertCircle,
    FiImage,
    FiLoader,
    FiCheckCircle,
    FiX,
    FiPlus
} from "react-icons/fi";
import Link from "next/link";
import apiClient from "@/lib/api-client";
import { useAuth } from "@/app/contexts/AuthContext";

const CATEGORIES = [
    { id: 'wrong_item', label: 'Wrong Item Received' },
    { id: 'damaged_product', label: 'Damaged Product' },
    { id: 'late_delivery', label: 'Late Delivery' },
    { id: 'missing_items', label: 'Missing Items' },
    { id: 'quality_issue', label: 'Quality Issue' },
    { id: 'other', label: 'Other' },
];

const MAX_IMAGES = 5;

function CreateTicketPageContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { isAuthenticated, isLoading: authLoading } = useAuth();

    const [orderId, setOrderId] = useState<string | null>(searchParams.get('orderId'));
    const [orderNumber, setOrderNumber] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        category: '',
        subject: '',
        description: '',
    });

    // Image states
    const [attachments, setAttachments] = useState<{ url: string; name: string; type: string; size: number }[]>([]);
    const [isUploading, setIsUploading] = useState(false);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isCheckingActive, setIsCheckingActive] = useState(true);
    const [hasActiveTicket, setHasActiveTicket] = useState(false);
    const [activeTicketId, setActiveTicketId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            router.push('/login?redirect=/account/tickets/create');
        }
    }, [authLoading, isAuthenticated, router]);

    useEffect(() => {
        const fetchOrderAndCheckActive = async () => {
            if (!orderId) {
                setIsCheckingActive(false);
                return;
            }

            try {
                // 1. Fetch Order Info
                const orderRes = await apiClient.get(`/orders/${orderId}`);
                setOrderNumber(orderRes.data.orderNumber);

                // 2. Check for active ticket
                const checkRes = await apiClient.get(`/tickets/check/${orderId}`);
                if (checkRes.data.hasActiveTicket) {
                    setHasActiveTicket(true);
                    setActiveTicketId(checkRes.data.ticketId);
                }
            } catch (error) {
                logError(error, "Failed to fetch order/ticket info");
            } finally {
                setIsCheckingActive(false);
            }
        };

        if (isAuthenticated) {
            fetchOrderAndCheckActive();
        }
    }, [isAuthenticated, orderId]);

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
            // Reset input
            e.target.value = '';
        }
    };

    const removeAttachment = (index: number) => {
        setAttachments(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!orderId) {
            setError("Order ID is required to raise a ticket.");
            return;
        }

        setError(null);
        setIsSubmitting(true);

        try {
            const response = await apiClient.post('/tickets', {
                orderId,
                category: formData.category,
                subject: formData.subject,
                description: formData.description,
                attachments: attachments.length > 0 ? attachments : undefined
            });

            setSuccess(true);
            setTimeout(() => {
                router.push(`/account/tickets/${response.data.id}`);
            }, 2000);
        } catch (err: any) {
            logError(err, "Failed to create ticket");
            setError(err.response?.data?.message || "Failed to create ticket. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (authLoading || isCheckingActive) {
        return (
            <div className="min-h-screen brand-bg-dusk pt-[var(--header-height)] flex items-center justify-center">
                <FiLoader className="w-8 h-8 animate-spin text-white/40" />
            </div>
        );
    }

    if (hasActiveTicket) {
        return (
            <div className="min-h-screen brand-bg-dusk pt-[var(--header-height)]">
                <div className="max-w-screen-md mx-auto px-4 sm:px-6 lg:px-10 pb-10 pt-8 text-center">
                    <div className="p-10 rounded-2xl luxury-glass border border-white/10 bg-white/5 space-y-6">
                        <div className="w-16 h-16 rounded-full bg-violet-500/10 flex items-center justify-center mx-auto mb-6">
                            <FiAlertCircle className="w-8 h-8 text-violet-400" />
                        </div>
                        <h2 className="text-2xl text-white font-light tracking-wide uppercase">Active Ticket Found</h2>
                        <p className="text-white/40 text-sm max-w-sm mx-auto">
                            You already have an active support request for order #{orderNumber || orderId?.slice(0, 8)}.
                            Please use the existing ticket to communicate with our team.
                        </p>
                        <div className="pt-4">
                            <Link href={`/account/tickets/${activeTicketId}`}>
                                <button className="px-8 py-3 rounded-xl bg-violet-600 text-white text-xs uppercase tracking-widest font-medium hover:bg-violet-700 transition-all shadow-lg shadow-violet-500/20">
                                    View Active Ticket
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (success) {
        return (
            <div className="min-h-screen brand-bg-dusk pt-[var(--header-height)] flex items-center justify-center">
                <div className="text-center space-y-4">
                    <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto">
                        <FiCheckCircle className="w-8 h-8 text-green-400" />
                    </div>
                    <h2 className="text-2xl text-white font-light tracking-wide">Ticket Raised Successfully!</h2>
                    <p className="text-white/40">Redirecting to ticket details...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen brand-bg-dusk pt-[var(--header-height)]">
            <div className="max-w-screen-md mx-auto px-4 sm:px-6 lg:px-10 pb-10 pt-8">

                <Link href={orderId ? `/orders/${orderId}` : '/account/tickets'}>
                    <button className="flex items-center gap-2 text-white/60 hover:text-white text-sm mb-6 transition-colors group">
                        <FiArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Back to {orderId ? 'Order' : 'Tickets'}
                    </button>
                </Link>

                <div className="mb-10 space-y-1">
                    <h1 className="text-[28px] sm:text-[36px] font-light tracking-[0.14em] uppercase text-white leading-tight">
                        Raise a Ticket
                    </h1>
                    <p className="text-white/45 text-[11px] sm:text-[12px] uppercase tracking-[0.22em]">
                        Order {orderNumber || orderId?.slice(0, 8)}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="p-6 sm:p-8 rounded-2xl luxury-glass border border-white/10 bg-white/5 space-y-6">

                        {error && (
                            <div className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                                <FiAlertCircle className="w-5 h-5 flex-shrink-0" />
                                <p>{error}</p>
                            </div>
                        )}

                        {/* Category */}
                        <div className="space-y-2">
                            <label className="text-white/40 text-[10px] uppercase tracking-[0.2em] ml-1">
                                Problem Category
                            </label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {CATEGORIES.map((cat) => (
                                    <button
                                        key={cat.id}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, category: cat.id })}
                                        className={`
                                            p-3 rounded-xl border text-left text-xs uppercase tracking-wider transition-all
                                            ${formData.category === cat.id
                                                ? 'bg-violet-600 border-violet-500 text-white shadow-lg shadow-violet-500/20'
                                                : 'bg-white/5 border-white/10 text-white/60 hover:border-white/20'
                                            }
                                        `}
                                    >
                                        {cat.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Subject */}
                        <div className="space-y-2">
                            <label className="text-white/40 text-[10px] uppercase tracking-[0.2em] ml-1">
                                Subject
                            </label>
                            <input
                                required
                                type="text"
                                value={formData.subject}
                                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                placeholder="Brief summary of the issue"
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-white/30 transition-all text-sm"
                            />
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                            <label className="text-white/40 text-[10px] uppercase tracking-[0.2em] ml-1">
                                Details
                            </label>
                            <textarea
                                required
                                rows={5}
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Describe the issue in detail. If items are missing or damaged, please specify which ones."
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-white/30 transition-all text-sm resize-none"
                            />
                        </div>

                        {/* Images Upload */}
                        <div className="space-y-3">
                            <label className="text-white/40 text-[10px] uppercase tracking-[0.2em] ml-1 flex justify-between">
                                Attachments (Optional)
                                <span>{attachments.length} / {MAX_IMAGES}</span>
                            </label>

                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                                {attachments.map((file, idx) => (
                                    <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-white/10 bg-white/5 group">
                                        <img src={file.url} alt="upload" className="w-full h-full object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => removeAttachment(idx)}
                                            className="absolute top-1 right-1 p-1.5 rounded-full bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <FiX className="w-3 h-3" />
                                        </button>
                                    </div>
                                ))}

                                {attachments.length < MAX_IMAGES && (
                                    <label className={`
                                        aspect-square rounded-xl border border-dashed border-white/10 bg-white/5 
                                        flex flex-col items-center justify-center cursor-pointer 
                                        hover:bg-white/[0.08] hover:border-white/20 transition-all
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
                                            <FiLoader className="w-5 h-5 animate-spin text-white/40" />
                                        ) : (
                                            <>
                                                <FiPlus className="w-5 h-5 text-white/40 mb-1" />
                                                <span className="text-[10px] text-white/30 uppercase tracking-widest font-medium">Add Image</span>
                                            </>
                                        )}
                                    </label>
                                )}
                            </div>
                            <p className="text-[10px] text-white/20 tracking-wider">Accepted formats: JPG, PNG, WebP (max 5 images)</p>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting || isUploading || !formData.category || !formData.subject || !formData.description}
                            className="
                                w-full flex items-center justify-center gap-3
                                px-6 py-4 rounded-xl
                                bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600
                                text-white text-sm uppercase tracking-[0.25em] font-medium
                                hover:brightness-110 disabled:grayscale disabled:opacity-50
                                transition-all shadow-xl shadow-fuchsia-500/20
                            "
                        >
                            {isSubmitting ? (
                                <FiLoader className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    <FiSend className="w-4 h-4" /> Submit Ticket
                                </>
                            )}
                        </button>
                    </div>

                    <p className="text-center text-white/30 text-[10px] uppercase tracking-widest leading-relaxed">
                        Our support team usually reviews tickets within 24-48 business hours.<br />
                        You will receive an email notification when an admin replies.
                    </p>
                </form>
            </div>
        </div>
    );
}

export default function CreateTicketPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen brand-bg-dusk pt-[var(--header-height)] flex items-center justify-center">
                <FiLoader className="w-8 h-8 animate-spin text-white/40" />
            </div>
        }>
            <CreateTicketPageContent />
        </Suspense>
    );
}
