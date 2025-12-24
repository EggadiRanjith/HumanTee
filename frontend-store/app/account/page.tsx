"use client";

import { useEffect, useState, useCallback } from "react"; // Phase 3: useCallback
import { useRouter } from "next/navigation";
import { FiLogOut, FiLoader } from "react-icons/fi";
import { useAuth } from "@/app/contexts/AuthContext";
import { GradientOverlay } from "@/app/components/ui/layout";
import { useProfileData } from "./_hooks/useProfileData";
import ProfileSection from "./_components/ProfileSection";
import AddressesSection from "./_components/AddressesSection";
import ProfileWarning from "./_components/ProfileWarning";

export default function AccountPage() {
    const { user, isLoading: authLoading, logout, isAuthenticated } = useAuth();
    const router = useRouter();
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const {
        profile,
        isLoadingProfile,
        shippingAddresses,
        isLoadingAddresses,
        updateProfile,
        updateAddresses,
    } = useProfileData(user?.id, user?.email, user?.role);

    // Redirect if not authenticated
    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            router.push('/login');
        }
    }, [authLoading, isAuthenticated, router]);

    const handleLogout = async () => {
        setIsLoggingOut(true);
        try {
            await logout();
        } catch (error) {
            console.error('Logout failed:', error);
            setIsLoggingOut(false);
        }
    };

    const getInitials = () => {
        if (!profile) return 'U';
        if (profile.fullName) {
            const names = profile.fullName.split(' ');
            if (names.length >= 2) {
                return (
                    names[0].charAt(0) + names[names.length - 1].charAt(0)
                ).toUpperCase();
            }
            return names[0].charAt(0).toUpperCase();
        }
        return profile.email.charAt(0).toUpperCase();
    };

    // Loading state
    if (authLoading || isLoadingProfile) {
        return (
            <div className="min-h-screen brand-bg pt-[var(--header-height)] flex items-center justify-center">
                <div className="text-center">
                    <FiLoader className="w-12 h-12 animate-spin mx-auto mb-4 text-white/40" />
                    <p className="text-white/60 text-sm">Loading your account...</p>
                </div>
            </div>
        );
    }

    if (!profile) {
        return null;
    }

    return (
        <div className="min-h-screen brand-bg pt-[var(--header-height)] pb-20 sm:pb-24 font-sans">
            <GradientOverlay variant="violet" />

            <div className="relative max-w-screen-xl mx-auto px-4 sm:px-6 md:px-8 lg:px-10">
                <div className="py-6 sm:py-8 md:py-10 lg:py-12">
                    {/* Header */}
                    <div className="mb-6 sm:mb-8 md:mb-10">
                        <div className="flex items-center gap-3 sm:gap-4">
                            {/* Avatar */}
                            <div className="w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-white/20 to-white/5 border border-white/20 flex items-center justify-center text-xl sm:text-2xl md:text-3xl font-bold text-white shadow-lg flex-shrink-0">
                                {getInitials()}
                            </div>
                            <div className="min-w-0 flex-1">
                                <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-light text-white tracking-wide truncate">
                                    {profile.fullName || 'Welcome'}
                                </h1>
                                <p className="text-white/60 text-xs sm:text-sm mt-1 truncate">
                                    {profile.email}
                                </p>
                            </div>
                        </div>
                    </div>

                    <h2 className="text-white text-sm sm:text-base md:text-lg lg:text-xl font-light mb-4 sm:mb-5 md:mb-6 uppercase tracking-wide">
                        Account Information
                    </h2>

                    {/* Main Content */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 md:gap-6 mb-6 sm:mb-8">
                        {/* Profile Section */}
                        <ProfileSection
                            profile={profile}
                            onProfileUpdate={updateProfile}
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

                    {/* Profile Warning */}
                    {profile && !profile.profileComplete && (
                        <div className="mb-6">
                            <ProfileWarning
                                profileComplete={profile.profileComplete ?? false}
                                missingName={!profile.fullName}
                                missingPhone={!profile.phone}
                            />
                        </div>
                    )}

                    {/* Logout Button */}
                    <div className="mt-6 sm:mt-8">
                        <button
                            onClick={handleLogout}
                            disabled={isLoggingOut}
                            className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all disabled:opacity-50 text-white min-h-[52px] sm:min-h-[56px]"
                        >
                            <FiLogOut className="w-5 h-5" />
                            <span className="font-medium uppercase tracking-wider text-sm sm:text-base">
                                {isLoggingOut ? 'Logging out...' : 'Logout'}
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
