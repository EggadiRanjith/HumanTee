'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FiSave, FiAlertTriangle, FiCheckCircle, FiClock, FiMail, FiLayout, FiEdit3 } from 'react-icons/fi';
import { useAdminSettings } from '@/lib/queries/useSettings';
import { settingsApi } from '@/lib/api/settings';
import SettingsBackButton from '../_components/SettingsBackButton';

export default function MaintenanceSettingsPage() {
    const [isSaving, setIsSaving] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    // Use React Query hook - automatic caching and loading states
    const { data, isLoading } = useAdminSettings('maintenance');

    const [settings, setSettings] = useState({
        enabled: false,
        title: "We'll Be Right Back",
        message: "We're making things even better. Check back soon.",
        estimatedTime: '2 hours',
        contactEmail: 'support@humantee.com'
    });

    // Update local state when data loads
    useEffect(() => {
        if (data) {
            setSettings({
                enabled: data.enabled ?? false,
                title: data.title || "We'll Be Right Back",
                message: data.message || "We're making things even better. Check back soon.",
                estimatedTime: data.estimatedTime || '2 hours',
                contactEmail: data.contactEmail || 'support@humantee.com'
            });
        }
    }, [data]);

    const handleSave = async () => {
        setIsSaving(true);
        setMessage(null);
        try {
            // Save maintenance settings
            await settingsApi.saveSection('maintenance', {
                enabled: settings.enabled,
                title: settings.title,
                message: settings.message,
                estimated_time: settings.estimatedTime,
                contact_email: settings.contactEmail
            });

            setMessage({ type: 'success', text: 'System settings updated successfully.' });
            setIsEditing(false);

            // If maintenance is enabled, set the bypass cookie for the admin
            if (settings.enabled) {
                document.cookie = "admin_bypass=true; path=/; max-age=3600";
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to update system settings.' });
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-gray-500">Loading settings...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-3 md:p-4 lg:p-6 xl:p-8">
            <div className="max-w-4xl mx-auto">
                {/* Back Button */}
                <SettingsBackButton />

                {/* Header - Compact Mobile */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 md:mb-6 lg:mb-8 gap-3 md:gap-4">
                    <div>
                        <h1 className="text-lg md:text-2xl lg:text-3xl font-bold text-gray-900">System & Maintenance</h1>
                        <p className="mt-1 text-xs md:text-sm text-gray-600">
                            Configure site-wide maintenance mode and luxury arrival page
                        </p>
                    </div>

                    {!isEditing ? (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="flex items-center justify-center gap-2 px-2 md:px-3 lg:px-4 xl:px-6 py-1 md:py-1.5 lg:py-2 xl:py-2.5 text-xs md:text-sm lg:text-base bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-all shadow-sm"
                        >
                            <FiEdit3 /> Edit Settings
                        </button>
                    ) : (
                        <div className="flex gap-3">
                            <button
                                onClick={() => setIsEditing(false)}
                                className="px-2 md:px-3 lg:px-4 xl:px-6 py-1 md:py-1.5 lg:py-2 xl:py-2.5 text-xs md:text-sm lg:text-base border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={isSaving}
                                className="flex items-center justify-center gap-2 px-2 md:px-3 lg:px-4 xl:px-6 py-1 md:py-1.5 lg:py-2 xl:py-2.5 text-xs md:text-sm lg:text-base bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-all disabled:opacity-50 shadow-sm"
                            >
                                {isSaving ? (
                                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <FiSave />
                                )}
                                {isSaving ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    )}
                </div>

                {/* Status Message */}
                {message && (
                    <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${message.type === 'success' ? 'bg-green-50 border border-green-200 text-green-800' : 'bg-red-50 border border-red-200 text-red-800'
                        }`}>
                        {message.type === 'success' ? <FiCheckCircle /> : <FiAlertTriangle />}
                        <p className="text-sm font-medium">{message.text}</p>
                    </div>
                )}

                <div className="space-y-4 md:space-y-6">
                    {/* Maintenance Toggle Card - Compact Mobile */}
                    <div className={`bg-white rounded-xl shadow-sm border p-3 md:p-4 lg:p-6 transition-all ${settings.enabled ? 'border-orange-200 bg-orange-50/30' : 'border-gray-200'
                        }`}>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${settings.enabled ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-500'
                                    }`}>
                                    <FiAlertTriangle />
                                </div>
                                <div>
                                    <h2 className="text-lg font-semibold text-gray-900">Maintenance Mode</h2>
                                    <p className="text-sm text-gray-600">
                                        When enabled, customers will see a luxury maintenance page
                                    </p>
                                </div>
                            </div>
                            <label className={`relative inline-flex items-center ${isEditing ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'}`}>
                                <input
                                    type="checkbox"
                                    className="sr-only peer"
                                    checked={settings.enabled}
                                    disabled={!isEditing}
                                    onChange={(e: any) => setSettings({ ...settings, enabled: e.target.checked })}
                                />
                                <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-orange-500"></div>
                            </label>
                        </div>

                        {settings.enabled && (
                            <div className="mt-6 p-4 bg-white border border-orange-200 rounded-lg flex items-start gap-3">
                                <FiAlertTriangle className="text-orange-500 mt-0.5 flex-shrink-0" />
                                <div className="text-sm text-orange-800">
                                    <p className="font-semibold">Maintenance Mode is ACTIVE</p>
                                    <p className="mt-1">
                                        Only administrators with a valid sessions will be able to access the storefront.
                                        All other traffic will be redirected to the luxury maintenance page.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Content Customization Card - Compact Mobile */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="p-3 md:p-4 lg:p-6 border-b border-gray-100">
                            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                <FiLayout className="text-gray-400" />
                                Page Content Customization
                            </h3>
                        </div>
                        <div className="p-3 md:p-4 lg:p-6 space-y-4 md:space-y-6">
                            {/* Title */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Main Heading (Title)
                                </label>
                                <input
                                    type="text"
                                    value={settings.title}
                                    readOnly={!isEditing}
                                    onChange={(e: any) => setSettings({ ...settings, title: e.target.value })}
                                    className={`w-full px-2 md:px-3 lg:px-4 py-1.5 md:py-2 text-sm md:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none transition-all ${!isEditing ? 'bg-gray-50 cursor-not-allowed' : 'bg-white shadow-sm'}`}
                                    placeholder="e.g. We'll Be Right Back"
                                />
                            </div>

                            {/* Message */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Description Message
                                </label>
                                <textarea
                                    value={settings.message}
                                    readOnly={!isEditing}
                                    onChange={(e: any) => setSettings({ ...settings, message: e.target.value })}
                                    className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none transition-all min-h-[100px] ${!isEditing ? 'bg-gray-50 cursor-not-allowed' : 'bg-white shadow-sm'}`}
                                    placeholder="Explain why the site is down..."
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Estimated Time */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                                        <FiClock className="text-gray-400" />
                                        Estimated Downtime
                                    </label>
                                    <input
                                        type="text"
                                        value={settings.estimatedTime}
                                        readOnly={!isEditing}
                                        onChange={(e: any) => setSettings({ ...settings, estimatedTime: e.target.value })}
                                        className={`w-full px-2 md:px-3 lg:px-4 py-1.5 md:py-2 text-sm md:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none transition-all ${!isEditing ? 'bg-gray-50 cursor-not-allowed' : 'bg-white shadow-sm'}`}
                                        placeholder="e.g. 2 hours"
                                    />
                                </div>

                                {/* Contact Email */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                                        <FiMail className="text-gray-400" />
                                        Contact Email
                                    </label>
                                    <input
                                        type="email"
                                        value={settings.contactEmail}
                                        readOnly={!isEditing}
                                        onChange={(e: any) => setSettings({ ...settings, contactEmail: e.target.value })}
                                        className={`w-full px-2 md:px-3 lg:px-4 py-1.5 md:py-2 text-sm md:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none transition-all ${!isEditing ? 'bg-gray-50 cursor-not-allowed' : 'bg-white shadow-sm'}`}
                                        placeholder="e.g. support@humantee.com"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Preview Section */}
                    <div className="bg-gray-900 rounded-xl p-6 text-white overflow-hidden relative">
                        <div className="absolute top-0 right-0 p-4">
                            <span className="px-2 py-1 bg-white/10 rounded text-[10px] font-bold uppercase tracking-widest text-white/50">
                                Live Preview
                            </span>
                        </div>
                        <div className="text-center py-4">
                            <h4 className="text-2xl font-bold tracking-widest mb-2 uppercase opacity-40">HUMANTEE</h4>
                            <h5 className="text-xl font-semibold mb-2">{settings.title}</h5>
                            <p className="text-sm text-gray-400 max-w-sm mx-auto mb-4">{settings.message}</p>
                            {settings.estimatedTime && (
                                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-full text-xs text-gray-300">
                                    ⏱️ Back in {settings.estimatedTime}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
