/**
 * Customer Card Component - With Explicit Spacing
 * Ensures visible spacing between cards
 */

import Link from 'next/link';
import { FiShoppingBag, FiDollarSign, FiCalendar, FiArrowRight } from 'react-icons/fi';

interface CustomerCardProps {
    customer: any;
}

export function CustomerCard({ customer }: CustomerCardProps) {
    return (
        <Link href={`/admin/customers/${customer.id}`} className="block mb-4">
            {/* Compact card with explicit bottom margin */}
            <div className="bg-white rounded-lg border border-gray-200 p-2.5 hover:shadow-md hover:border-gray-400 transition-all active:scale-[0.98]">
                {/* Header */}
                <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                        {/* Compact avatar: 32px */}
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-700 font-bold border border-gray-200 text-sm">
                            {customer.profile?.full_name?.charAt(0) || 'U'}
                        </div>
                        <div className="flex-1 min-w-0">
                            {/* India-safe: 13px name */}
                            <p className="text-[13px] font-bold text-black truncate leading-tight">
                                {customer.profile?.full_name || 'Anonymous'}
                            </p>
                            {/* India-safe: 12px email */}
                            <p className="text-[12px] text-gray-600 truncate max-w-[180px]">
                                {customer.email}
                            </p>
                        </div>
                    </div>
                    {/* Compact arrow */}
                    <FiArrowRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
                </div>

                {/* Stats - Ultra compact */}
                <div className="grid grid-cols-3 gap-1.5 pt-1.5 border-t border-gray-100">
                    <div>
                        <div className="flex items-center gap-1 text-gray-500 mb-0.5">
                            <FiShoppingBag className="w-3 h-3" />
                            <span className="text-[10px] uppercase font-bold">Orders</span>
                        </div>
                        {/* India-safe: 13px for numbers */}
                        <p className="text-[13px] font-bold text-black">{customer.orderCount}</p>
                    </div>
                    <div>
                        <div className="flex items-center gap-1 text-gray-500 mb-0.5">
                            <FiDollarSign className="w-3 h-3" />
                            <span className="text-[10px] uppercase font-bold">Spend</span>
                        </div>
                        {/* India-safe: 13px for prices */}
                        <p className="text-[13px] font-bold text-black">₹{customer.totalSpend.toFixed(0)}</p>
                    </div>
                    <div>
                        <div className="flex items-center gap-1 text-gray-500 mb-0.5">
                            <FiCalendar className="w-3 h-3" />
                            <span className="text-[10px] uppercase font-bold">Joined</span>
                        </div>
                        {/* India-safe: 12px minimum */}
                        <p className="text-[12px] text-gray-600 font-medium">
                            {new Date(customer.created_at).toLocaleDateString([], { month: 'short', year: '2-digit' })}
                        </p>
                    </div>
                </div>
            </div>
        </Link>
    );
}
