/**
 * Support Tickets Page
 */

"use client";

import { Suspense, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/contexts/AuthContext";
import { Pagination } from "@/app/components/ui/navigation/Pagination";
import { useTickets, useTicketsFilters } from "./hooks";
import {
  TicketsHeader,
  TicketCard,
  TicketsSkeleton,
  TicketsEmpty,
  TicketsError,
} from "./components";

/**
 * 🔧 LOCAL TYPE — MUST MATCH TicketCard PROPS
 * This is why the previous build failed.
 */
type Ticket = {
  id: string;
  ticketNumber: string;
  subject: string;
  category: string;
  status: string;
  createdAt: string;
  updatedAt?: string;
};

function TicketListPageContent() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  const { filters, setFilters } = useTicketsFilters();
  const { tickets, isLoading, error, totalPages, retry } = useTickets(filters);

  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    window.scrollTo(0, 0);

    return () => {
      if ("scrollRestoration" in window.history) {
        window.history.scrollRestoration = "auto";
      }
    };
  }, []);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login?redirect=/account/tickets");
    }
  }, [authLoading, isAuthenticated, router]);

  const handlePageChange = (page: number) => {
    setFilters({ page });
  };

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
        <TicketsHeader orderId={filters.orderId} />

        {error ? (
          <TicketsError onRetry={retry} />
        ) : tickets.length === 0 ? (
          <TicketsEmpty orderId={filters.orderId} />
        ) : (
          <>
            <div className="grid gap-4">
              {(tickets as Ticket[]).map((ticket) => (
                <TicketCard key={ticket.id} ticket={ticket} />
              ))}
            </div>

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
    <Suspense
      fallback={
        <div className="min-h-screen brand-bg-dusk pt-[var(--header-height)]">
          <div className="max-w-screen-lg mx-auto px-4 sm:px-6 lg:px-10 pb-10 pt-8">
            <TicketsSkeleton count={6} />
          </div>
        </div>
      }
    >
      <TicketListPageContent />
    </Suspense>
  );
}
