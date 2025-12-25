/**
 * Order Card Component
 * Displays individual order with status, items, and details
 */

import Image from 'next/image';
import Link from 'next/link';
import { memo } from 'react';
import { FiPackage, FiTruck, FiCheckCircle, FiClock } from 'react-icons/fi';
import { Order, OrderStatus } from '@/app/types/order.types';

interface OrderCardProps {
    order: Order;
}

function getStatusConfig(status: OrderStatus) {
    switch (status) {
        case "delivered":
            return {
                icon: FiCheckCircle,
                label: "Delivered",
                class: "text-emerald-400",
                bg: "bg-emerald-400/10 border-emerald-400/20"
            };
        case "shipped":
            return {
                icon: FiTruck,
                label: "Shipped",
                class: "text-blue-400",
                bg: "bg-blue-400/10 border-blue-400/20"
            };
        case "processing":
            return {
                icon: FiClock,
                label: "Processing",
                class: "text-amber-400",
                bg: "bg-amber-400/10 border-amber-400/20"
            };
        case "cancelled":
            return {
                icon: FiPackage,
                label: "Cancelled",
                class: "text-red-400",
                bg: "bg-red-400/10 border-red-400/20"
            };
        default:
            return {
                icon: FiPackage,
                label: "Unknown",
                class: "text-white/40",
                bg: "bg-white/5 border-white/10"
            };
    }
}

const OrderCardComponent = ({ order }: OrderCardProps) => {
    const status = getStatusConfig(order.status);
    const Icon = status.icon;

    return (
        <div
            className="
        p-6 rounded-2xl luxury-glass border border-white/10 
        bg-white/5 backdrop-blur-xl
        flex flex-col sm:flex-row justify-between gap-6
      "
        >
            {/* Left Content */}
            <div className="flex-1 flex flex-col justify-between">
                <div>
                    <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-white text-lg font-light tracking-wide">
                            {order.orderNumber}
                        </h3>

                        <span className={`flex items-center gap-1.5 px-2 py-1 ${status.bg} rounded-md`}>
                            <Icon className={`w-3.5 h-3.5 ${status.class}`} />
                            <span className={`text-[10px] uppercase tracking-[0.18em] ${status.class}`}>
                                {status.label}
                            </span>
                        </span>
                    </div>

                    <p className="text-white/50 text-sm mb-1">
                        {new Date(order.createdAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                        })} • {order.items?.length || 0} items
                    </p>

                    {order.tracking && (
                        <p className="text-white/40 text-xs">Tracking: {order.tracking}</p>
                    )}
                </div>

                {/* Amount + CTA */}
                <div className="flex items-center gap-6 mt-4">
                    <p className="text-white text-xl font-light">₹{Number(order.totalAmount).toFixed(2)}</p>

                    <Link
                        href={`/orders/${order.id}`}
                        className="
              px-4 py-2 rounded-xl border border-white/10 
              text-white/80 text-xs uppercase tracking-[0.18em]
              hover:text-white hover:border-white/20 transition-colors
            "
                    >
                        View Details
                    </Link>
                </div>
            </div>

            {/* Right Image Cluster */}
            <div className="flex-shrink-0 flex gap-2 sm:gap-3">
                {order.items?.slice(0, 3).map((item: any, i: number) => (
                    <div
                        key={i}
                        className="relative w-16 h-20 sm:w-20 sm:h-24 rounded-lg overflow-hidden border border-white/10"
                    >
                        <Image
                            src={item.imageUrlSnapshot || '/placeholder.png'}
                            fill
                            alt={`${item.productNameSnapshot || 'Order item'} ${i + 1}`}
                            className="object-cover"
                            sizes="120px"
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

// Memoized export to prevent unnecessary re-renders
export const OrderCard = memo(OrderCardComponent, (prevProps, nextProps) => {
    return prevProps.order.id === nextProps.order.id;
});
