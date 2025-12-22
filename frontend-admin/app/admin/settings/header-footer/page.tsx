/**
 * Header & Footer Settings
 * Edit brand name and footer content
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FiArrowLeft } from 'react-icons/fi';

export default function HeaderFooterSettings() {
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        setIsSaving(true);
        // TODO: Save to backend
        setTimeout(() => setIsSaving(false), 1000);
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
            <div className="max-w-4xl mx-auto">
                {/* Back Button */}
                <Link
                    href="/admin/settings"
                    className="inline-flex items-center gap-2 text-gray-600 hover:text-black mb-6 transition-colors"
                >
                    <FiArrowLeft size={20} />
                    <span className="text-sm font-medium">Back to Settings</span>
                </Link>

                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Header & Footer</h1>
                    <p className="mt-2 text-sm text-gray-600">
                        Customize your site branding and footer content
                    </p>
                </div>

                {/* Form Sections */}
                <div className="space-y-6">
                    {/* Header Section */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="border-b border-gray-200 pb-4 mb-6">
                            <h2 className="text-lg font-semibold text-gray-900">Header</h2>
                            <p className="text-sm text-gray-600 mt-1">Your site's brand identity</p>
                        </div>

                        <div className="space-y-6">
                            {/* Brand Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Brand Name
                                </label>
                                <input
                                    type="text"
                                    placeholder="HUMANTEE"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
                                />
                                <p className="text-xs text-gray-500 mt-1">Displayed in the top-left corner</p>
                            </div>

                            {/* Logo Upload */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Logo
                                </label>
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <p className="mt-2 text-sm text-gray-600">Upload coming soon</p>
                                    <p className="text-xs text-gray-500 mt-1">PNG, SVG, or JPG (max 2MB)</p>
                                </div>
                                <p className="text-xs text-gray-500 mt-1">Upload your site logo</p>
                            </div>
                        </div>
                    </div>

                    {/* Footer Section */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="border-b border-gray-200 pb-4 mb-6">
                            <h2 className="text-lg font-semibold text-gray-900">Footer</h2>
                            <p className="text-sm text-gray-600 mt-1">Footer branding and links</p>
                        </div>

                        <div className="space-y-6">
                            {/* Footer Tagline */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Footer Tagline
                                </label>
                                <input
                                    type="text"
                                    placeholder="A luxury shopping experience crafted with minimalist precision."
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
                                />
                            </div>

                            {/* Copyright */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Copyright Text
                                </label>
                                <input
                                    type="text"
                                    placeholder="HUMANTEE"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
                                />
                                <p className="text-xs text-gray-500 mt-1">Year auto-updates (e.g., © 2025 HUMANTEE)</p>
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Contact Email
                                </label>
                                <input
                                    type="email"
                                    placeholder="humanteeofficial@gmail.com"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
                                />
                            </div>

                            {/* Phone */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Contact Phone
                                </label>
                                <input
                                    type="tel"
                                    placeholder="+91 7780-661493"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
                                />
                            </div>

                            {/* Instagram */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Instagram URL
                                </label>
                                <input
                                    type="url"
                                    placeholder="https://www.instagram.com/humanteeofficial/"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
                                />
                            </div>

                            {/* Maps */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Location (Google Maps)
                                </label>
                                <input
                                    type="url"
                                    placeholder="https://maps.google.com"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
                                />
                            </div>

                            {/* Footer Scrolling Text */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Footer Scrolling Text
                                </label>
                                <textarea
                                    rows={3}
                                    placeholder="© 2025 HUMANTEE • PREMIUM HANDCRAFTED APPAREL • LUXURY FASHION"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black resize-none font-mono text-sm"
                                />
                                <p className="text-xs text-gray-500 mt-1">One message per line. Scrolls at the bottom of footer.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Save Button */}
                <div className="mt-8 flex justify-end gap-4">
                    <Link
                        href="/admin/settings"
                        className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        Cancel
                    </Link>
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        {isSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </div>
        </div>
    );
}
