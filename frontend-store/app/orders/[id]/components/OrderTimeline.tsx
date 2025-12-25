/**
 * Order Timeline Component
 * Displays order status progression
 */

import { FiTruck, FiCheckCircle } from 'react-icons/fi';
import { OrderStatus } from '../../types';

interface OrderTimelineProps {
    status: OrderStatus;
    createdAt: string;
    updatedAt?: string;
    trackingNumber?: string;
}

export function OrderTimeline({ status, createdAt, updatedAt, trackingNumber }: OrderTimelineProps) {
    const isConfirmed = ['confirmed', 'processing', 'shipped', 'delivered'].includes(status);
    const isProcessing = ['processing', 'shipped', 'delivered'].includes(status);
    const isShipped = ['shipped', 'delivered'].includes(status);
    const isDelivered = status === 'delivered';

    return (
        <div className="p-6 rounded-2xl luxury-glass border border-white/10 bg-white/5 backdrop-blur-xl mb-8">
            <h3 className="text-white/70 text-xs uppercase tracking-[0.18em] mb-6">
                Order Journey
            </h3>

            <div className="relative">
                {/* Timeline Line */}
                <div className="absolute left-2 top-0 bottom-0 w-[2px] bg-white/10"></div>

                {/* Timeline Items */}
                <div className="space-y-6">
                    {/* Placed */}
                    <TimelineItem
                        title="Order Placed"
                        timestamp={new Date(createdAt).toLocaleString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                        })}
                        isCompleted={true}
                    />

                    {/* Confirmed */}
                    {isConfirmed && (
                        <TimelineItem
                            title="Order Confirmed"
                            subtitle="Payment received"
                            isCompleted={true}
                        />
                    )}

                    {/* Processing */}
                    {isProcessing && (
                        <TimelineItem
                            title="Processing"
                            subtitle="Preparing your order"
                            isCompleted={true}
                        />
                    )}

                    {/* Shipped */}
                    {isShipped && (
                        <TimelineItem
                            title="Shipped"
                            subtitle="In transit to you"
                            icon={<FiTruck className="w-3 h-3 text-white" />}
                            isCompleted={true}
                            extra={trackingNumber && (
                                <p className="text-blue-400 text-xs mt-1 font-mono">
                                    Tracking: {trackingNumber}
                                </p>
                            )}
                        />
                    )}

                    {/* Delivered */}
                    {isDelivered ? (
                        <TimelineItem
                            title="Delivered"
                            timestamp={updatedAt && new Date(updatedAt).toLocaleString('en-IN', {
                                day: 'numeric',
                                month: 'short',
                                hour: '2-digit',
                                minute: '2-digit'
                            })}
                            icon={<FiCheckCircle className="w-3 h-3 text-white" />}
                            isCompleted={true}
                        />
                    ) : (
                        <TimelineItem
                            title="Out for Delivery"
                            subtitle="Arriving soon"
                            isCompleted={false}
                        />
                    )}
                </div>
            </div>

            {/* Tracking Button */}
            {trackingNumber && status === 'shipped' && (
                <div className="mt-6 pt-6 border-t border-white/10">
                    <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white/80 hover:bg-white/10 hover:text-white transition-all">
                        <FiTruck className="w-4 h-4" />
                        <span className="text-sm">Track Package</span>
                    </button>
                </div>
            )}
        </div>
    );
}

interface TimelineItemProps {
    title: string;
    subtitle?: string;
    timestamp?: string;
    icon?: React.ReactNode;
    isCompleted: boolean;
    extra?: React.ReactNode;
}

function TimelineItem({ title, subtitle, timestamp, icon, isCompleted, extra }: TimelineItemProps) {
    return (
        <div className="relative flex items-start gap-4 pl-8">
            <div className={`absolute left-0 w-5 h-5 rounded-full ${isCompleted ? 'bg-green-500' : 'bg-white/20'} border-4 border-[#0d0d1a] flex items-center justify-center`}>
                {icon || <div className={`w-2 h-2 rounded-full ${isCompleted ? 'bg-white' : 'bg-white/40'}`}></div>}
            </div>
            <div>
                <p className={`text-sm font-medium ${isCompleted ? 'text-white' : 'text-white/40'}`}>{title}</p>
                {subtitle && <p className={`text-xs mt-0.5 ${isCompleted ? 'text-white/50' : 'text-white/30'}`}>{subtitle}</p>}
                {timestamp && <p className="text-white/50 text-xs mt-0.5">{timestamp}</p>}
                {extra}
            </div>
        </div>
    );
}
