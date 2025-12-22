/**
 * Shipping, Terms & Privacy Settings
 * Edit shipping info and legal policies
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FiArrowLeft } from 'react-icons/fi';

export default function PoliciesSettings() {
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
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Shipping, Terms & Privacy</h1>
                    <p className="mt-2 text-sm text-gray-600">
                        Manage shipping settings and legal policies
                    </p>
                </div>

                {/* Form Sections */}
                <div className="space-y-6">
                    {/* Shipping Policy */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="border-b border-gray-200 pb-4 mb-6">
                            <h2 className="text-lg font-semibold text-gray-900">Shipping Policy</h2>
                            <p className="text-sm text-gray-600 mt-1">Full shipping policy text</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Policy Content
                            </label>
                            <textarea
                                rows={8}
                                placeholder="Enter your shipping policy details here..."
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black resize-none font-mono text-sm"
                            />
                            <p className="text-xs text-gray-500 mt-1">Rich text editor coming soon</p>
                        </div>
                    </div>

                    {/* Terms & Conditions */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="border-b border-gray-200 pb-4 mb-6">
                            <h2 className="text-lg font-semibold text-gray-900">Terms & Conditions</h2>
                            <p className="text-sm text-gray-600 mt-1">Your terms of service</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Terms Content
                            </label>
                            <textarea
                                rows={8}
                                placeholder="Enter your terms and conditions here..."
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black resize-none font-mono text-sm"
                            />
                            <p className="text-xs text-gray-500 mt-1">Rich text editor coming soon</p>
                        </div>
                    </div>

                    {/* Privacy Policy */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="border-b border-gray-200 pb-4 mb-6">
                            <h2 className="text-lg font-semibold text-gray-900">Privacy Policy</h2>
                            <p className="text-sm text-gray-600 mt-1">Your privacy policy</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Privacy Content
                            </label>
                            <textarea
                                rows={8}
                                placeholder="Enter your privacy policy here..."
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black resize-none font-mono text-sm"
                            />
                            <p className="text-xs text-gray-500 mt-1">Rich text editor coming soon</p>
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
