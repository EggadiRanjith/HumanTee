'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import apiClient from '@/lib/api-client';

export function PendingTicketsWidget() {
    const { data, isLoading } = useQuery({
        queryKey: ['tickets', 'unviewed'],
        queryFn: async () => {
            const response = await apiClient.get('/admin/tickets/stats/unviewed');
            return response.data;
        },
        staleTime: 30 * 1000, // 30 seconds
        refetchInterval: 60 * 1000, // Refetch every minute
    });

    const count = data?.count || 0;

    // Don't show if no pending tickets
    if (!isLoading && count === 0) {
        return null;
    }

    if (isLoading) {
        return (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg animate-pulse">
                <div className="h-12 bg-red-100 rounded"></div>
            </div>
        );
    }

    return (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
            <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-3">
                    <div className="text-red-600">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                        </svg>
                    </div>
                    <div>
                        <h3 className="font-semibold text-red-900 text-sm md:text-base">
                            💬 {count} New Support Ticket{count > 1 ? 's' : ''}
                        </h3>
                        <p className="text-xs md:text-sm text-red-700 mt-0.5">
                            Customer{count > 1 ? 's' : ''} waiting for response
                        </p>
                    </div>
                </div>
                <Link
                    href="/admin/tickets?status=open"
                    className="px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
                >
                    View Tickets
                </Link>
            </div>
        </div>
    );
}
