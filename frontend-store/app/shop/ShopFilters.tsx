/**
 * ShopFilters Component
 * Enhanced filter controls with sort dropdown
 * Integrates with URL-based state management
 */

"use client";

import { useState, useEffect } from 'react';
import { ShopFilters as ShopFiltersType } from '../hooks';

interface SortOption {
    value: string;
    label: string;
}

interface ShopFiltersProps {
    onFilterChange: (filters: { category?: string; collection?: string; sort?: string }) => void;
    categories: string[];
    collections: string[];
    sortOptions: SortOption[];
    currentFilters: ShopFiltersType;
    activeFilterCount: number;
}

export default function ShopFilters({
    onFilterChange,
    categories,
    collections,
    sortOptions,
    currentFilters,
    activeFilterCount
}: ShopFiltersProps) {
    const [selectedCategory, setSelectedCategory] = useState<string>(currentFilters.category || '');
    const [selectedCollection, setSelectedCollection] = useState<string>(currentFilters.collection || '');
    const [selectedSort, setSelectedSort] = useState<string>(currentFilters.sort || '');

    // Sync with URL changes
    useEffect(() => {
        setSelectedCategory(currentFilters.category || '');
        setSelectedCollection(currentFilters.collection || '');
        setSelectedSort(currentFilters.sort || '');
    }, [currentFilters]);

    // Update filters when selections change
    useEffect(() => {
        onFilterChange({
            category: selectedCategory || undefined,
            collection: selectedCollection || undefined,
            sort: selectedSort || undefined,
        });
    }, [selectedCategory, selectedCollection, selectedSort, onFilterChange]);

    return (
        <div className="mb-8 sm:mb-10">
            <div className="flex flex-wrap items-center justify-center gap-4">
                {/* Category Filter */}
                <div className="relative">
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
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
                        <option value="" className="bg-black">All Categories</option>
                        {categories.map((category) => (
                            <option key={category} value={category} className="bg-black">
                                {category}
                            </option>
                        ))}
                    </select>
                    <div className="absolute right-3 xs:right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                        <svg className="w-4 h-4 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                </div>

                {/* Collection Filter */}
                <div className="relative">
                    <select
                        value={selectedCollection}
                        onChange={(e) => setSelectedCollection(e.target.value)}
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
                        <option value="" className="bg-black">All Collections</option>
                        {collections.map((collection) => (
                            <option key={collection} value={collection} className="bg-black">
                                {collection.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
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
                        value={selectedSort}
                        onChange={(e) => setSelectedSort(e.target.value)}
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
                        <option value="" className="bg-black">Sort By</option>
                        {sortOptions.map((option) => (
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

                {/* Active Filter Count Badge */}
                {activeFilterCount > 0 && (
                    <div className="flex items-center gap-2 px-3 py-2 bg-violet-500/20 border border-violet-500/30 rounded-lg">
                        <span className="text-xs text-violet-300 font-medium">
                            {activeFilterCount} {activeFilterCount === 1 ? 'Filter' : 'Filters'} Active
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
}
