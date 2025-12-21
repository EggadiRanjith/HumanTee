/**
 * ShopFilters Component
 * Filter controls for shop page with category, collection, and reset
 */

"use client";

import { useState, useEffect } from 'react';

interface ShopFiltersProps {
    onFilterChange: (filters: { productType?: string; category?: string; collection?: string }) => void;
    categories: string[];
    collections: string[];
}

export default function ShopFilters({ onFilterChange, categories, collections }: ShopFiltersProps) {
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [selectedCollection, setSelectedCollection] = useState<string>('');

    useEffect(() => {
        onFilterChange({
            category: selectedCategory || undefined,
            collection: selectedCollection || undefined,
        });
    }, [selectedCategory, selectedCollection, onFilterChange]);

    const handleReset = () => {
        setSelectedCategory('');
        setSelectedCollection('');
    };

    const hasActiveFilters = selectedCategory || selectedCollection;

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
              px-6 py-3 pr-12
              bg-white/5 backdrop-blur-sm
              border border-white/10
              rounded-lg
              text-white text-sm
              tracking-wide
              cursor-pointer
              transition-all duration-300
              hover:bg-white/10 hover:border-white/20
              focus:outline-none focus:ring-2 focus:ring-violet-500/50
              min-w-[180px]
            "
                    >
                        <option value="" className="bg-[#0a0a14] text-white">All Categories</option>
                        {categories.map((cat) => (
                            <option key={cat} value={cat} className="bg-[#0a0a14] text-white">
                                {cat}
                            </option>
                        ))}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
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
              px-6 py-3 pr-12
              bg-white/5 backdrop-blur-sm
              border border-white/10
              rounded-lg
              text-white text-sm
              tracking-wide
              cursor-pointer
              transition-all duration-300
              hover:bg-white/10 hover:border-white/20
              focus:outline-none focus:ring-2 focus:ring-violet-500/50
              min-w-[180px]
            "
                    >
                        <option value="" className="bg-[#0a0a14] text-white">All Collections</option>
                        {collections.map((col) => (
                            <option key={col} value={col} className="bg-[#0a0a14] text-white">
                                {col}
                            </option>
                        ))}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                        <svg className="w-4 h-4 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                </div>

                {/* Reset Button */}
                {hasActiveFilters && (
                    <button
                        onClick={handleReset}
                        className="
              px-6 py-3
              bg-violet-500/20 backdrop-blur-sm
              border border-violet-500/30
              rounded-lg
              text-violet-300 text-sm font-medium
              tracking-wide
              transition-all duration-300
              hover:bg-violet-500/30 hover:border-violet-500/50
              hover:text-violet-200
              focus:outline-none focus:ring-2 focus:ring-violet-500/50
              flex items-center gap-2
            "
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Reset Filters
                    </button>
                )}
            </div>

            {/* Active Filters Display */}
            {hasActiveFilters && (
                <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                    <span className="text-xs text-white/40 tracking-wide">Active filters:</span>
                    {selectedCategory && (
                        <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-white/70">
                            {selectedCategory}
                        </span>
                    )}
                    {selectedCollection && (
                        <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-white/70">
                            {selectedCollection}
                        </span>
                    )}
                </div>
            )}
        </div>
    );
}
