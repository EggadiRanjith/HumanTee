/**
 * Order Timeline Component
 * Shows order progression based on Delhivery shipment status.
 * If delivery hasn't been picked up, shows Processing as current step.
 */

"use client";

import { motion } from 'framer-motion';
import { FiPackage, FiTruck, FiCheckCircle, FiMapPin } from 'react-icons/fi';
import { OrderStatus } from '../../types';

interface OrderTimelineProps {
    status: OrderStatus;
    createdAt: string;
    updatedAt?: string;
    shipmentStatus?: string | null;
    shippedAt?: string | null;
    deliveredAt?: string | null;
}

// Maps shipment status to a numeric progression level
function getShipmentLevel(shipmentStatus?: string | null): number {
    if (!shipmentStatus) return 0;
    switch (shipmentStatus) {
        case 'manifested': return 1;
        case 'picked_up': return 2;
        case 'in_transit': return 3;
        case 'shipped': return 3; // Legacy — treat same as in_transit
        case 'out_for_delivery': return 4;
        case 'delivered': return 5;
        default: return 0;
    }
}

function formatDate(dateStr: string | null | undefined): string | null {
    if (!dateStr) return null;
    return new Date(dateStr).toLocaleString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

interface Step {
    title: string;
    subtitle?: string;
    timestamp?: string | null;
    icon: React.ReactNode;
    isCompleted: boolean;
    isCurrent: boolean;
}

export function OrderTimeline({
    status,
    createdAt,
    shipmentStatus,
    shippedAt,
    deliveredAt,
}: OrderTimelineProps) {
    const orderIsConfirmed = ['confirmed', 'processing', 'shipped', 'delivered'].includes(status);
    const orderIsProcessing = ['processing', 'shipped', 'delivered'].includes(status);
    const shipmentLevel = getShipmentLevel(shipmentStatus);
    const isDelivered = status === 'delivered' || shipmentLevel >= 5;

    // Build timeline steps
    const steps: Step[] = [
        // 1. Order Placed — always shown, always completed
        {
            title: 'Order Placed',
            subtitle: 'We received your order',
            timestamp: formatDate(createdAt),
            icon: <FiCheckCircle className="w-3.5 h-3.5" />,
            isCompleted: true,
            isCurrent: false,
        },
        // 2. Order Confirmed — shown if confirmed
        {
            title: 'Order Confirmed',
            subtitle: 'Payment verified',
            icon: <FiCheckCircle className="w-3.5 h-3.5" />,
            isCompleted: orderIsConfirmed,
            isCurrent: status === 'confirmed' && shipmentLevel === 0,
        },
        // 3. Processing — current only when no shipment yet (level 0)
        {
            title: 'Processing',
            subtitle: shipmentLevel >= 1 ? 'Shipment manifested' : 'Preparing your order',
            icon: <FiPackage className="w-3.5 h-3.5" />,
            isCompleted: orderIsProcessing && shipmentLevel >= 1,
            isCurrent: orderIsProcessing && shipmentLevel === 0 && !isDelivered,
        },
    ];

    // 4. Picked Up — only show if shipment exists (level >= 1)
    if (shipmentLevel >= 1) {
        steps.push({
            title: 'Picked Up',
            subtitle: 'Carrier collected your package',
            icon: <FiPackage className="w-3.5 h-3.5" />,
            isCompleted: shipmentLevel >= 2,
            isCurrent: shipmentLevel === 1, // manifested but not picked up
        });
    }

    // 5. In Transit — only show if picked up
    if (shipmentLevel >= 2) {
        steps.push({
            title: 'In Transit',
            subtitle: 'On the way to you',
            timestamp: formatDate(shippedAt),
            icon: <FiTruck className="w-3.5 h-3.5" />,
            isCompleted: shipmentLevel >= 3,
            isCurrent: shipmentLevel === 2,
        });
    }

    // 6. Out for Delivery — only show if in transit
    if (shipmentLevel >= 3) {
        steps.push({
            title: 'Out for Delivery',
            subtitle: 'Arriving today',
            icon: <FiMapPin className="w-3.5 h-3.5" />,
            isCompleted: shipmentLevel >= 4,
            isCurrent: shipmentLevel === 3,
        });
    }

    // 7. Delivered — only show if out for delivery or delivered
    if (shipmentLevel >= 4) {
        steps.push({
            title: 'Delivered',
            subtitle: 'Package received',
            timestamp: formatDate(deliveredAt),
            icon: <FiCheckCircle className="w-3.5 h-3.5" />,
            isCompleted: isDelivered,
            isCurrent: shipmentLevel === 4 && !isDelivered,
        });
    }

    return (
        <div className="p-5 sm:p-6 rounded-2xl luxury-glass border border-white/10 bg-white/5 backdrop-blur-xl mb-8">
            <h3 className="text-white/70 text-xs uppercase tracking-[0.18em] mb-6">
                Order Journey
            </h3>

            <div className="relative">
                {/* Timeline Line */}
                <div className="absolute left-[9px] top-2 bottom-2 w-[2px] bg-white/10" />

                {/* Timeline Steps */}
                <div className="space-y-5">
                    {steps.map((step, index) => (
                        <motion.div
                            key={step.title}
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.08, duration: 0.3 }}
                            className="relative flex items-start gap-4 pl-7"
                        >
                            {/* Dot */}
                            <div
                                className={`
                                    absolute left-0 w-[19px] h-[19px] rounded-full
                                    flex items-center justify-center z-10
                                    border-[3px] border-[#0d0d1a] transition-colors
                                    ${step.isCompleted
                                        ? 'bg-green-500 text-white'
                                        : step.isCurrent
                                            ? 'bg-amber-500 text-white animate-pulse'
                                            : 'bg-white/15 text-white/30'
                                    }
                                `}
                            >
                                {step.icon}
                            </div>

                            {/* Content */}
                            <div className="pt-0.5">
                                <p className={`text-sm font-medium ${step.isCompleted
                                    ? 'text-white'
                                    : step.isCurrent
                                        ? 'text-amber-400'
                                        : 'text-white/40'
                                    }`}>
                                    {step.title}
                                    {step.isCurrent && (
                                        <span className="ml-2 text-[10px] uppercase tracking-wider text-amber-400/80 font-normal">
                                            Current
                                        </span>
                                    )}
                                </p>
                                {step.subtitle && (
                                    <p className={`text-xs mt-0.5 ${step.isCompleted ? 'text-white/50' : 'text-white/30'
                                        }`}>
                                        {step.subtitle}
                                    </p>
                                )}
                                {step.timestamp && (
                                    <p className="text-white/40 text-[11px] mt-0.5 font-mono">
                                        {step.timestamp}
                                    </p>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
