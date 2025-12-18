"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FiUser, FiMapPin, FiLogOut, FiMail, FiEdit2, FiLoader } from "react-icons/fi";
import { useAuth } from "@/app/context/AuthContext";
import { GradientOverlay } from "@/app/components/ui/layout";
import apiClient from "@/lib/api-client";

interface UserProfile {
    id: string;
    email: string;
    role: string;
    fullName?: string;
    phone?: string;
    avatarUrl?: string;
    profileComplete?: boolean;  // From backend
}

export default function AccountPage() {
    const { user, isLoading: authLoading, logout, isAuthenticated } = useAuth();
    const router = useRouter();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [isLoadingProfile, setIsLoadingProfile] = useState(true);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [editedName, setEditedName] = useState('');
    const [editedPhone, setEditedPhone] = useState('');
    const [saveError, setSaveError] = useState('');
    const [saveSuccess, setSaveSuccess] = useState(false);

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            router.push('/login');
        }
    }, [authLoading, isAuthenticated, router]);

    useEffect(() => {
        const fetchProfile = async () => {
            if (!user) return;

            try {
                // Fetch real profile data from backend
                const response = await apiClient.get('/auth/me');

                setProfile({
                    id: response.data.id,
                    email: response.data.email,
                    role: response.data.role,
                    fullName: response.data.profile?.fullName,
                    phone: response.data.profile?.phone,
                    avatarUrl: response.data.profile?.avatarUrl,
                    profileComplete: response.data.profileComplete,  // Backend authority
                });
            } catch (error) {
                console.error('Failed to load profile:', error);
                // Fallback to user data from AuthContext
                setProfile({
                    id: user.id,
                    email: user.email,
                    role: user.role,
                    profileComplete: false,  // Assume incomplete on error
                });
            } finally {
                setIsLoadingProfile(false);
            }
        };

        if (user) {
            fetchProfile();
        }
    }, [user]);

    const handleLogout = async () => {
        setIsLoggingOut(true);
        try {
            await logout();
        } catch (error) {
            console.error('Logout failed:', error);
            setIsLoggingOut(false);
        }
    };

    const handleEditClick = () => {
        setEditedName(profile?.fullName || '');
        setEditedPhone(profile?.phone || '');
        setIsEditing(true);
        setSaveError('');
        setSaveSuccess(false);
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setEditedName('');
        setEditedPhone('');
        setSaveError('');
        setSaveSuccess(false);
    };

    const handleSaveProfile = async () => {
        setIsSaving(true);
        setSaveError('');
        setSaveSuccess(false);

        try {
            const response = await apiClient.patch('/auth/profile', {
                fullName: editedName.trim(),
                phone: editedPhone.trim(),
            });

            setProfile({
                ...profile!,
                fullName: response.data.profile.fullName,
                phone: response.data.profile.phone,
                profileComplete: response.data.profileComplete,
            });

            setIsEditing(false);
            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 3000);
        } catch (error: any) {
            setSaveError(error.response?.data?.message || 'Failed to update profile');
        } finally {
            setIsSaving(false);
        }
    };

    // Get initials for avatar
    const getInitials = () => {
        if (!profile) return 'U';
        if (profile.fullName) {
            const names = profile.fullName.split(' ');
            if (names.length >= 2) {
                return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
            }
            return names[0].charAt(0).toUpperCase();
        }
        return profile.email.charAt(0).toUpperCase();
    };

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
        <div className="min-h-screen brand-bg pt-[var(--header-height)] pb-20 sm:pb-24">
            <GradientOverlay variant="violet" />

            <div className="relative max-w-screen-xl mx-auto px-4 sm:px-6 md:px-8 lg:px-10">
                <div className="py-6 sm:py-8 md:py-10 lg:py-12">
                    {/* Header - Without Logout */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="mb-6 sm:mb-8 md:mb-10"
                    >
                        <div className="flex items-center gap-3 sm:gap-4">
                            {/* Avatar */}
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                className="w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-white/20 to-white/5 border border-white/20 flex items-center justify-center text-xl sm:text-2xl md:text-3xl font-bold text-white shadow-lg flex-shrink-0"
                            >
                                {getInitials()}
                            </motion.div>
                            <div className="min-w-0 flex-1">
                                <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-light text-white tracking-wide truncate">
                                    {profile.fullName || 'Welcome'}
                                </h1>
                                <p className="text-white/60 text-xs sm:text-sm mt-1 flex items-center gap-2 truncate">
                                    <FiMail className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                                    <span className="truncate">{profile.email}</span>
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    <h2 className="text-white text-sm sm:text-base md:text-lg lg:text-xl font-light mb-4 sm:mb-5 md:mb-6 uppercase tracking-wide">
                        Account Information
                    </h2>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 md:gap-6 mb-6 sm:mb-8">
                        {/* Profile Information Card */}
                        <div className="group">
                            <div className="p-4 sm:p-5 md:p-6 lg:p-7 rounded-xl luxury-glass border border-white/10 hover:border-white/20 transition-all duration-300">
                                <div className="flex items-center justify-between mb-4 sm:mb-5 md:mb-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-white/5 flex items-center justify-center border border-white/10">
                                            <FiUser className="w-5 h-5 sm:w-6 sm:h-6 text-white/60" />
                                        </div>
                                        <h3 className="text-lg sm:text-xl font-light text-white tracking-wide">Personal Information</h3>
                                    </div>
                                    {!isEditing && (
                                        <button
                                            onClick={handleEditClick}
                                            className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 flex items-center justify-center transition-all"
                                        >
                                            <FiEdit2 className="w-4 h-4 text-white/60" />
                                        </button>
                                    )}
                                </div>

                                <div className="space-y-4 sm:space-y-5">
                                    {/* Full Name - Editable */}
                                    <div>
                                        <p className="text-[10px] sm:text-xs text-white/40 mb-1.5 sm:mb-2 uppercase tracking-wider">Full Name</p>
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                value={editedName}
                                                onChange={(e) => setEditedName(e.target.value)}
                                                placeholder="Enter your full name"
                                                className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:border-white/30 focus:outline-none transition-all text-sm sm:text-base"
                                            />
                                        ) : (
                                            <p className="text-base sm:text-lg text-white/90">
                                                {profile.fullName || <span className="text-white/40 italic">Not set</span>}
                                            </p>
                                        )}
                                    </div>

                                    {/* Phone - Editable */}
                                    <div>
                                        <p className="text-[10px] sm:text-xs text-white/40 mb-1.5 sm:mb-2 uppercase tracking-wider">Phone Number</p>
                                        {isEditing ? (
                                            <input
                                                type="tel"
                                                value={editedPhone}
                                                onChange={(e) => setEditedPhone(e.target.value)}
                                                placeholder="Enter your phone number"
                                                className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:border-white/30 focus:outline-none transition-all text-sm sm:text-base"
                                            />
                                        ) : (
                                            <p className="text-base sm:text-lg text-white/90">
                                                {profile.phone || <span className="text-white/40 italic">Not set</span>}
                                            </p>
                                        )}
                                    </div>

                                    {/* Email - Read Only */}
                                    <div>
                                        <p className="text-[10px] sm:text-xs text-white/40 mb-1.5 sm:mb-2 uppercase tracking-wider">Email Address</p>
                                        <div className="flex items-center gap-2 sm:gap-3">
                                            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
                                                <FiMail className="w-4 h-4 sm:w-5 sm:h-5 text-white/60" />
                                            </div>
                                            <p className="text-sm sm:text-base text-white/90 break-all">
                                                {profile.email}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Save/Cancel Buttons */}
                                    {isEditing && (
                                        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-2">
                                            <button
                                                onClick={handleSaveProfile}
                                                disabled={isSaving}
                                                className="flex-1 px-4 py-2.5 sm:py-3 bg-white text-black rounded-lg font-semibold text-sm sm:text-base hover:bg-white/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {isSaving ? 'Saving...' : 'Save Changes'}
                                            </button>
                                            <button
                                                onClick={handleCancelEdit}
                                                disabled={isSaving}
                                                className="flex-1 px-4 py-2.5 sm:py-3 bg-white/10 text-white rounded-lg font-semibold text-sm sm:text-base hover:bg-white/20 transition-colors disabled:opacity-50"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    )}

                                    {/* Error/Success Messages */}
                                    {saveError && (
                                        <p className="text-red-400 text-xs sm:text-sm mt-2">{saveError}</p>
                                    )}
                                    {saveSuccess && (
                                        <p className="text-green-400 text-xs sm:text-sm mt-2">Profile updated successfully!</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Shipping Address Card */}
                        <div className="group">
                            <div className="p-4 sm:p-5 md:p-6 lg:p-7 rounded-xl luxury-glass border border-white/10 hover:border-white/20 transition-all duration-300">
                                <div className="flex items-center justify-between mb-4 sm:mb-5 md:mb-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-white/5 flex items-center justify-center border border-white/10">
                                            <FiMapPin className="w-5 h-5 sm:w-6 sm:h-6 text-white/60" />
                                        </div>
                                        <h3 className="text-lg sm:text-xl font-light text-white tracking-wide">Shipping Address</h3>
                                    </div>
                                    <button
                                        className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 flex items-center justify-center transition-all"
                                    >
                                        <FiEdit2 className="w-4 h-4 text-white/60" />
                                    </button>
                                </div>

                                {/* Address placeholder - to be implemented when addresses table is added */}
                                <div className="text-center py-8 sm:py-12">
                                    <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-3 sm:mb-4 rounded-full bg-white/5 flex items-center justify-center">
                                        <FiMapPin className="w-8 h-8 sm:w-10 sm:h-10 text-white/20" />
                                    </div>
                                    <p className="text-white/40 text-xs sm:text-sm mb-4 sm:mb-6">No shipping address on file</p>
                                    <button
                                        className="px-5 sm:px-6 py-3 sm:py-3.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all text-white text-xs sm:text-sm uppercase tracking-wider font-medium min-h-[44px] sm:min-h-[48px]"
                                    >
                                        Add Shipping Address
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Incomplete Profile Warning */}
                    {profile && !profile.profileComplete && (
                        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 md:px-8 lg:px-10 mt-6">
                            <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30 rounded-xl p-4 flex items-start gap-3">
                                <div className="text-amber-400 text-xl mt-0.5">⚠️</div>
                                <div className="flex-1">
                                    <h3 className="text-amber-400 font-semibold text-sm">Profile Incomplete</h3>
                                    <p className="text-white/70 text-sm mt-1">
                                        Please add your {!profile.fullName && 'name'}{!profile.fullName && !profile.phone && ' and '}{!profile.phone && 'phone number'} to unlock all features and complete your checkout.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Logout Button at Bottom */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="mt-6 sm:mt-8"
                    >
                        <motion.button
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            onClick={handleLogout}
                            disabled={isLoggingOut}
                            className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all disabled:opacity-50 text-white min-h-[52px] sm:min-h-[56px]"
                        >
                            <FiLogOut className="w-5 h-5" />
                            <span className="font-medium uppercase tracking-wider text-sm sm:text-base">
                                {isLoggingOut ? 'Logging out...' : 'Logout'}
                            </span>
                        </motion.button>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
