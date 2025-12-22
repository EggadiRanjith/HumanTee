/**
 * Product Information Settings
 * Edit product page details: material, shipping, size info
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FiArrowLeft } from 'react-icons/fi';

export default function ProductInfoSettings() {
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
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Product Information</h1>
                    <p className="mt-2 text-sm text-gray-600">
                        Manage product page details and size guide
                    </p>
                </div>

                {/* Form Sections */}
                <div className="space-y-6">
                    {/* Material & Care */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="border-b border-gray-200 pb-4 mb-6">
                            <h2 className="text-lg font-semibold text-gray-900">Material & Care</h2>
                            <p className="text-sm text-gray-600 mt-1">Product material and care instructions</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Care Instructions
                            </label>
                            <textarea
                                rows={6}
                                placeholder="100% Premium Cotton&#10;Pre-shrunk fabric&#10;Machine wash cold with like colors&#10;Do not bleach • Tumble dry low&#10;Iron inside out if needed"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black resize-none font-mono text-sm"
                            />
                            <p className="text-xs text-gray-500 mt-1">One instruction per line. Will be displayed as bullet points.</p>
                        </div>
                    </div>

                    {/* Shipping & Returns */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="border-b border-gray-200 pb-4 mb-6">
                            <h2 className="text-lg font-semibold text-gray-900">Shipping & Returns</h2>
                            <p className="text-sm text-gray-600 mt-1">Shipping and return information for products</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Shipping & Return Details
                            </label>
                            <textarea
                                rows={6}
                                placeholder="Free shipping on orders over ₹2,000&#10;Standard delivery: 3-4 business days&#10;Express delivery available&#10;30-day return policy&#10;Easy exchanges available"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black resize-none font-mono text-sm"
                            />
                            <p className="text-xs text-gray-500 mt-1">One detail per line. Will be displayed as bullet points.</p>
                        </div>
                    </div>

                    {/* Size & Fit */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="border-b border-gray-200 pb-4 mb-6">
                            <h2 className="text-lg font-semibold text-gray-900">Size & Fit</h2>
                            <p className="text-sm text-gray-600 mt-1">Size and fit guide information</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Fit Details
                            </label>
                            <textarea
                                rows={6}
                                placeholder="Unisex relaxed fit&#10;True to size&#10;Model is 6'0&quot; wearing size M&#10;Chest: 21&quot; (size M)&#10;Length: 28&quot; (size M)"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black resize-none font-mono text-sm"
                            />
                            <p className="text-xs text-gray-500 mt-1">One detail per line. Will be displayed as bullet points.</p>
                        </div>
                    </div>

                    {/* Size Guide */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="border-b border-gray-200 pb-4 mb-6">
                            <h2 className="text-lg font-semibold text-gray-900">Size Guide</h2>
                            <p className="text-sm text-gray-600 mt-1">Size chart image or table</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Size Guide Image
                            </label>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
                                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <p className="mt-2 text-sm text-gray-600">Size guide upload coming soon</p>
                                <p className="text-xs text-gray-500 mt-1">PNG, JPG (recommended 1200x800px)</p>
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
