/**
 * Orders Error State Component
 * Displayed when order fetching fails
 */

interface OrdersErrorProps {
    onRetry: () => void;
}

export function OrdersError({ onRetry }: OrdersErrorProps) {
    return (
        <div className="flex flex-col items-center justify-center py-16 sm:py-20 lg:py-24 min-h-[60vh]">
            <div className="w-16 h-16 mb-6 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            </div>
            <h3 className="text-[18px] sm:text-[22px] lg:text-[26px] font-light uppercase tracking-[0.12em] text-white mb-3">
                Failed to Load Orders
            </h3>
            <p className="text-white/45 text-[11px] sm:text-[12px] uppercase tracking-[0.18em] mb-8 text-center max-w-md">
                We couldn't fetch your orders. Please try again.
            </p>
            <button
                onClick={onRetry}
                className="
          text-white/60 text-step--1 tracking-wide 
          border border-white/10 rounded-full
          px-8 py-3 motion-cinematic luxury-glass
          hover:border-white/20 hover:text-white
        "
            >
                RETRY
            </button>
        </div>
    );
}
