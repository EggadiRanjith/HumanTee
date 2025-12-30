import Link from 'next/link';

export function OrdersEmpty() {
    return (
        <div className="text-center py-20 px-4 rounded-2xl border border-white/5 bg-white/[0.02]">
            <h3 className="text-xl text-white/80 font-light mb-2">No orders found</h3>
            <p className="text-white/50 mb-8">You haven't placed any orders yet.</p>
            <Link
                href="/shop"
                className="inline-block px-8 py-3 bg-white text-black text-xs font-medium uppercase tracking-widest hover:bg-white/90 transition-colors rounded"
            >
                Start Shopping
            </Link>
        </div>
    );
}
