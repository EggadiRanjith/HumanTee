"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { FiLoader } from "react-icons/fi";
import { useAuth } from "@/app/contexts/AuthContext";
import { GradientOverlay } from "@/app/components/ui/layout";
import { InlineError } from "@/app/components/ui/errors";
import { useProfileData } from "../_hooks/useProfileData";
import AccountHeader from "../_components/AccountHeader";
import AddressesSection from "../_components/AddressesSection";

export default function AddressesPage() {
    const { user, isLoading: authLoading, isAuthenticated } = useAuth();
    const router = useRouter();

    const {
        profile,
        isLoadingProfile,
        profileError,
        shippingAddresses,
        isLoadingAddresses,
        addressesError,
        updateAddresses,
        retryProfile,
        retryAddresses,
    } = useProfileData(user?.id, user?.email, user?.role);

    // Redirect if not authenticated
    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            router.push('/login?redirect=/account/addresses');
        }
    }, [authLoading, isAuthenticated, router]);

    // Loading state
    if (authLoading || isLoadingProfile) {
        return (
            <div className="min-h-screen brand-bg pt-[var(--header-height)] flex items-center justify-center">
                <div className="text-center">
                    <FiLoader className="w-12 h-12 animate-spin mx-auto mb-4 text-white/40" />
                    <p className="text-white/60 text-sm">Loading addresses...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (profileError) {
        const isOffline = typeof navigator !== 'undefined' && !navigator.onLine;

        return (
            <div className="min-h-screen brand-bg pt-[var(--header-height)] flex items-center justify-center px-4">
                <InlineError
                    title="Unable to load addresses"
                    message={
                        isOffline
                            ? "You're offline. Check your connection."
                            : "Please try again."
                    }
                    actionLabel="Retry"
                    onAction={retryProfile}
                    className="max-w-md"
                />
            </div>
        );
    }

    if (!profile) {
        return null;
    }

    return (
        <div className="min-h-screen brand-bg pt-[var(--header-height)] pb-16 sm:pb-20 lg:pb-24 font-sans">
            <GradientOverlay variant="violet" />

            <div className="relative max-w-screen-xl mx-auto px-3 sm:px-4 md:px-6 lg:px-10">
                <div className="py-11 sm:py-8 md:py-10 lg:py-14">
                    {/* Header with Back Button */}
                    <AccountHeader
                        fullName={profile.fullName}
                        email={profile.email}
                        showBackButton
                    />

                    {/* Addresses Section */}
                    <AddressesSection
                        addresses={shippingAddresses}
                        isLoading={isLoadingAddresses}
                        onAddressesChange={updateAddresses}
                        profileEmail={profile.email}
                        profileName={profile.fullName}
                        profilePhone={profile.phone}
                    />
                </div>
            </div>
        </div>
    );
}
