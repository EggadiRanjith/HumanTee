"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FiUser, FiMapPin, FiPackage, FiCreditCard, FiLogOut, FiLoader } from "react-icons/fi";
import { useAuth } from "@/app/contexts/AuthContext";
import { GradientOverlay } from "@/app/components/ui/layout";
import { useProfileData } from "./_hooks/useProfileData";
import AccountCard from "./_components/AccountCard";
import AccountHeader from "./_components/AccountHeader";
import ProfileWarning from "./_components/ProfileWarning";
import { AccountSkeleton } from "./_components/AccountSkeleton";

export default function AccountPage() {
    const { user, isLoading: authLoading, logout, isAuthenticated } = useAuth();
    const router = useRouter();

    const {
        profile,
        isLoadingProfile,
        profileError,
    } = useProfileData(user?.id, user?.email, user?.role, !authLoading);

    // Redirect if not authenticated
    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            router.push('/login?redirect=/account');
        }
    }, [authLoading, isAuthenticated, router]);

    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
        }
    };

    // Loading state - show skeleton
    if (authLoading || isLoadingProfile) {
        return <AccountSkeleton />;
    }

    if (!profile) {
        return null;
    }

    return (
        <div className="min-h-screen brand-bg pt-[var(--header-height)] pb-16 sm:pb-20 lg:pb-24 font-sans">
            <GradientOverlay variant="violet" />

            <div className="relative max-w-screen-xl mx-auto px-3 sm:px-4 md:px-6 lg:px-10">
                <div className="py-11 sm:py-8 md:py-10 lg:py-14">
                    {/* Header */}
                    <AccountHeader
                        fullName={profile.fullName}
                        email={profile.email}
                    />

                    {/* Profile Warning */}
                    {!profile.profileComplete && (
                        <div className="mb-6">
                            <ProfileWarning
                                profileComplete={profile.profileComplete ?? false}
                                missingName={!profile.fullName}
                                missingPhone={!profile.phone}
                            />
                        </div>
                    )}

                    {/* Navigation Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6 items-stretch">
                        {/* Profile Card */}
                        <AccountCard
                            icon={<FiUser />}
                            title="Profile"
                            description="Manage your personal information"
                            href="/account/profile"
                        />

                        {/* Addresses Card */}
                        <AccountCard
                            icon={<FiMapPin />}
                            title="Addresses"
                            description="Manage shipping addresses"
                            href="/account/addresses"
                        />

                        {/* Orders Card */}
                        <AccountCard
                            icon={<FiPackage />}
                            title="Orders"
                            description="View order history and track shipments"
                            href="/orders"
                        />

                        {/* Payments Card - Coming Soon */}
                        <AccountCard
                            icon={<FiCreditCard />}
                            title="Payments"
                            description="Manage saved payment methods"
                            comingSoon
                        />

                        {/* Logout Card - Different Style */}
                        <AccountCard
                            icon={<FiLogOut />}
                            title="Logout"
                            description="Sign out of your account"
                            onClick={handleLogout}
                            isLogout
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
