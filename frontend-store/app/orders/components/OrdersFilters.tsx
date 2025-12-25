/**
 * Orders Filters Component
 * Filter controls for orders page with status, sort, and search
 */

"use client";

import { OrderFilters } from '../types';

interface OrdersFiltersProps {
    filters: OrderFilters;
    onFilterChange: (filters: Partial<OrderFilters>) => void;
    onClearFilters: () => void;
    hasActiveFilters: boolean;
}

const STATUS_OPTIONS = [
    { value: 'all', label: 'All Orders' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'shipped', label: 'Shipped' },
    { value: 'processing', label: 'Processing' },
    { value: 'cancelled', label: 'Cancelled' },
];

const SORT_OPTIONS = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'price-low', label: 'Price: Low to High' },
];

export function OrdersFilters({ filters, onFilterChange, onClearFilters, hasActiveFilters }: OrdersFiltersProps) {
    return (
        <div className="mb-8 space-y-4">
            {/* Filters Row */}
            <div className="flex flex-wrap items-center gap-4">
                {/* Status Filter */}
                <div className="relative">
                    <select
                        value={filters.status || 'all'}
                        onChange={(e) => onFilterChange({ status: e.target.value as any, page: 1 })}
                        className="
              appearance-none
              px-4 xs:px-6 py-3 pr-10 xs:pr-12
              bg-white/5 backdrop-blur-sm
              border border-white/10
              rounded-lg
              text-white text-xs xs:text-sm
              tracking-wide
              cursor-pointer
              transition-all duration-200
              hover:bg-white/10 hover:border-white/20
              focus:outline-none focus:ring-2 focus:ring-white/20
              min-w-[140px] xs:min-w-[160px]
            "
                    >
                        {STATUS_OPTIONS.map((option) => (
                            <option key={option.value} value={option.value} className="bg-black">
                                {option.label}
                            </option>
                        ))}
                    </select>
                    <div className="absolute right-3 xs:right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                        <svg className="w-4 h-4 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                </div>

                {/* Sort Dropdown */}
                <div className="relative">
                    <select
                        value={filters.sortBy || 'newest'}
                        onChange={(e) => onFilterChange({ sortBy: e.target.value as any, page: 1 })}
                        className="
              appearance-none
              px-4 xs:px-6 py-3 pr-10 xs:pr-12
              bg-white/5 backdrop-blur-sm
              border border-white/10
              rounded-lg
              text-white text-xs xs:text-sm
              tracking-wide
              cursor-pointer
              transition-all duration-200
              hover:bg-white/10 hover:border-white/20
              focus:outline-none focus:ring-2 focus:ring-white/20
              min-w-[140px] xs:min-w-[180px]
            "
                    >
                        {SORT_OPTIONS.map((option) => (
                            <option key={option.value} value={option.value} className="bg-black">
                                {option.label}
                            </option>
                        ))}
                    </select>
                    <div className="absolute right-3 xs:right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                        <svg className="w-4 h-4 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                </div>

                {/* Clear Filters Button */}
                {hasActiveFilters && (
                    <button
                        onClick={onClearFilters}
                        className="
              px-4 py-2 
              text-xs text-white/60 hover:text-white
              underline underline-offset-2
              transition-colors
            "
                    >
                        Clear Filters
                    </button>
                )}
            </div>

            {/* Search Bar */}
            <div className="relative">
                <input
                    type="text"
                    placeholder="Search orders by number or product..."
                    value={filters.search || ''}
                    onChange={(e) => onFilterChange({ search: e.target.value, page: 1 })}
                    className="
            w-full px-4 py-3 pl-10
            bg-white/5 backdrop-blur-sm
            border border-white/10
            rounded-lg
            text-white text-sm
            placeholder:text-white/40
            focus:outline-none focus:ring-2 focus:ring-white/20
            transition-all duration-200
          "
                />
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            </div>
        </div>
    );
}
