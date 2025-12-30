import { OrderFilters as FilterType } from '../types';
import { FiChevronDown } from 'react-icons/fi';

interface OrdersFiltersProps {
    filters: FilterType;
    onFilterChange: (filters: Partial<FilterType>) => void;
    onClearFilters: () => void;
    hasActiveFilters: boolean;
}

export function OrdersFilters({
    filters,
    onFilterChange,
    onClearFilters,
    hasActiveFilters
}: OrdersFiltersProps) {
    return (
        <div className="mb-10">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                {/* Filters */}
                <div className="flex flex-wrap gap-3 items-center">
                    {/* Status Select with Icon */}
                    <div className="relative">
                        <select
                            value={filters.status || 'all'}
                            onChange={(e) => onFilterChange({ status: e.target.value as any })}
                            className="
                                luxury-glass
                                border border-white/10
                                rounded-lg
                                px-4 py-2.5
                                pr-10
                                text-[13px]
                                text-white/90
                                tracking-wide
                                focus:outline-none
                                focus:border-white/30
                                transition-all
                                duration-300
                                cursor-pointer
                                hover:bg-white/10
                                min-w-[160px]
                                appearance-none
                            "
                            style={{ colorScheme: 'dark' }}
                        >
                            <option value="all" className="bg-[#0a0a0a] text-white">All Statuses</option>
                            <option value="processing" className="bg-[#0a0a0a] text-white">Processing</option>
                            <option value="shipped" className="bg-[#0a0a0a] text-white">Shipped</option>
                            <option value="delivered" className="bg-[#0a0a0a] text-white">Delivered</option>
                            <option value="cancelled" className="bg-[#0a0a0a] text-white">Cancelled</option>
                        </select>
                        <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 pointer-events-none" size={16} />
                    </div>

                </div>

                {/* Clear Filters */}
                {hasActiveFilters && (
                    <button
                        onClick={onClearFilters}
                        className="
                            text-white/50
                            text-[13px]
                            tracking-wide
                            hover:text-white
                            transition-colors
                            duration-300
                            uppercase
                            font-light
                        "
                    >
                        Clear Filters
                    </button>
                )}
            </div>
        </div>
    );
}
