/**
 * Header & Footer Settings
 * Edit brand name, logo, and footer content
 */

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FiArrowLeft, FiUpload, FiX, FiSave } from 'react-icons/fi';
import { useAdminSettings } from '@/lib/queries/useSettings';
import { settingsApi } from '@/lib/api/settings';
import { useCloudinaryUpload } from '@/hooks/useCloudinaryUpload';

export default function HeaderFooterSettings() {
    const [formData, setFormData] = useState({
        brand_name: '',
        logo_url: '',
        tagline: '',
        social_links: {
            instagram: '',
            maps: ''
        },
        contact: {
            email: '',
            phone: ''
        },
        scrolling_text: ''
    });
    const [isSaving, setIsSaving] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const { upload, uploading, error: uploadError } = useCloudinaryUpload();

    // Use React Query hook - automatic caching and loading states
    const { data, isLoading } = useAdminSettings('header-footer');

    // Update local state when data loads
    useEffect(() => {
        if (data) {
            setFormData({
                brand_name: data.brand_name || '',
                logo_url: data.logo_url || '',
                tagline: data.tagline || '',
                social_links: data.social_links || { instagram: '', maps: '' },
                contact: data.contact || { email: '', phone: '' },
                scrolling_text: data.scrolling_text || ''
            });
        }
    }, [data]);

    // Handle logo upload
    const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const url = await upload(file, {
            maxSize: 5 * 1024 * 1024, // 5MB
            allowedTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml']
        });

        if (url) {
            setFormData(prev => ({ ...prev, logo_url: url }));
        }
    };

    // Remove logo
    const handleRemoveLogo = () => {
        setFormData(prev => ({ ...prev, logo_url: '' }));
    };

    // Save all settings
    const handleSave = async () => {
        setIsSaving(true);
        try {
            await settingsApi.saveSection('header-footer', formData);
            setIsEditing(false); // Exit edit mode after save
            alert('Settings saved successfully!');
        } catch (error) {
            // Save failed
            alert('Failed to save settings');
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-gray-600">Loading settings...</div>
            </div>
        );
    }

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
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Header & Footer</h1>
                        <p className="mt-2 text-sm text-gray-600">
                            Customize your site branding and footer content
                        </p>
                    </div>

                    {!isEditing ? (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="px-6 py-2.5 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium shadow-sm"
                        >
                            Edit
                        </button>
                    ) : (
                        <div className="flex gap-3">
                            <button
                                onClick={() => setIsEditing(false)}
                                className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={isSaving || uploading}
                                className="px-6 py-2.5 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 flex items-center gap-2 transition-colors font-medium shadow-sm"
                            >
                                {isSaving ? (
                                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <FiSave size={18} />
                                )}
                                {isSaving ? 'Saving...' : 'Save All'}
                            </button>
                        </div>
                    )}
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
                                    value={formData.brand_name}
                                    onChange={(e: any) => setFormData(prev => ({ ...prev, brand_name: e.target.value }))}
                                    placeholder="HUMANTEE"
                                    readOnly={!isEditing}
                                    className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black ${!isEditing ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                                />
                                <p className="text-xs text-gray-500 mt-1">Displayed in the top-left corner</p>
                            </div>

                            {/* Logo Upload */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Logo
                                </label>

                                {formData.logo_url ? (
                                    // Show preview with remove button
                                    <div className="space-y-3">
                                        <div className="relative inline-block">
                                            <img
                                                src={formData.logo_url}
                                                alt="Logo preview"
                                                className="h-24 w-auto border border-gray-200 rounded-lg"
                                            />
                                        </div>
                                        <button
                                            onClick={handleRemoveLogo}
                                            className="flex items-center gap-2 text-red-600 hover:text-red-700 text-sm"
                                        >
                                            <FiX size={16} />
                                            Remove Logo
                                        </button>
                                    </div>
                                ) : (
                                    // Upload button
                                    <div className="border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleLogoUpload}
                                            disabled={uploading}
                                            className="hidden"
                                            id="logo-upload"
                                        />
                                        <label
                                            htmlFor="logo-upload"
                                            className="cursor-pointer flex flex-col items-center p-8 text-center"
                                        >
                                            <FiUpload className="h-12 w-12 text-gray-400 mb-2" />
                                            <p className="text-sm text-gray-600">
                                                {uploading ? 'Uploading...' : 'Click to upload logo'}
                                            </p>
                                            <p className="text-xs text-gray-500 mt-1">
                                                PNG, SVG, or JPG (max 5MB)
                                            </p>
                                        </label>
                                    </div>
                                )}

                                {uploadError && (
                                    <p className="text-sm text-red-600 mt-2">{uploadError}</p>
                                )}

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
                                    value={formData.tagline}
                                    onChange={(e: any) => setFormData(prev => ({ ...prev, tagline: e.target.value }))}
                                    placeholder="Wear Your Story"
                                    readOnly={!isEditing}
                                    className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black ${!isEditing ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                                />
                            </div>

                            {/* Contact Email */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Contact Email
                                </label>
                                <input
                                    type="email"
                                    value={formData.contact.email}
                                    onChange={(e: any) => setFormData(prev => ({
                                        ...prev,
                                        contact: { ...prev.contact, email: e.target.value }
                                    }))}
                                    placeholder="contact@humantee.com"
                                    readOnly={!isEditing}
                                    className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black ${!isEditing ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                                />
                            </div>

                            {/* Contact Phone */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Contact Phone
                                </label>
                                <input
                                    type="tel"
                                    value={formData.contact.phone}
                                    onChange={(e: any) => setFormData(prev => ({
                                        ...prev,
                                        contact: { ...prev.contact, phone: e.target.value }
                                    }))}
                                    placeholder="+91 7780-661493"
                                    readOnly={!isEditing}
                                    className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black ${!isEditing ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                                />
                            </div>

                            {/* Social Links */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Instagram URL
                                    </label>
                                    <input
                                        type="url"
                                        value={formData.social_links.instagram}
                                        onChange={(e: any) => setFormData(prev => ({
                                            ...prev,
                                            social_links: { ...prev.social_links, instagram: e.target.value }
                                        }))}
                                        placeholder="https://www.instagram.com/humanteeofficial/"
                                        readOnly={!isEditing}
                                        className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black ${!isEditing ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Google Maps Location URL
                                    </label>
                                    <input
                                        type="url"
                                        value={formData.social_links.maps}
                                        onChange={(e: any) => setFormData(prev => ({
                                            ...prev,
                                            social_links: { ...prev.social_links, maps: e.target.value }
                                        }))}
                                        placeholder="https://maps.google.com"
                                        readOnly={!isEditing}
                                        className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black ${!isEditing ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                                    />
                                </div>
                            </div>

                            {/* Scrolling Text */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Footer Scrolling Text
                                </label>
                                <input
                                    type="text"
                                    value={formData.scrolling_text}
                                    onChange={(e: any) => setFormData(prev => ({ ...prev, scrolling_text: e.target.value }))}
                                    placeholder="WEAR HUMANTEE · WEAR CONFIDENCE"
                                    readOnly={!isEditing}
                                    className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black ${!isEditing ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                                />
                                <p className="text-xs text-gray-500 mt-1">Large scrolling text displayed in footer</p>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
