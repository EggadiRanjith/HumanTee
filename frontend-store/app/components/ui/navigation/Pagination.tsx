/**
 * Pagination Component
 * Elegant, touch-optimized pagination for the shop page
 */

"use client";

import React from 'react';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
    currentPage,
    totalPages,
    onPageChange,
}) => {
    if (totalPages <= 1) return null;

    const renderPageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5;

        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(
                <button
                    key={i}
                    onClick={() => onPageChange(i)}
                    aria-label={`Go to page ${i}`}
                    className={`
                        w-11 h-11 rounded-lg flex items-center justify-center text-sm transition-all duration-300
                        ${currentPage === i
                            ? 'bg-violet-500 text-white shadow-lg shadow-violet-500/25'
                            : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white border border-white/10'}
                    `}
                >
                    {i}
                </button>
            );
        }
        return pages;
    };

    return (
        <div className="flex items-center justify-center gap-2 mt-12 mb-8">
            <button
                onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="
                    p-2 rounded-lg bg-white/5 border border-white/10 text-white/60 
                    hover:bg-white/10 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed
                    transition-all duration-300
                "
                aria-label="Previous Page"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
            </button>

            <div className="flex items-center gap-2">
                {renderPageNumbers()}
            </div>

            <button
                onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="
                    p-2 rounded-lg bg-white/5 border border-white/10 text-white/60 
                    hover:bg-white/10 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed
                    transition-all duration-300
                "
                aria-label="Next Page"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
            </button>
        </div>
    );
};
