"use client";

import { useState, memo, useEffect } from "react";
import { FiUser, FiEdit2, FiMail } from "react-icons/fi";
import apiClient from "@/lib/api-client";
import { CountryCodeSelect } from "@/app/components/ui/form/CountryCodeSelect";
import { validatePhoneNumber, parsePhoneNumber, combinePhoneNumber } from "@/lib/utils/phoneValidation";

interface UserProfile {
    id: string;
    email: string;
    role: string;
    fullName?: string;
    phone?: string;
    avatarUrl?: string;
    profileComplete?: boolean;
}

interface ProfileSectionProps {
    profile: UserProfile;
    onProfileUpdate: (updated: Partial<UserProfile>) => void;
}

// Phase 1.2: React.memo for render optimization
export default memo(function ProfileSection({
    profile,
    onProfileUpdate,
}: ProfileSectionProps) {
    // Render measurement
    useEffect(() => {
        if (process.env.NODE_ENV === 'development') {
            console.count('ProfileSection render');
        }
    });
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [editedName, setEditedName] = useState('');
    const [editedCountryCode, setEditedCountryCode] = useState('+91');
    const [editedPhone, setEditedPhone] = useState('');
    const [phoneError, setPhoneError] = useState('');
    const [saveError, setSaveError] = useState('');
    const [saveSuccess, setSaveSuccess] = useState(false);

    // Initialize form values when component mounts or profile data changes
    // Use stringified values to ensure stable dependency array size
    const profileKey = `${profile.fullName || ''}-${profile.phone || ''}`;

    useEffect(() => {

        setEditedName(profile.fullName || '');
        if (profile.phone) {
            const parsed = parsePhoneNumber(profile.phone);

            setEditedCountryCode(parsed.countryCode);
            setEditedPhone(parsed.phoneNumber);

        } else {
            setEditedCountryCode('+91');
            setEditedPhone('');
        }
    }, [profileKey, profile.fullName, profile.phone]);

    const handleEditClick = () => {
        // Values are already set by useEffect, just enable editing
        setIsEditing(true);
        setPhoneError('');
        setSaveError('');
        setSaveSuccess(false);
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        // Reset to original values
        setEditedName(profile.fullName || '');
        if (profile.phone) {
            const parsed = parsePhoneNumber(profile.phone);
            setEditedCountryCode(parsed.countryCode);
            setEditedPhone(parsed.phoneNumber);
        } else {
            setEditedCountryCode('+91');
            setEditedPhone('');
        }
        setPhoneError('');
        setSaveError('');
        setSaveSuccess(false);
    };

    const handleSaveProfile = async () => {
        // Validate phone if provided
        if (editedPhone.trim()) {
            const validation = validatePhoneNumber(editedCountryCode, editedPhone);
            if (!validation.isValid) {
                setPhoneError(validation.error || 'Invalid phone number');
                return;
            }
        }

        setIsSaving(true);
        setSaveError('');
        setSaveSuccess(false);
        setPhoneError('');

        try {
            const fullPhone = editedPhone.trim()
                ? combinePhoneNumber(editedCountryCode, editedPhone)
                : '';

            const response = await apiClient.patch('/auth/profile', {
                fullName: editedName.trim(),
                phone: fullPhone,
            });

            onProfileUpdate({
                fullName: response.data.profile.fullName,
                phone: response.data.profile.phone,
                profileComplete: response.data.profileComplete,
            });

            setIsEditing(false);
            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 3000);
        } catch (error: any) {
            setSaveError(
                error.response?.data?.message || 'Failed to update profile'
            );
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="group">
            <div className="p-4 sm:p-5 md:p-6 lg:p-7 rounded-xl luxury-glass border border-white/10 hover:border-white/20 transition-all duration-300">
                <div className="flex items-center justify-between mb-4 sm:mb-5 md:mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-white/5 flex items-center justify-center border border-white/10">
                            <FiUser className="w-5 h-5 sm:w-6 sm:h-6 text-white/60" />
                        </div>
                        <h3 className="text-lg sm:text-xl font-light text-white tracking-wide">
                            Personal Information
                        </h3>
                    </div>
                    {!isEditing && (
                        <button
                            onClick={handleEditClick}
                            aria-label="Edit personal information"
                            className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 flex items-center justify-center transition-all min-h-[44px] min-w-[44px]"
                        >
                            <FiEdit2 className="w-4 h-4 text-white/60" aria-hidden="true" />
                        </button>
                    )}
                </div>

                <div className="space-y-4 sm:space-y-5">
                    {/* Full Name */}
                    <div>
                        <label htmlFor="fullname-input" className="text-[10px] sm:text-xs text-white/40 mb-1.5 sm:mb-2 uppercase tracking-wider block">
                            Full Name
                        </label>
                        {isEditing ? (
                            <input
                                id="fullname-input"
                                type="text"
                                value={editedName}
                                onChange={(e) => setEditedName(e.target.value)}
                                placeholder="Enter your full name"
                                autoComplete="name"
                                aria-label="Full name"
                                className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:border-white/30 focus:outline-none transition-all text-sm sm:text-base min-h-[44px]"
                            />
                        ) : (
                            <p className="text-base sm:text-lg text-white/90">
                                {profile.fullName || (
                                    <span className="text-white/40 italic">Not set</span>
                                )}
                            </p>
                        )}
                    </div>

                    {/* Phone */}
                    <div>
                        <label htmlFor="phone-input" className="text-[10px] sm:text-xs text-white/40 mb-1.5 sm:mb-2 uppercase tracking-wider block">
                            Phone Number
                        </label>
                        {isEditing ? (
                            <div className="space-y-2">
                                <div className="grid grid-cols-[120px_1fr] sm:grid-cols-[140px_1fr] gap-2">
                                    {/* Country Code Selector */}
                                    <CountryCodeSelect
                                        value={editedCountryCode}
                                        onChange={(code) => {
                                            setEditedCountryCode(code);
                                            setPhoneError('');
                                        }}
                                    />
                                    {/* Phone Number Input */}
                                    <input
                                        id="phone-input"
                                        type="tel"
                                        value={editedPhone}
                                        onChange={(e) => {
                                            // Only allow digits
                                            const value = e.target.value.replace(/[^0-9]/g, '');
                                            setEditedPhone(value);
                                            setPhoneError('');
                                        }}
                                        placeholder="9876543210"
                                        autoComplete="tel"
                                        inputMode="numeric"
                                        aria-label="Phone number"
                                        aria-invalid={!!phoneError}
                                        aria-describedby={phoneError ? "phone-error" : undefined}
                                        className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg bg-white/5 border text-white placeholder:text-white/30 focus:outline-none transition-all text-sm sm:text-base ${phoneError ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-white/30'
                                            }`}
                                    />
                                </div>
                                {phoneError && (
                                    <p id="phone-error" role="alert" className="text-red-400 text-xs">
                                        {phoneError}
                                    </p>
                                )}
                            </div>
                        ) : (
                            <p className="text-base sm:text-lg text-white/90">
                                {profile.phone || (
                                    <span className="text-white/40 italic">Not set</span>
                                )}
                            </p>
                        )}
                    </div>

                    {/* Email (Read-only) */}
                    <div>
                        <p className="text-[10px] sm:text-xs text-white/40 mb-1.5 sm:mb-2 uppercase tracking-wider">
                            Email Address
                        </p>
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
                                aria-busy={isSaving}
                                aria-label={isSaving ? "Saving profile changes" : "Save profile changes"}
                                className="flex-1 px-4 py-2.5 sm:py-3 bg-white text-black rounded-lg font-semibold text-sm sm:text-base hover:bg-white/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
                            >
                                {isSaving ? 'Saving...' : 'Save Changes'}
                            </button>
                            <button
                                onClick={handleCancelEdit}
                                disabled={isSaving}
                                aria-label="Cancel editing"
                                className="flex-1 px-4 py-2.5 sm:py-3 bg-white/10 text-white rounded-lg font-semibold text-sm sm:text-base hover:bg-white/20 transition-colors disabled:opacity-50 min-h-[44px]"
                            >
                                Cancel
                            </button>
                        </div>
                    )}

                    {/* Messages */}
                    {saveError && (
                        <p
                            role="alert"
                            aria-live="assertive"
                            className="text-red-400 text-xs sm:text-sm mt-2"
                        >
                            {saveError}
                        </p>
                    )}
                    {saveSuccess && (
                        <p
                            role="status"
                            aria-live="polite"
                            className="text-green-400 text-xs sm:text-sm mt-2"
                        >
                            Profile updated successfully!
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
});
