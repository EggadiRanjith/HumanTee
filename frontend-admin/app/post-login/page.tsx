import { redirect } from 'next/navigation';
import { getServerUser } from '@/lib/auth';
import Link from 'next/link';

/**
 * Post-Login Choice Page
 * Clean, professional, mobile-responsive
 */
export default async function PostLoginPage() {
    const user = await getServerUser();

    if (!user || user.role?.toLowerCase() !== 'admin') {
        redirect('/');
    }

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-2xl font-semibold text-black mb-2">
                            Welcome Back
                        </h1>
                        <p className="text-sm text-gray-600">
                            Where would you like to go?
                        </p>
                    </div>

                    {/* Choice Cards */}
                    <div className="space-y-3">
                        <Link
                            href={process.env.NEXT_PUBLIC_CUSTOMER_URL || 'http://localhost:3000'}
                            className="block w-full bg-gray-100 hover:bg-gray-200 text-black px-6 py-4 rounded-lg font-medium transition-colors text-center border border-gray-300"
                        >
                            <div className="text-base">View Website</div>
                            <div className="text-xs text-gray-600 mt-1">Customer storefront</div>
                        </Link>

                        <Link
                            href="/admin/orders"
                            className="block w-full bg-black hover:bg-gray-900 text-white px-6 py-4 rounded-lg font-medium transition-colors text-center"
                        >
                            <div className="text-base">Admin Panel</div>
                            <div className="text-xs text-gray-400 mt-1">Manage operations</div>
                        </Link>
                    </div>

                    {/* Footer */}
                    <div className="mt-6 pt-6 border-t border-gray-200">
                        <p className="text-xs text-gray-500 text-center">
                            Logged in as <span className="font-medium">{user.email}</span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
