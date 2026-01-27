/**
 * Support Tickets Page
 * FANG-Level Refactored with URL-based state and modular architecture
 * Displays all user support tickets with filtering, sorting, and search
 */

"use client";

import { Suspense, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/contexts/AuthContext";
import { Pagination } from "@/app/components/ui/navigation/Pagination";
import { useTickets, useTicketsFilters } from './hooks';
import {
    TicketsHeader,
    TicketsFilters,
    TicketCard,
    TicketsSkeleton,
    TicketsEmpty,
    TicketsError
} from './components';

function TicketListPageContent() {
    const router = useRouter();
    const { isAuthenticated, isLoading: authLoading } = useAuth();


    // URL-based filters (shareable links!)
    const { filters, setFilters, clearFilters, hasActiveFilters } = useTicketsFilters();

    // Fetch tickets with filters
    const { tickets, isLoading, error, totalPages, retry } = useTickets(filters);

    // Prevent browser scroll restoration - force scroll to top
    useEffect(() => {
        // Disable automatic scroll restoration
        if ('scrollRestoration' in window.history) {
            window.history.scrollRestoration = 'manual';
        }

        // Force immediate scroll to top without animation
        window.scrollTo(0, 0);

        // Cleanup: restore default behavior when component unmounts
        return () => {
            if ('scrollRestoration' in window.history) {
                window.history.scrollRestoration = 'auto';
            }
        };
    }, []);

    // Redirect to login if not authenticated
    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            router.push('/login?redirect=/account/tickets');
        }
    }, [authLoading, isAuthenticated, router]);



    // Handle page change
    const handlePageChange = (page: number) => {
        setFilters({ page });
        // Note: Removed automatic scroll to prevent unwanted scrolling on page load
        // User can manually scroll if needed
    };

    // Show skeleton during auth check or data loading
    if (authLoading || isLoading) {
        return (
            <div className="min-h-screen brand-bg-dusk pt-[var(--header-height)]">
                <div className="max-w-screen-lg mx-auto px-4 sm:px-6 lg:px-10 pb-10 pt-8">
                    <TicketsSkeleton count={6} />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen brand-bg-dusk pt-[var(--header-height)]">
            <div className="max-w-screen-lg mx-auto px-4 sm:px-6 lg:px-10 pb-10 pt-8">
                {/* Header */}
                <TicketsHeader orderId={filters.orderId} />

                {/* Filters */}
                <TicketsFilters
                    filters={filters}
                    onFilterChange={setFilters}
                    onClearFilters={clearFilters}
                    hasActiveFilters={hasActiveFilters}
                />

                {/* Content */}
                {isLoading ? (
                    <TicketsSkeleton count={6} />
                ) : error ? (
                    <TicketsError onRetry={retry} />
                ) : tickets.length === 0 ? (
                    <TicketsEmpty orderId={filters.orderId} />
                ) : (
                    <>
                        {/* Ticket Cards */}
                        <div className="grid gap-4">
                            {tickets.map((ticket) => (
                                <TicketCard key={ticket.id} ticket={ticket} />
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="mt-10">
                                <Pagination
                                    currentPage={filters.page || 1}
                                    totalPages={totalPages}
                                    onPageChange={handlePageChange}
                                />
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

export default function TicketListPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen brand-bg-dusk pt-[var(--header-height)]">
                <div className="max-w-screen-lg mx-auto px-4 sm:px-6 lg:px-10 pb-10 pt-8">
                    <TicketsSkeleton count={6} />
                </div>
            </div>
        }>
            <TicketListPageContent />
        </Suspense>
    );
}
