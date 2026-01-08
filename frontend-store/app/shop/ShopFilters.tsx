/**
 * ShopFilters Component
 * Pyramid layout with natural wrapping - no horizontal scroll
 */

"use client";

import { useState, useEffect } from 'react';
import { ShopFilters as ShopFiltersType } from './hooks';

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

    useEffect(() => {
        setSelectedCategory(currentFilters.category || '');
        setSelectedCollection(currentFilters.collection || '');
        setSelectedSort(currentFilters.sort || '');
    }, [currentFilters]);

    useEffect(() => {
        onFilterChange({
            category: selectedCategory || undefined,
            collection: selectedCollection || undefined,
            sort: selectedSort || undefined,
        });
    }, [selectedCategory, selectedCollection, selectedSort]);

    return (
        <div className="mb-6 sm:mb-8">
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
                <div className="relative">
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        aria-label="Filter by category"
                        className="appearance-none px-3 py-2 pr-8 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full text-white text-[12px] font-medium cursor-pointer transition-all duration-200 hover:bg-white/10 hover:border-white/20 focus:outline-none focus:ring-2 focus:ring-white/20 min-w-[120px]"
                    >
                        <option value="" style={{ backgroundColor: '#1f2937', color: '#ffffff' }}>All Categories</option>
                        {categories.length === 0 ? (
                            <option disabled style={{ backgroundColor: '#1f2937', color: '#9ca3af' }}>No categories</option>
                        ) : (
                            categories.map((category) => (
                                <option key={category} value={category} style={{ backgroundColor: '#1f2937', color: '#ffffff' }}>
                                    {category}
                                </option>
                            ))
                        )}
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                        <svg className="w-4 h-4 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                </div>
                <div className="relative">
                    <select
                        value={selectedCollection}
                        onChange={(e) => setSelectedCollection(e.target.value)}
                        aria-label="Filter by collection"
                        className="appearance-none px-3 py-2 pr-8 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full text-white text-[12px] font-medium cursor-pointer transition-all duration-200 hover:bg-white/10 hover:border-white/20 focus:outline-none focus:ring-2 focus:ring-white/20 min-w-[120px]"
                    >
                        <option value="" style={{ backgroundColor: '#1f2937', color: '#ffffff' }}>All Collections</option>
                        {collections.length === 0 ? (
                            <option disabled style={{ backgroundColor: '#1f2937', color: '#9ca3af' }}>No collections</option>
                        ) : (
                            collections.map((collection) => (
                                <option key={collection} value={collection} style={{ backgroundColor: '#1f2937', color: '#ffffff' }}>
                                    {collection.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                </option>
                            ))
                        )}
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                        <svg className="w-4 h-4 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                </div>
                <div className="relative">
                    <select
                        value={selectedSort}
                        onChange={(e) => setSelectedSort(e.target.value)}
                        aria-label="Sort products"
                        className="appearance-none text-center px-3 py-2 pr-8 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full text-white text-[12px] font-medium cursor-pointer transition-all duration-200 hover:bg-white/10 hover:border-white/20 focus:outline-none focus:ring-2 focus:ring-white/20 min-w-[120px]"
                    >
                        <option value="" style={{ backgroundColor: '#1f2937', color: '#ffffff' }}>Sort By</option>
                        {sortOptions.length === 0 ? (
                            <option disabled style={{ backgroundColor: '#1f2937', color: '#9ca3af' }}>No options</option>
                        ) : (
                            sortOptions.map((option) => (
                                <option key={option.value} value={option.value} style={{ backgroundColor: '#1f2937', color: '#ffffff' }}>
                                    {option.label}
                                </option>
                            ))
                        )}
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                        <svg className="w-4 h-4 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                </div>
                {activeFilterCount > 0 && (
                    <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-violet-500/20 border border-violet-500/30 rounded-full">
                        <span className="text-[10px] text-violet-300 font-medium whitespace-nowrap uppercase tracking-wide">
                            {activeFilterCount} Active
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
}
