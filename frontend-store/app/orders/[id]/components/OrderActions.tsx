/**
 * Order Actions Component
 * Action buttons for reorder and support
 */

import Link from 'next/link';
import { FiShoppingBag, FiHelpCircle } from 'react-icons/fi';

interface OrderActionsProps {
    onHelpClick: () => void;
}

export function OrderActions({ onHelpClick }: OrderActionsProps) {
    return (
        <div className="flex flex-col gap-3">
            {/* Reorder */}
            <Link
                href="/shop"
                className="
          w-full flex items-center justify-center gap-2
          px-6 py-3 rounded-xl
          luxury-glass border border-white/15
          text-white/90 hover:text-white hover:bg-white/10
          transition-all text-sm uppercase tracking-[0.18em]
        "
            >
                <FiShoppingBag className="w-4 h-4" /> Reorder Items
            </Link>

            {/* Support */}
            <button
                onClick={onHelpClick}
                className="
          w-full flex items-center justify-center gap-2
          px-6 py-3 rounded-xl
          luxury-glass border border-white/10 
          text-white/70 hover:text-white hover:bg-white/10
          transition-all text-sm uppercase tracking-[0.18em]
        "
            >
                <FiHelpCircle className="w-4 h-4" /> Need Help?
            </button>
        </div>
    );
}
