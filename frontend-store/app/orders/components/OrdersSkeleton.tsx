export function OrdersSkeleton({ count = 3 }: { count?: number }) {
    return (
        <div className="space-y-4">
            {Array.from({ length: count }).map((_, i) => (
                <div key={i} className="h-48 rounded-xl bg-white/5 animate-pulse" />
            ))}
        </div>
    );
}
