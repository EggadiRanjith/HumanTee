import { redirect } from 'next/navigation';
import { Sidebar } from './components/Sidebar';
import { getServerUser } from '@/lib/auth';

/**
 * Admin Layout
 * Clean, professional, mobile-responsive
 * Server-side role enforcement
 */
export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // Server-side role check
    const user = await getServerUser();
    if (!user || user.role?.toLowerCase() !== 'admin') {
        redirect('/login');
    }

    return (
        <div className="min-h-screen bg-gray-50">
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
