import Link from 'next/link';

/**
 * 403 Forbidden Page
 * System page for unauthorized access
 */
export default function ForbiddenPage() {
    return (
        <div className="min-h-screen bg-brand-bg flex items-center justify-center px-4">
            <div className="text-center">
                <h1 className="text-6xl font-bold text-white mb-4">403</h1>
                <h2 className="text-2xl font-semibold text-white mb-4">Access Forbidden</h2>
                <p className="text-white/60 mb-8 max-w-md">
                    You don't have permission to access this page. Admin access required.
                </p>
                <div className="flex gap-4 justify-center">
                    <Link
                        href="/"
                        className="bg-white text-black px-6 py-3 rounded font-medium hover:bg-white/90 transition-colors"
                    >
                        Return Home
                    </Link>
                    <Link
                        href="/login"
                        className="bg-white/10 text-white px-6 py-3 rounded font-medium hover:bg-white/20 transition-colors"
                    >
                        Login
                    </Link>
                </div>
            </div>
        </div>
    );
}
