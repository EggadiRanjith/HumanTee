/**
 * Tickets Empty State Component
 * Displayed when user has no tickets
 */

import { FiMessageSquare } from 'react-icons/fi';

interface TicketsEmptyProps {
    orderId?: string;
}

export function TicketsEmpty({ orderId }: TicketsEmptyProps) {
    return (
        <div className="flex flex-col items-center justify-center py-20 px-6 text-center luxury-glass border border-white/10 rounded-2xl bg-white/5">
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-6">
                <FiMessageSquare className="w-8 h-8 text-white/20" />
            </div>
            <h3 className="text-white text-lg font-light tracking-wide mb-2">No tickets found</h3>
            <p className="text-white/40 text-sm max-w-xs mx-auto">
                {orderId
                    ? "We couldn't find any support tickets for this specific order."
                    : "You haven't raised any support tickets yet."}
            </p>
        </div>
    );
}
