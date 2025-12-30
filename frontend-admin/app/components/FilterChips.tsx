/**
 * Filter Chips Component
 * Displays active filters as removable chips
 */

interface FilterChip {
    key: string;
    label: string;
    value: string;
}

interface FilterChipsProps {
    filters: FilterChip[];
    onRemove: (key: string) => void;
    onClearAll?: () => void;
}

export function FilterChips({ filters, onRemove, onClearAll }: FilterChipsProps) {
    if (filters.length === 0) return null;

    return (
        <div className="flex items-center gap-2 mb-4 flex-wrap">
            <span className="text-sm text-gray-600">Active filters:</span>
            {filters.map((filter) => (
                <div
                    key={filter.key}
                    className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full text-sm"
                >
                    <span className="text-gray-700">
                        {filter.label}: <strong>{filter.value}</strong>
                    </span>
                    <button
                        onClick={() => onRemove(filter.key)}
                        className="text-gray-500 hover:text-black transition-colors"
                        aria-label={`Remove ${filter.label} filter`}
                    >
                        ✕
                    </button>
                </div>
            ))}
            {onClearAll && filters.length > 1 && (
                <button
                    onClick={onClearAll}
                    className="text-sm text-gray-600 hover:text-black underline transition-colors"
                >
                    Clear all
                </button>
            )}
        </div>
    );
}
