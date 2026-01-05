/**
 * Customer Card Component
 * Mobile-friendly card layout for customer list
 */

import Link from 'next/link';
import { FiShoppingBag, FiDollarSign, FiCalendar, FiArrowRight } from 'react-icons/fi';

interface CustomerCardProps {
    customer: any;
}

export function CustomerCard({ customer }: CustomerCardProps) {
    return (
        <Link href={`/admin/customers/${customer.id}`}>
            <div className="bg-white rounded-lg border border-gray-200 p-3 hover:shadow-md transition-all active:scale-[0.98]">
                {/* Header */}
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                        <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold border border-gray-200 text-sm">
                            {customer.profile?.full_name?.charAt(0) || 'U'}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-black truncate">
                                {customer.profile?.full_name || 'Anonymous'}
                            </p>
                            <p className="text-xs text-gray-500 truncate max-w-[200px]">
                                {customer.email}
                            </p>
                        </div>
                    </div>
                    <FiArrowRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-gray-100">
                    <div>
                        <div className="flex items-center gap-1 text-gray-400 mb-1">
                            <FiShoppingBag className="w-3 h-3" />
                            <span className="text-[10px] uppercase font-bold">Orders</span>
                        </div>
                        <p className="text-sm font-bold text-black">{customer.orderCount}</p>
                    </div>
                    <div>
                        <div className="flex items-center gap-1 text-gray-400 mb-1">
                            <FiDollarSign className="w-3 h-3" />
                            <span className="text-[10px] uppercase font-bold">Spend</span>
                        </div>
                        <p className="text-sm font-bold text-black">₹{customer.totalSpend.toFixed(0)}</p>
                    </div>
                    <div>
                        <div className="flex items-center gap-1 text-gray-400 mb-1">
                            <FiCalendar className="w-3 h-3" />
                            <span className="text-[10px] uppercase font-bold">Joined</span>
                        </div>
                        <p className="text-[11px] text-gray-600">
                            {new Date(customer.created_at).toLocaleDateString([], { month: 'short', year: '2-digit' })}
                        </p>
                    </div>
                </div>
            </div>
        </Link>
    );
}
