"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FiSave, FiRefreshCw, FiAlertTriangle, FiArrowLeft } from "react-icons/fi";
import { useFeatureToggles, useUpdateFeatureToggles } from "@/lib/queries/useFeatureToggles";
import { toast } from "sonner";

interface FeatureToggles {
    discounts_enabled: boolean;
    tickets_enabled: boolean;
    user_audit_logs_enabled: boolean;
    admin_audit_logs_enabled: boolean;
}

export default function FeaturesPage() {
    // React Query hooks - automatic caching and loading states
    const { data, isLoading, error, refetch } = useFeatureToggles();
    const updateMutation = useUpdateFeatureToggles();

    const [hasChanges, setHasChanges] = useState(false);

    // Local state for editing
    const [features, setFeatures] = useState<FeatureToggles>({
        discounts_enabled: true,
        tickets_enabled: true,
        user_audit_logs_enabled: true,
        admin_audit_logs_enabled: true,
    });

    // Sync with server data when it loads
    useEffect(() => {
        if (data) {
            setFeatures(data);
        }
    }, [data]);

    const handleToggle = (key: keyof FeatureToggles) => {
        setFeatures((prev) => ({
            ...prev,
            [key]: !prev[key],
        }));
        setHasChanges(true);
    };

    const handleSave = async () => {
        try {
            await updateMutation.mutateAsync(features);
            toast.success("Feature settings saved successfully!");
            setHasChanges(false);
        } catch (error: any) {
            toast.error(`Failed to save: ${error.message || 'Unknown error'}`);
        }
    };

    const handleReset = () => {
        if (data) {
            setFeatures(data);
        }
        setHasChanges(false);
    };

    // Loading state
    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-black/20 border-t-black rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading feature settings...</p>
                </div>
            </div>
        );
    }

    // Error state with retry
    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
                <div className="bg-white rounded-lg shadow-sm border border-red-200 p-6 max-w-md">
                    <div className="text-center">
                        <FiAlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                        <h2 className="text-lg font-semibold text-gray-900 mb-2">Failed to Load Settings</h2>
                        <p className="text-sm text-gray-600 mb-4">
                            Unable to fetch feature toggle settings. Please try again.
                        </p>
                        <button
                            onClick={() => refetch()}
                            className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2 mx-auto"
                        >
                            <FiRefreshCw className="w-4 h-4" />
                            Retry
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-3 md:p-4 lg:p-6 xl:p-8">
            <div className="max-w-6xl mx-auto">
                {/* Back Button */}
                <Link
                    href="/admin/settings"
                    className="inline-flex items-center gap-1.5 md:gap-2 text-gray-600 hover:text-black mb-4 md:mb-6 transition-colors"
                >
                    <FiArrowLeft size={18} className="md:w-5 md:h-5" />
                    <span className="text-xs md:text-sm font-medium">Back to Settings</span>
                </Link>

                {/* Header */}
                <div className="mb-4 md:mb-6 lg:mb-8">
                    <h1 className="text-lg md:text-2xl lg:text-3xl font-bold text-gray-900">Feature Toggles</h1>
                    <p className="mt-1 md:mt-2 text-xs md:text-sm text-gray-600">
                        Enable or disable features to optimize performance and manage functionality
                    </p>
                </div>

                <div className="space-y-4 md:space-y-6">
                    {/* Warning Banner - Compact Mobile */}
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 md:p-4">
                        <div className="flex gap-2 md:gap-3">
                            <FiAlertTriangle className="w-4 h-4 md:w-5 md:h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                            <div className="space-y-1">
                                <p className="text-xs md:text-sm font-medium text-yellow-800">Performance Impact</p>
                                <p className="text-[11px] md:text-sm text-yellow-700">
                                    Disabling features will stop API calls and hide UI elements. Changes take effect
                                    within 30 minutes (settings cache TTL).
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Feature Toggles - Compact Mobile */}
                    <div className="space-y-3 md:space-y-4">
                        {/* Discounts Toggle */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 md:p-4 lg:p-6">
                            <div className="flex items-start justify-between gap-3">
                                <div className="space-y-1 flex-1 min-w-0">
                                    <div className="flex items-center gap-2 md:gap-3 flex-wrap">
                                        <h3 className="text-sm md:text-base lg:text-lg font-semibold">Discount Codes</h3>
                                        <span className="px-1.5 py-0.5 md:px-2 md:py-1 text-[10px] md:text-xs font-medium bg-red-100 text-red-700 rounded">
                                            HIGH IMPACT
                                        </span>
                                    </div>
                                    <p className="text-xs md:text-sm text-gray-600">
                                        Enable or disable discount code functionality across the store
                                    </p>
                                    <div className="pt-1.5 md:pt-2 space-y-0.5 md:space-y-1">
                                        <p className="text-[10px] md:text-xs text-gray-500">
                                            <strong>API Calls Saved:</strong> 30-50 per user session
                                        </p>
                                        <p className="text-[10px] md:text-xs text-gray-500">
                                            <strong>Affects:</strong> Cart discount suggestions, discount validation
                                        </p>
                                    </div>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                                    <input
                                        type="checkbox"
                                        checked={features.discounts_enabled}
                                        onChange={() => handleToggle("discounts_enabled")}
                                        className="sr-only peer"
                                    />
                                    <div className="w-9 h-5 md:w-11 md:h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-black/10 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 md:after:h-5 md:after:w-5 after:transition-all peer-checked:bg-black"></div>
                                </label>
                            </div>
                        </div>

                        {/* Tickets Toggle */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 md:p-4 lg:p-6">
                            <div className="flex items-start justify-between gap-3">
                                <div className="space-y-1 flex-1 min-w-0">
                                    <div className="flex items-center gap-2 md:gap-3 flex-wrap">
                                        <h3 className="text-sm md:text-base lg:text-lg font-semibold">Support Tickets</h3>
                                        <span className="px-1.5 py-0.5 md:px-2 md:py-1 text-[10px] md:text-xs font-medium bg-orange-100 text-orange-700 rounded">
                                            MEDIUM IMPACT
                                        </span>
                                    </div>
                                    <p className="text-xs md:text-sm text-gray-600">
                                        Enable or disable customer support ticket system
                                    </p>
                                    <div className="pt-1.5 md:pt-2 space-y-0.5 md:space-y-1">
                                        <p className="text-[10px] md:text-xs text-gray-500">
                                            <strong>API Calls Saved:</strong> 5-10 per user session
                                        </p>
                                        <p className="text-[10px] md:text-xs text-gray-500">
                                            <strong>Affects:</strong> Help button on orders, ticket creation
                                        </p>
                                    </div>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                                    <input
                                        type="checkbox"
                                        checked={features.tickets_enabled}
                                        onChange={() => handleToggle("tickets_enabled")}
                                        className="sr-only peer"
                                    />
                                    <div className="w-9 h-5 md:w-11 md:h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-black/10 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 md:after:h-5 md:after:w-5 after:transition-all peer-checked:bg-black"></div>
                                </label>
                            </div>
                        </div>

                        {/* User Audit Logs Toggle */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 md:p-4 lg:p-6">
                            <div className="flex items-start justify-between gap-3">
                                <div className="space-y-1 flex-1 min-w-0">
                                    <div className="flex items-center gap-2 md:gap-3 flex-wrap">
                                        <h3 className="text-sm md:text-base lg:text-lg font-semibold">User Audit Logs</h3>
                                        <span className="px-1.5 py-0.5 md:px-2 md:py-1 text-[10px] md:text-xs font-medium bg-green-100 text-green-700 rounded">
                                            LOW IMPACT
                                        </span>
                                    </div>
                                    <p className="text-xs md:text-sm text-gray-600">
                                        Track user actions like login, profile updates, and order history
                                    </p>
                                    <div className="pt-1.5 md:pt-2 space-y-0.5 md:space-y-1">
                                        <p className="text-[10px] md:text-xs text-gray-500">
                                            <strong>DB Writes Saved:</strong> ~50-100 per day (early stage)
                                        </p>
                                        <p className="text-[10px] md:text-xs text-gray-500">
                                            <strong>Affects:</strong> User Logs page, audit trail visibility
                                        </p>
                                    </div>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                                    <input
                                        type="checkbox"
                                        checked={features.user_audit_logs_enabled}
                                        onChange={() => handleToggle("user_audit_logs_enabled")}
                                        className="sr-only peer"
                                    />
                                    <div className="w-9 h-5 md:w-11 md:h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-black/10 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 md:after:h-5 md:after:w-5 after:transition-all peer-checked:bg-black"></div>
                                </label>
                            </div>
                        </div>

                        {/* Admin Audit Logs Toggle */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 md:p-4 lg:p-6">
                            <div className="flex items-start justify-between gap-3">
                                <div className="space-y-1 flex-1 min-w-0">
                                    <div className="flex items-center gap-2 md:gap-3 flex-wrap">
                                        <h3 className="text-sm md:text-base lg:text-lg font-semibold">Admin Audit Logs</h3>
                                        <span className="px-1.5 py-0.5 md:px-2 md:py-1 text-[10px] md:text-xs font-medium bg-green-100 text-green-700 rounded">
                                            LOW IMPACT
                                        </span>
                                    </div>
                                    <p className="text-xs md:text-sm text-gray-600">
                                        Track admin actions like order updates, settings changes, and customer edits
                                    </p>
                                    <div className="pt-1.5 md:pt-2 space-y-0.5 md:space-y-1">
                                        <p className="text-[10px] md:text-xs text-gray-500">
                                            <strong>DB Writes Saved:</strong> ~20-50 per day (early stage)
                                        </p>
                                        <p className="text-[10px] md:text-xs text-gray-500">
                                            <strong>Affects:</strong> Audit Logs page, admin activity tracking
                                        </p>
                                    </div>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                                    <input
                                        type="checkbox"
                                        checked={features.admin_audit_logs_enabled}
                                        onChange={() => handleToggle("admin_audit_logs_enabled")}
                                        className="sr-only peer"
                                    />
                                    <div className="w-9 h-5 md:w-11 md:h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-black/10 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 md:after:h-5 md:after:w-5 after:transition-all peer-checked:bg-black"></div>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons - Compact Mobile */}
                    {hasChanges && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 md:p-4">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                                <p className="text-xs md:text-sm font-medium text-blue-800">
                                    You have unsaved changes
                                </p>
                                <div className="flex gap-2 w-full sm:w-auto">
                                    <button
                                        onClick={handleReset}
                                        disabled={updateMutation.isPending}
                                        className="flex-1 sm:flex-none px-3 md:px-4 py-1.5 md:py-2 text-xs md:text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSave}
                                        disabled={updateMutation.isPending}
                                        className="flex-1 sm:flex-none px-3 md:px-4 py-1.5 md:py-2 text-xs md:text-sm bg-black text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                                    >
                                        {updateMutation.isPending ? (
                                            <>
                                                <FiRefreshCw className="w-3 h-3 md:w-4 md:h-4 animate-spin" />
                                                <span className="hidden sm:inline">Saving...</span>
                                                <span className="sm:hidden">Save</span>
                                            </>
                                        ) : (
                                            <>
                                                <FiSave className="w-3 h-3 md:w-4 md:h-4" />
                                                <span className="hidden sm:inline">Save Changes</span>
                                                <span className="sm:hidden">Save</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
