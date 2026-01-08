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
            return { icon: FiCheckCircle, label: "Delivered", class: "text-white" };
        case "shipped":
            return { icon: FiTruck, label: "Shipped", class: "text-white" };
        case "processing":
            return { icon: FiClock, label: "Processing", class: "text-white/60" };
        default:
            return { icon: FiPackage, label: "Unknown", class: "text-white/40" };
    }
}

export function OrderHeader({ orderNumber, createdAt, status }: OrderHeaderProps) {
    const statusConfig = getStatusConfig(status);
    const StatusIcon = statusConfig.icon;

    return (
        <div className="p-4 sm:p-5 rounded-xl sm:rounded-2xl luxury-glass border border-white/10 bg-white/5 backdrop-blur-xl mb-6 sm:mb-8">
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

                <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-2.5 sm:px-3 py-1.5 rounded-lg shrink-0">
                    <StatusIcon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${statusConfig.class}`} />
                    <span className="uppercase text-[9px] sm:text-[10px] tracking-[0.2em] text-white/70">
                        {statusConfig.label}
                    </span>
                </div>
            </div>
        </div>
    );
}
