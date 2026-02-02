"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import { Sidebar } from './components/Sidebar';
import { NavigationLoader } from '../components/NavigationLoader';

import { DashboardErrorBoundary } from './components/DashboardErrorBoundary';

/**
 * Admin Layout (Client Component)
 * Uses AuthContext for authentication
 */
export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const { user, isLoading } = useAuth();

    useEffect(() => {
        // Redirect to login if not authenticated as admin
        if (!isLoading && (!user || user.role?.toLowerCase() !== 'admin')) {
            router.push('/login');
        }
    }, [user, isLoading, router]);

    // Show loading while checking auth
    if (isLoading) {
        return (
            <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black/70 backdrop-blur-sm">
                <div className="relative">
                    {/* Spinning circle */}
                    <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-2 border-white/20 border-t-white animate-spin" />

                    {/* T-shirt icon */}
                    <div className="absolute inset-0 flex items-center justify-center animate-pulse">
                        <svg
                            viewBox="0 0 100 100"
                            className="w-12 h-12 sm:w-16 sm:h-16 text-white"
                            fill="currentColor"
                        >
                            <path d="M30 15 L20 20 L5 35 L15 45 L25 35 L25 85 L75 85 L75 35 L85 45 L95 35 L80 20 L70 15 L60 25 C55 30 45 30 40 25 Z" />
                        </svg>
                    </div>
                </div>

                {/* Loading text */}
                <p className="mt-6 text-sm text-white/70 uppercase tracking-widest font-light">
                    Loading
                </p>
            </div>
        );
    }

    // Don't render if not authenticated (will redirect)
    if (!user || user.role?.toLowerCase() !== 'admin') {
        return null;
    }

    return (
        <div className="admin-panel min-h-screen bg-gray-50">
            <NavigationLoader />
            <Sidebar />

            {/* Main Content */}
            <main className="lg:ml-64 pt-16 lg:pt-0">
                <div className="p-4 lg:p-6">
                    <DashboardErrorBoundary>
                        {children}
                    </DashboardErrorBoundary>
                </div>
            </main>
        </div>
    );
}
