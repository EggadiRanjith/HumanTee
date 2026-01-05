/**
 * Discount Card Component
 * Mobile-friendly card layout for discount list
 */

import Link from 'next/link';
import { FiPercent, FiDollarSign, FiCalendar, FiUsers, FiArrowRight } from 'react-icons/fi';

interface DiscountCardProps {
    discount: any;
    onDelete: (id: string) => void;
}

export function DiscountCard({ discount, onDelete }: DiscountCardProps) {
    const now = new Date();
    const isExpired = discount.endDate && new Date(discount.endDate) < now;
    const isScheduled = new Date(discount.startDate) > now;
    const isActive = discount.isActive && !isExpired && !isScheduled;

    const getStatusColor = () => {
        if (isExpired) return 'bg-red-50 text-red-600 border-red-200';
        if (isScheduled) return 'bg-blue-50 text-blue-600 border-blue-200';
        if (isActive) return 'bg-green-50 text-green-600 border-green-200';
        return 'bg-gray-50 text-gray-600 border-gray-200';
    };

    const getStatusText = () => {
        if (isExpired) return 'Expired';
        if (isScheduled) return 'Scheduled';
        if (isActive) return 'Active';
        return 'Inactive';
    };

    return (
        <div className="bg-white rounded-lg border border-gray-200 p-3 hover:shadow-md transition-all">
            {/* Header */}
            <div className="flex items-start justify-between mb-2">
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-1">
                        <h3 className="text-sm font-bold text-black truncate">
                            {discount.name}
                        </h3>
                        <span className={`text-[9px] uppercase font-bold px-2 py-0.5 rounded border ${getStatusColor()}`}>
                            {getStatusText()}
                        </span>
                    </div>
                    <p className="text-[11px] font-mono text-gray-600 truncate">
                        {discount.code}
                    </p>
                </div>
                <Link href={`/admin/discounts/${discount.id}`}>
                    <button className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
                        <FiArrowRight className="w-4 h-4 text-gray-400" />
                    </button>
                </Link>
            </div>

            {/* Discount Value */}
            <div className="bg-gradient-to-r from-violet-50 to-purple-50 rounded-lg p-2 mb-2 border border-violet-100">
                <div className="flex items-center justify-center gap-2">
                    {discount.type === 'PERCENT' ? (
                        <>
                            <FiPercent className="w-5 h-5 text-violet-600" />
                            <span className="text-2xl font-black text-violet-600">
                                {discount.value}% OFF
                            </span>
                        </>
                    ) : (
                        <>
                            <FiDollarSign className="w-5 h-5 text-violet-600" />
                            <span className="text-2xl font-black text-violet-600">
                                ₹{discount.value} OFF
                            </span>
                        </>
                    )}
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-gray-100">
                <div>
                    <div className="flex items-center gap-1 text-gray-400 mb-1">
                        <FiUsers className="w-3 h-3" />
                        <span className="text-[10px] uppercase font-bold">Scope</span>
                    </div>
                    <p className="text-xs font-bold text-black capitalize">
                        {discount.scope.toLowerCase()}
                    </p>
                </div>
                <div>
                    <div className="flex items-center gap-1 text-gray-400 mb-1">
                        <FiCalendar className="w-3 h-3" />
                        <span className="text-[10px] uppercase font-bold">Uses</span>
                    </div>
                    <p className="text-xs font-bold text-black">
                        {discount.usageCount || 0}/{discount.usageLimit || '∞'}
                    </p>
                </div>
                <div>
                    <div className="flex items-center gap-1 text-gray-400 mb-1">
                        <FiCalendar className="w-3 h-3" />
                        <span className="text-[10px] uppercase font-bold">Ends</span>
                    </div>
                    <p className="text-xs text-gray-600">
                        {discount.endDate
                            ? new Date(discount.endDate).toLocaleDateString([], { month: 'short', day: 'numeric' })
                            : 'Never'
                        }
                    </p>
                </div>
            </div>
        </div>
    );
}
