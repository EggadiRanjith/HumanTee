'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { BRAND_CONFIG } from '@/lib/config/brand';

/**
 * Admin Sidebar
 * Clean, professional, mobile-responsive
 * Mobile: Hamburger menu
 * Desktop: Fixed sidebar
 */
export function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [brandName] = useState(BRAND_CONFIG.fallback);
    const [logoUrl] = useState<string | null>(null);

    // Brand settings removed - using static fallback to avoid 404


    const links = [
        { href: '/admin', label: 'Dashboard', icon: '📊' },
        { href: '/admin/orders', label: 'Orders', icon: '📦' },
        { href: '/admin/products', label: 'Products', icon: '👕' },
        { href: '/admin/customers', label: 'Customers', icon: '👥' },
        { href: '/admin/discounts', label: 'Discounts', icon: '🎫' },
        { href: '/admin/tickets', label: 'Support', icon: '💬' },
        { href: '/admin/analytics', label: 'Analytics', icon: '📈' },
        { href: '/admin/audit-logs', label: 'Audit Logs', icon: '📋' },
        { href: '/admin/user-logs', label: 'User Logs', icon: '👥' },
        { href: '/admin/settings', label: 'Settings', icon: '⚙️' },
    ];

    const handleLogout = () => {
        localStorage.removeItem('auth_token');
        document.cookie = 'auth_token=; path=/; max-age=0';
        router.push('/login');
    };

    return (
        <>
            {/* Mobile Header */}
            <div className="lg:hidden fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50">
                <div className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                            <Image
                                src="/images/humantee-logo.png"
                                alt={brandName}
                                width={24}
                                height={24}
                                className="object-contain"
                            />
                        </div>
                        <h1 className="text-lg font-semibold text-black">{brandName} {BRAND_CONFIG.adminSuffix}</h1>
                    </div>
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-black"
                        aria-label="Toggle menu"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {isMobileMenuOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/50 z-40"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`
          fixed top-0 left-0 h-full bg-white border-r border-gray-200 z-50
          transition-transform duration-300 ease-in-out
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:w-64 w-64
        `}
            >
                {/* Header */}
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center flex-shrink-0">
                            <Image
                                src="/images/humantee-logo.png"
                                alt={brandName}
                                width={32}
                                height={32}
                                className="object-contain"
                                priority
                            />
                        </div>
                        <div>
                            <h1 className="text-xl font-semibold text-black">{brandName}</h1>
                            <p className="text-xs text-gray-600">{BRAND_CONFIG.adminSuffix} Panel</p>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="p-4 space-y-1">
                    {links.map((link) => {
                        const isActive = link.href === '/admin'
                            ? pathname === '/admin'
                            : pathname.startsWith(link.href);

                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors
                  ${isActive
                                        ? 'bg-black text-white'
                                        : 'text-gray-700 hover:bg-gray-100'
                                    }
                `}
                            >
                                <span className="text-lg">{link.icon}</span>
                                <span>{link.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer */}
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg font-medium transition-colors"
                    >
                        <span className="text-lg">🚪</span>
                        <span>Logout</span>
                    </button>
                </div>
            </aside>
        </>
    );
}
