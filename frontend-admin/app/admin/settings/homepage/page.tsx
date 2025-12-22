/**
 * Homepage Settings
 * Edit all homepage content: hero, banner, and reviews
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FiArrowLeft } from 'react-icons/fi';

export default function HomepageSettings() {
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
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Homepage Content</h1>
                    <p className="mt-2 text-sm text-gray-600">
                        Manage all homepage sections and content
                    </p>
                </div>

                {/* Form Sections */}
                <div className="space-y-6">
                    {/* Hero Section */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="border-b border-gray-200 pb-4 mb-6">
                            <h2 className="text-lg font-semibold text-gray-900">Hero Section</h2>
                            <p className="text-sm text-gray-600 mt-1">Main hero carousel - first video, then image slides</p>
                        </div>

                        <div className="space-y-8">
                            {/* Video Slide (First Slide - Always) */}
                            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                                <h3 className="text-sm font-semibold text-gray-800 mb-4">Slide 1 - Video (Opening)</h3>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Video File
                                    </label>
                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                        </svg>
                                        <p className="mt-2 text-sm text-gray-600">Video upload coming soon</p>
                                        <p className="text-xs text-gray-500 mt-1">MP4, WEBM (max 50MB)</p>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">Currently: /video/introvideo.mp4</p>
                                </div>
                            </div>

                            {/* Image Slide 2 */}
                            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-sm font-semibold text-gray-800">Slide 2 - Image Banner</h3>
                                </div>

                                <div className="space-y-4">
                                    {/* Images */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Desktop Image
                                            </label>
                                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                                                <svg className="mx-auto h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                                <p className="text-xs text-gray-500 mt-1">Upload soon</p>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Mobile Image
                                            </label>
                                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                                                <svg className="mx-auto h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                                <p className="text-xs text-gray-500 mt-1">Upload soon</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Text Content */}
                                    <div className="grid grid-cols-1 gap-4">
                                        <input
                                            type="text"
                                            placeholder="Heading (e.g., Years Of Legacy)"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black text-sm"
                                        />
                                        <input
                                            type="text"
                                            placeholder="Subheading 1 (e.g., Since 1931)"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black text-sm"
                                        />
                                        <input
                                            type="text"
                                            placeholder="Subheading 2 (e.g., Available in all sizes)"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black text-sm"
                                        />
                                    </div>

                                    {/* Button */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <input
                                            type="text"
                                            placeholder="Button Text (e.g., Shop Now)"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black text-sm"
                                        />
                                        <input
                                            type="text"
                                            placeholder="Button URL (e.g., /shop)"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black text-sm"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Image Slide 3 */}
                            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-sm font-semibold text-gray-800">Slide 3 - Image Banner</h3>
                                    <button className="text-red-600 hover:text-red-800 text-sm font-medium">Remove</button>
                                </div>

                                <div className="space-y-4">
                                    {/* Images */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Desktop Image
                                            </label>
                                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                                                <svg className="mx-auto h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                                <p className="text-xs text-gray-500 mt-1">Upload soon</p>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Mobile Image
                                            </label>
                                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                                                <svg className="mx-auto h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                                <p className="text-xs text-gray-500 mt-1">Upload soon</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Text Content */}
                                    <div className="grid grid-cols-1 gap-4">
                                        <input
                                            type="text"
                                            placeholder="Heading"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black text-sm"
                                        />
                                        <input
                                            type="text"
                                            placeholder="Subheading 1"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black text-sm"
                                        />
                                        <input
                                            type="text"
                                            placeholder="Subheading 2 (optional)"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black text-sm"
                                        />
                                    </div>

                                    {/* Button */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <input
                                            type="text"
                                            placeholder="Button Text"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black text-sm"
                                        />
                                        <input
                                            type="text"
                                            placeholder="Button URL"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black text-sm"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Add Slide Button */}
                            <button className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 hover:text-gray-800 transition-colors flex items-center justify-center gap-2">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                <span className="text-sm font-medium">Add Another Slide</span>
                            </button>
                        </div>
                    </div>

                    {/* Homepage Banner Section */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="border-b border-gray-200 pb-4 mb-6">
                            <h2 className="text-lg font-semibold text-gray-900">Homepage Scrolling Banner</h2>
                            <p className="text-sm text-gray-600 mt-1">Messages that scroll between products and reviews</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Banner Messages
                            </label>
                            <textarea
                                rows={5}
                                placeholder="FREE SHIPPING ON ORDERS ABOVE ₹2000&#10;LUXURY PREMIUM CRAFTSMANSHIP&#10;HANDCRAFTED WITH PRECISION&#10;SUSTAINABLE FASHION CHOICE&#10;LIMITED EDITION COLLECTIONS"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black resize-none font-mono text-sm"
                            />
                            <p className="text-xs text-gray-500 mt-1">One message per line. Will scroll continuously on homepage.</p>
                        </div>
                    </div>

                    {/* Reviews Section */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="border-b border-gray-200 pb-4 mb-6">
                            <h2 className="text-lg font-semibold text-gray-900">Customer Reviews</h2>
                            <p className="text-sm text-gray-600 mt-1">Manage reviews display settings</p>
                        </div>

                        <div className="space-y-6">
                            {/* Section Title */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Section Title
                                </label>
                                <input
                                    type="text"
                                    placeholder="What Our Customers Say"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
                                />
                            </div>

                            {/* Section Subtitle */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Section Subtitle
                                </label>
                                <input
                                    type="text"
                                    placeholder="Real experiences from our valued customers"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
                                />
                            </div>

                            {/* Display Toggle */}
                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                <div>
                                    <p className="text-sm font-medium text-gray-900">Show Reviews Section</p>
                                    <p className="text-xs text-gray-500 mt-1">Display customer reviews on homepage</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" className="sr-only peer" defaultChecked />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-black/10 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
                                </label>
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
