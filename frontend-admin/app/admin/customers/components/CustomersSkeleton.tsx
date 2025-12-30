export function CustomersSkeleton() {
    return (
        <div className="space-y-4 animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="border border-gray-200 rounded-lg">
                {[...Array(8)].map((_, i) => (
                    <div key={i} className="h-16 border-b border-gray-200"></div>
                ))}
            </div>
        </div>
    );
}
