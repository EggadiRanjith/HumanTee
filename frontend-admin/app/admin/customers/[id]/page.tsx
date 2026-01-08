'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import apiClient from '@/lib/api-client';
import {
    FiArrowLeft, FiUser, FiMail, FiPhone,
    FiShoppingBag, FiMessageSquare, FiCalendar,
    FiExternalLink, FiLoader, FiAlertCircle,
    FiGlobe, FiMapPin
} from 'react-icons/fi';

export default function CustomerDetailPage() {
    const params = useParams();
    const router = useRouter();
    const userId = params.id as string;

    const [customer, setCustomer] = useState<any | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (userId) fetchCustomer();
    }, [userId]);

    const fetchCustomer = async () => {
        setIsLoading(true);
        try {
            const response = await apiClient.get(`/admin/users/${userId}`);
            setCustomer(response.data);
        } catch (err) {
            console.error("Failed to fetch customer:", err);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <FiLoader className="w-8 h-8 animate-spin text-gray-300" />
            </div>
        );
    }

    if (!customer) {
        return (
            <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
                <FiAlertCircle className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                <h2 className="text-lg font-bold">Customer not found</h2>
                <Link href="/admin/customers" className="text-blue-600 text-sm hover:underline mt-2 inline-block">
                    Back to Directory
                </Link>
            </div>
        );
    }

    const totalSpend = customer.orders?.reduce((sum: number, o: any) => sum + Number(o.totalAmount), 0) || 0;

    return (
        <div className="space-y-4 md:space-y-6 max-w-7xl mx-auto">
            {/* Header - Compact on Mobile */}
            <div className="flex items-center gap-2 md:gap-4">
                <Link href="/admin/customers">
                    <button className="p-1.5 md:p-2 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200 bg-white">
                        <FiArrowLeft className="w-4 h-4 md:w-5 md:h-5" />
                    </button>
                </Link>
                <div>
                    <h1 className="text-lg md:text-2xl font-bold text-black">{customer.profile?.full_name || 'Customer Detail'}</h1>
                    <p className="text-gray-500 text-xs md:text-sm">Reviewing customer history and profiles</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">

                {/* Profile Card - Compact Mobile, Original Desktop */}
                <div className="lg:col-span-1 space-y-4 md:space-y-6">
                    <div className="bg-white rounded-xl md:rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                        <div className="h-16 md:h-24 bg-gradient-to-r from-gray-900 to-black" />
                        <div className="px-4 md:px-6 pb-4 md:pb-6">
                            <div className="relative -mt-8 md:-mt-10 mb-3 md:mb-4">
                                <div className="w-16 h-16 md:w-20 md:h-20 rounded-xl md:rounded-2xl bg-white p-1 border border-gray-100 shadow-md">
                                    <div className="w-full h-full rounded-lg md:rounded-xl bg-gray-50 flex items-center justify-center text-xl md:text-2xl font-bold text-black border border-gray-100">
                                        {customer.profile?.full_name?.charAt(0) || 'U'}
                                    </div>
                                </div>
                            </div>
                            <h3 className="text-base md:text-lg font-bold text-black">{customer.profile?.full_name || 'None'}</h3>
                            <p className="text-[10px] md:text-xs text-gray-500 mb-4 md:mb-6 lowercase tracking-wider">{customer.role} • ID: {customer.id.split('-')[0]}...</p>

                            <div className="space-y-3 md:space-y-4">
                                <div className="flex items-center gap-2 md:gap-3 text-xs md:text-sm">
                                    <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400">
                                        <FiMail className="w-3.5 h-3.5 md:w-4 md:h-4" />
                                    </div>
                                    <span className="text-gray-700 font-medium truncate">{customer.email}</span>
                                </div>
                                <div className="flex items-center gap-2 md:gap-3 text-xs md:text-sm">
                                    <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400">
                                        <FiPhone className="w-3.5 h-3.5 md:w-4 md:h-4" />
                                    </div>
                                    <span className="text-gray-700 font-medium">{customer.profile?.phone || 'Not provided'}</span>
                                </div>
                                <div className="flex items-center gap-2 md:gap-3 text-xs md:text-sm">
                                    <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400">
                                        <FiCalendar className="w-3.5 h-3.5 md:w-4 md:h-4" />
                                    </div>
                                    <span className="text-gray-700 font-medium">Joined {new Date(customer.created_at).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Stats - Compact Mobile, Original Desktop */}
                    <div className="bg-white p-4 md:p-6 rounded-xl md:rounded-2xl border border-gray-200 shadow-sm grid grid-cols-2 gap-3 md:gap-4">
                        <div className="space-y-0.5 md:space-y-1">
                            <p className="text-[9px] md:text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total Orders</p>
                            <p className="text-lg md:text-xl font-bold text-black">{customer.orders?.length || 0}</p>
                        </div>
                        <div className="space-y-0.5 md:space-y-1 text-right">
                            <p className="text-[9px] md:text-[10px] font-bold text-gray-400 uppercase tracking-widest">Lifetime Value</p>
                            <p className="text-lg md:text-xl font-bold text-black">₹{totalSpend.toFixed(2)}</p>
                        </div>
                    </div>
                </div>

                {/* Activity Tabs (Orders & Tickets) - Compact Mobile, Original Desktop */}
                <div className="lg:col-span-2 space-y-4 md:space-y-6">

                    {/* Orders Section - Compact Mobile, Original Desktop */}
                    <div className="bg-white rounded-xl md:rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                        <div className="px-4 md:px-6 py-2.5 md:py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                            <h3 className="text-[10px] md:text-xs font-bold text-black uppercase tracking-widest flex items-center gap-1.5 md:gap-2">
                                <FiShoppingBag className="w-3.5 h-3.5 md:w-4 md:h-4" /> Order History
                            </h3>
                            <span className="text-[9px] md:text-[10px] font-bold text-gray-400">{customer.orders?.length || 0} Total</span>
                        </div>
                        <div className="divide-y divide-gray-100">
                            {customer.orders?.length > 0 ? (
                                customer.orders.map((order: any) => (
                                    <div key={order.id} className="p-4 md:p-6 hover:bg-gray-50 transition-colors flex items-center justify-between group">
                                        <div>
                                            <p className="text-xs md:text-sm font-bold text-black">#{order.orderNumber}</p>
                                            <p className="text-[9px] md:text-[10px] text-gray-400 uppercase tracking-wider mt-0.5">
                                                {new Date(order.createdAt).toLocaleDateString()} • {order.status.replace(/_/g, ' ')}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-4 md:gap-6">
                                            <p className="text-xs md:text-sm font-bold text-black">₹{Number(order.totalAmount).toFixed(2)}</p>
                                            <Link href={`/admin/orders/${order.id}`}>
                                                <button className="p-1.5 md:p-2 rounded-lg border border-gray-100 group-hover:bg-white group-hover:border-black transition-all">
                                                    <FiExternalLink className="w-3.5 h-3.5 md:w-4 md:h-4" />
                                                </button>
                                            </Link>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="p-8 md:p-12 text-center text-gray-400 text-xs md:text-sm">No orders found for this customer.</div>
                            )}
                        </div>
                    </div>

                    {/* Support Section - Compact Mobile, Original Desktop */}
                    <div className="bg-white rounded-xl md:rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                        <div className="px-4 md:px-6 py-2.5 md:py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                            <h3 className="text-[10px] md:text-xs font-bold text-black uppercase tracking-widest flex items-center gap-1.5 md:gap-2">
                                <FiMessageSquare className="w-3.5 h-3.5 md:w-4 md:h-4" /> Support Tickets
                            </h3>
                            <span className="text-[9px] md:text-[10px] font-bold text-gray-400">{customer.tickets?.length || 0} Total</span>
                        </div>
                        <div className="divide-y divide-gray-100">
                            {customer.tickets?.length > 0 ? (
                                customer.tickets.map((ticket: any) => (
                                    <div key={ticket.id} className="p-4 md:p-6 hover:bg-gray-50 transition-colors flex items-center justify-between group">
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <p className="text-xs md:text-sm font-bold text-black">{ticket.subject}</p>
                                                <span className={`text-[8px] uppercase font-bold px-1.5 py-0.5 rounded border ${ticket.status === 'open' ? 'text-orange-600 border-orange-200 bg-orange-50' : 'text-gray-500 border-gray-200 bg-gray-50'
                                                    }`}>
                                                    {ticket.status}
                                                </span>
                                            </div>
                                            <p className="text-[9px] md:text-[10px] text-gray-400 uppercase tracking-wider mt-0.5">
                                                {new Date(ticket.createdAt).toLocaleDateString()} • {ticket.messages?.length || 0} messages
                                            </p>
                                        </div>
                                        <Link href={`/admin/tickets/${ticket.id}`}>
                                            <button className="p-1.5 md:p-2 rounded-lg border border-gray-100 group-hover:bg-white group-hover:border-black transition-all">
                                                <FiExternalLink className="w-3.5 h-3.5 md:w-4 md:h-4" />
                                            </button>
                                        </Link>
                                    </div>
                                ))
                            ) : (
                                <div className="p-8 md:p-12 text-center text-gray-400 text-xs md:text-sm">No support tickets found.</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
