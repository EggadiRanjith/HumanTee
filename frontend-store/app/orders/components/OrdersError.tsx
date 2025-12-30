interface OrdersErrorProps {
    onRetry: () => void;
}

export function OrdersError({ onRetry }: OrdersErrorProps) {
    return (
        <div className="text-center py-20 px-4 rounded-2xl border border-red-500/10 bg-red-500/5">
            <h3 className="text-xl text-red-200 font-light mb-2">Unable to load orders</h3>
            <p className="text-red-200/50 mb-8">We encountered an error while fetching your order history.</p>
            <button
                onClick={onRetry}
                className="px-8 py-3 border border-red-500/30 text-red-200 text-xs font-medium uppercase tracking-widest hover:bg-red-500/10 transition-colors rounded"
            >
                Try Again
            </button>
        </div>
    );
}
