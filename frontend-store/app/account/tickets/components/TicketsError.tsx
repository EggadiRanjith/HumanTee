/**
 * Tickets Error State Component
 * Displayed when ticket fetching fails
 */

interface TicketsErrorProps {
    onRetry: () => void;
}

export function TicketsError({ onRetry }: TicketsErrorProps) {
    return (
        <div className="flex flex-col items-center justify-center py-20 px-6 text-center luxury-glass border border-white/10 rounded-2xl bg-white/5">
            <div className="w-16 h-16 mb-6 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            </div>
            <h3 className="text-white text-lg font-light tracking-wide mb-2">Failed to Load Tickets</h3>
            <p className="text-white/40 text-sm max-w-xs mx-auto mb-6">
                We couldn't fetch your tickets. Please try again.
            </p>
            <button
                onClick={onRetry}
                className="
          text-white/60 text-sm tracking-wide 
          border border-white/10 rounded-full
          px-8 py-3 luxury-glass
          hover:border-white/20 hover:text-white
          transition-all
        "
            >
                RETRY
            </button>
        </div>
    );
}
