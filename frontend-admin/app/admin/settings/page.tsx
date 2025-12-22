/**
 * Site Settings Dashboard
 * Card-based overview of all settings categories
 */

'use client';

import Link from 'next/link';
import { FiChevronRight } from 'react-icons/fi';

const settingsCards = [
    {
        title: 'Header & Footer',
        description: 'Customize your site branding and footer content',
        items: ['Brand name', 'Logo', 'Footer text', 'Social links', 'Contact info'],
        href: '/admin/settings/header-footer',
        icon: '🎨',
    },
    {
        title: 'Homepage',
        description: 'Manage all homepage content and sections',
        items: ['Hero slides', 'Banner messages', 'Reviews section', 'CTA buttons'],
        href: '/admin/settings/homepage',
        icon: '🏠',
    },
    {
        title: 'Product Information',
        description: 'Edit product page details and size guide',
        items: ['Material & care', 'Shipping & returns', 'Size & fit', 'Size guide'],
        href: '/admin/settings/product-info',
        icon: '👕',
    },
    {
        title: 'Shipping & Taxes',
        description: 'Configure shipping zones and tax rates',
        items: ['Shipping zones', 'Zone-based rates', 'Free shipping', 'Tax settings'],
        href: '/admin/settings/shipping-taxes',
        icon: '📦',
    },
    {
        title: 'Shipping, Terms & Privacy',
        description: 'Edit shipping info, terms, privacy, and legal policies',
        items: ['Shipping policy', 'Terms & conditions', 'Privacy policy'],
        href: '/admin/settings/policies',
        icon: '📜',
    },
];

export default function SettingsPage() {
    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Site Settings</h1>
                    <p className="mt-2 text-sm text-gray-600">
                        Manage your storefront appearance and content
                    </p>
                </div>

                {/* Settings Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {settingsCards.map((card) => (
                        <Link
                            key={card.href}
                            href={card.href}
                            className="group block bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md hover:border-gray-300 transition-all duration-200"
                        >
                            <div className="p-6">
                                {/* Header */}
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                        <span className="text-3xl">{card.icon}</span>
                                        <h2 className="text-lg font-semibold text-gray-900 group-hover:text-black">
                                            {card.title}
                                        </h2>
                                    </div>
                                    <FiChevronRight className="text-gray-400 group-hover:text-black transition-colors" size={20} />
                                </div>

                                {/* Description */}
                                <p className="text-sm text-gray-600 mb-4">
                                    {card.description}
                                </p>

                                {/* Editable Items Tags */}
                                <div className="flex flex-wrap gap-2">
                                    {card.items.map((item) => (
                                        <span
                                            key={item}
                                            className="px-2 py-1 text-xs font-medium text-gray-700 bg-gray-100 rounded-md"
                                        >
                                            {item}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Helper Text */}
                <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-800">
                        <span className="font-semibold">💡 Tip:</span> Changes are saved automatically. Click any card to customize that section.
                    </p>
                </div>
            </div>
        </div>
    );
}
