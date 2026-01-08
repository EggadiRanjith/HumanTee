"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import { Sidebar } from './components/Sidebar';
import { NavigationLoader } from '../components/NavigationLoader';

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
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-gray-600">Loading...</div>
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
                    {children}
                </div>
            </main>
        </div>
    );
}
