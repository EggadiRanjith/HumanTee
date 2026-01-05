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
    const [brandName, setBrandName] = useState(BRAND_CONFIG.fallback);
    const [logoUrl, setLogoUrl] = useState<string | null>(null);

    // Fetch brand name and logo from API
    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/settings/header-footer`)
            .then(res => res.ok ? res.json() : null)
            .then(data => {
                if (data?.brand_name) {
                    setBrandName(data.brand_name);
                }
                if (data?.logo_url) {
                    setLogoUrl(data.logo_url);
                }
            })
            .catch(() => {
                // Use fallback on error
            });
    }, []);

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
                    <h1 className="text-lg font-semibold text-black">{brandName} {BRAND_CONFIG.adminSuffix}</h1>
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
                    {logoUrl ? (
                        <div className="flex items-center gap-3">
                            <Image
                                src={logoUrl}
                                alt={brandName}
                                width={40}
                                height={40}
                                className="object-contain"
                                priority
                            />
                            <div>
                                <h1 className="text-xl font-semibold text-black">{brandName}</h1>
                                <p className="text-xs text-gray-600">{BRAND_CONFIG.adminSuffix} Panel</p>
                            </div>
                        </div>
                    ) : (
                        <>
                            <h1 className="text-xl font-semibold text-black">{brandName}</h1>
                            <p className="text-xs text-gray-600 mt-1">{BRAND_CONFIG.adminSuffix} Panel</p>
                        </>
                    )}
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
