/**
 * Order Header Component
 * Displays order number, date, and status
 */

import { FiCheckCircle, FiTruck, FiClock, FiPackage } from 'react-icons/fi';
import { OrderStatus } from '../../types';

interface OrderHeaderProps {
    orderNumber: string;
    createdAt: string;
    status: OrderStatus;
}

function getStatusConfig(status: OrderStatus) {
    switch (status) {
        case "delivered":
            return {
                icon: FiCheckCircle,
                label: "Delivered",
                iconClass: "text-green-400",
                textClass: "text-green-300",
                bgClass: "bg-green-500/35 border-green-400/60",
                cardBg: "bg-green-500/20",
                cardBorder: "border-green-400/40",
                cardGlow: "shadow-[0_0_40px_rgba(34,197,94,0.2)]"
            };
        case "shipped":
            return {
                icon: FiTruck,
                label: "Shipped",
                iconClass: "text-blue-400",
                textClass: "text-blue-300",
                bgClass: "bg-blue-500/35 border-blue-400/60",
                cardBg: "bg-blue-500/20",
                cardBorder: "border-blue-400/40",
                cardGlow: "shadow-[0_0_40px_rgba(59,130,246,0.2)]"
            };
        case "processing":
            return {
                icon: FiClock,
                label: "Processing",
                iconClass: "text-yellow-400",
                textClass: "text-yellow-300",
                bgClass: "bg-yellow-500/35 border-yellow-400/60",
                cardBg: "bg-yellow-500/20",
                cardBorder: "border-yellow-400/40",
                cardGlow: "shadow-[0_0_40px_rgba(234,179,8,0.2)]"
            };
        default:
            return {
                icon: FiPackage,
                label: "Pending",
                iconClass: "text-purple-400",
                textClass: "text-purple-300",
                bgClass: "bg-purple-500/25 border-purple-400/40",
                cardBg: "bg-purple-500/10",
                cardBorder: "border-purple-400/25",
                cardGlow: "shadow-[0_0_30px_rgba(168,85,247,0.15)]"
            };
    }
}

export function OrderHeader({ orderNumber, createdAt, status }: OrderHeaderProps) {
    const statusConfig = getStatusConfig(status);
    const StatusIcon = statusConfig.icon;

    return (
        <div className={`p-4 sm:p-5 rounded-xl sm:rounded-2xl backdrop-blur-xl mb-6 sm:mb-8 transition-all duration-300 ${statusConfig.cardBg} ${statusConfig.cardGlow} border ${statusConfig.cardBorder}`}>
            <div className="flex flex-col xs:flex-row justify-between items-start xs:items-center gap-3 sm:gap-4">
                <div className="min-w-0 flex-1">
                    <h2 className="text-lg sm:text-xl text-white tracking-wide font-light truncate">
                        {orderNumber || 'Order'}
                    </h2>
                    <p className="text-white/50 text-xs mt-1">
                        Placed on {new Date(createdAt).toLocaleDateString(undefined, {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                        })}
                    </p>
                </div>

                <div className={`flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-lg shrink-0 ${statusConfig.bgClass} border`}>
                    <StatusIcon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${statusConfig.iconClass}`} />
                    <span className={`uppercase text-[9px] sm:text-[10px] tracking-[0.2em] font-medium ${statusConfig.textClass}`}>
                        {statusConfig.label}
                    </span>
                </div>
            </div>
        </div>
    );
}
