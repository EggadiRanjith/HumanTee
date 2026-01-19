"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { AlertCircle, Save, RefreshCw } from "lucide-react";
import { adminApi } from "@/lib/admin-api";
import { toast } from "sonner";

interface FeatureToggles {
    discounts_enabled: boolean;
    tickets_enabled: boolean;
}

export default function FeaturesPage() {
    const [features, setFeatures] = useState<FeatureToggles>({
        discounts_enabled: true,
        tickets_enabled: true,
    });
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);

    // Load current settings
    useEffect(() => {
        loadFeatures();
    }, []);

    const loadFeatures = async () => {
        try {
            setIsLoading(true);
            const response = await adminApi.get("/admin/settings/features");
            setFeatures(response.data);
        } catch (error) {
            console.error("Failed to load features:", error);
            toast.error("Failed to load feature settings");
        } finally {
            setIsLoading(false);
        }
    };

    const handleToggle = (key: keyof FeatureToggles) => {
        setFeatures((prev) => ({
            ...prev,
            [key]: !prev[key],
        }));
        setHasChanges(true);
    };

    const handleSave = async () => {
        try {
            setIsSaving(true);
            await adminApi.post("/admin/settings/features", features);
            toast.success("Feature settings saved successfully!");
            setHasChanges(false);
        } catch (error) {
            console.error("Failed to save features:", error);
            toast.error("Failed to save feature settings");
        } finally {
            setIsSaving(false);
        }
    };

    const handleReset = () => {
        loadFeatures();
        setHasChanges(false);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <RefreshCw className="w-8 h-8 animate-spin text-gray-400" />
            </div>
        );
    }

    return (
        <div className="space-y-6 p-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Feature Toggles</h1>
                <p className="text-muted-foreground mt-2">
                    Enable or disable features to optimize performance and manage functionality
                </p>
            </div>

            {/* Warning Banner */}
            <Card className="border-yellow-200 bg-yellow-50 dark:bg-yellow-950 dark:border-yellow-800">
                <div className="p-4 flex gap-3">
                    <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                    <div className="space-y-1">
                        <p className="font-medium text-yellow-800 dark:text-yellow-200">
                            Performance Impact
                        </p>
                        <p className="text-sm text-yellow-700 dark:text-yellow-300">
                            Disabling features will stop API calls and hide UI elements. Changes take effect
                            within 30 minutes (settings cache TTL).
                        </p>
                    </div>
                </div>
            </Card>

            {/* Feature Toggles */}
            <div className="grid gap-4">
                {/* Discounts Toggle */}
                <Card>
                    <div className="p-6">
                        <div className="flex items-start justify-between">
                            <div className="space-y-1 flex-1">
                                <div className="flex items-center gap-3">
                                    <h3 className="font-semibold text-lg">Discount Codes</h3>
                                    <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300 rounded">
                                        HIGH IMPACT
                                    </span>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    Enable or disable discount code functionality across the store
                                </p>
                                <div className="pt-2 space-y-1">
                                    <p className="text-xs text-muted-foreground">
                                        <strong>API Calls Saved:</strong> 30-50 per user session
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        <strong>Affects:</strong> Cart discount suggestions, discount validation
                                    </p>
                                </div>
                            </div>
                            <Switch
                                checked={features.discounts_enabled}
                                onCheckedChange={() => handleToggle("discounts_enabled")}
                                className="ml-4"
                            />
                        </div>
                    </div>
                </Card>

                {/* Tickets Toggle */}
                <Card>
                    <div className="p-6">
                        <div className="flex items-start justify-between">
                            <div className="space-y-1 flex-1">
                                <div className="flex items-center gap-3">
                                    <h3 className="font-semibold text-lg">Support Tickets</h3>
                                    <span className="px-2 py-1 text-xs font-medium bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300 rounded">
                                        MEDIUM IMPACT
                                    </span>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    Enable or disable customer support ticket system
                                </p>
                                <div className="pt-2 space-y-1">
                                    <p className="text-xs text-muted-foreground">
                                        <strong>API Calls Saved:</strong> 5-10 per user session
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        <strong>Affects:</strong> Help button on orders, ticket creation
                                    </p>
                                </div>
                            </div>
                            <Switch
                                checked={features.tickets_enabled}
                                onCheckedChange={() => handleToggle("tickets_enabled")}
                                className="ml-4"
                            />
                        </div>
                    </div>
                </Card>
            </div>

            {/* Action Buttons */}
            {hasChanges && (
                <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950 dark:border-blue-800">
                    <div className="p-4 flex items-center justify-between">
                        <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                            You have unsaved changes
                        </p>
                        <div className="flex gap-2">
                            <Button variant="outline" onClick={handleReset} disabled={isSaving}>
                                Cancel
                            </Button>
                            <Button onClick={handleSave} disabled={isSaving}>
                                {isSaving ? (
                                    <>
                                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-4 h-4 mr-2" />
                                        Save Changes
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </Card>
            )}

            {/* Stats */}
            <Card>
                <div className="p-6">
                    <h3 className="font-semibold mb-4">Performance Impact</h3>
                    <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                            <p className="text-2xl font-bold">
                                {features.discounts_enabled && features.tickets_enabled
                                    ? "0"
                                    : !features.discounts_enabled && !features.tickets_enabled
                                        ? "35-60"
                                        : !features.discounts_enabled
                                            ? "30-50"
                                            : "5-10"}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">API Calls Saved/User</p>
                        </div>
                        <div>
                            <p className="text-2xl font-bold">
                                {[features.discounts_enabled, features.tickets_enabled].filter((x) => x).length}
                                /2
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">Features Enabled</p>
                        </div>
                        <div>
                            <p className="text-2xl font-bold">~30min</p>
                            <p className="text-xs text-muted-foreground mt-1">Cache Propagation</p>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
}
