"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FiUser, FiMapPin, FiLogOut, FiMail, FiEdit2, FiLoader, FiX, FiStar } from "react-icons/fi";
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

interface ShippingAddress {
    id?: string;
    fullName: string;
    phone: string;
    email: string;
    houseNumber: string;
    address: string;
    landmark: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    isDefault?: boolean;
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

    // Shipping Address Modal State
    const [showAddressModal, setShowAddressModal] = useState(false);
    const [shippingAddresses, setShippingAddresses] = useState<ShippingAddress[]>([]);
    const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
    const [isLoadingAddress, setIsLoadingAddress] = useState(false);
    const [isSavingAddress, setIsSavingAddress] = useState(false);
    const [addressError, setAddressError] = useState('');
    const [addressForm, setAddressForm] = useState<ShippingAddress>({
        fullName: '',
        phone: '',
        email: '',
        houseNumber: '',
        address: '',
        landmark: '',
        city: '',
        state: '',
        postalCode: '',
        country: 'India',
    });

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

    // Fetch shipping addresses
    useEffect(() => {
        const fetchAddresses = async () => {
            if (!user) return;

            setIsLoadingAddress(true);
            try {
                const response = await apiClient.get('/shipping-addresses');
                if (response.data && response.data.length > 0) {
                    const addresses = response.data.map((addr: any) => ({
                        id: addr.id,
                        fullName: addr.fullName,
                        phone: addr.phone,
                        email: addr.email,
                        houseNumber: addr.houseNumber,
                        address: addr.address,
                        landmark: addr.landmark || '',
                        city: addr.city,
                        state: addr.state,
                        postalCode: addr.postalCode,
                        country: addr.country,
                        isDefault: addr.isDefault,
                    }));
                    setShippingAddresses(addresses);
                }
            } catch (error) {
                console.error('Failed to load shipping addresses:', error);
            } finally {
                setIsLoadingAddress(false);
            }
        };

        if (user) {
            fetchAddresses();
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

    const handleOpenAddressModal = (address?: ShippingAddress) => {
        if (address) {
            setEditingAddressId(address.id || null);
            setAddressForm(address);
        } else {
            setEditingAddressId(null);
            setAddressForm({
                fullName: profile?.fullName || '',
                phone: profile?.phone || '',
                email: profile?.email || '',
                houseNumber: '',
                address: '',
                landmark: '',
                city: '',
                state: '',
                postalCode: '',
                country: 'India',
            });
        }
        setAddressError('');
        setShowAddressModal(true);
    };

    const handleSaveAddress = async () => {
        // Validate all required fields
        if (!addressForm.fullName.trim()) {
            setAddressError('Full name is required');
            return;
        }
        if (!addressForm.phone.trim()) {
            setAddressError('Phone number is required');
            return;
        }
        if (!/^[0-9]{10}$/.test(addressForm.phone)) {
            setAddressError('Please enter a valid 10-digit mobile number');
            return;
        }
        if (!addressForm.email.trim() || !/\S+@\S+\.\S+/.test(addressForm.email)) {
            setAddressError('Valid email is required');
            return;
        }
        if (!addressForm.houseNumber.trim()) {
            setAddressError('House/Apartment number is required');
            return;
        }
        if (!addressForm.address.trim()) {
            setAddressError('Address is required');
            return;
        }
        if (!addressForm.city.trim()) {
            setAddressError('City is required');
            return;
        }
        if (!addressForm.state.trim()) {
            setAddressError('State is required');
            return;
        }
        if (!addressForm.postalCode.trim()) {
            setAddressError('Pincode is required');
            return;
        }
        if (!/^[0-9]{6}$/.test(addressForm.postalCode)) {
            setAddressError('Please enter a valid 6-digit pincode');
            return;
        }

        setIsSavingAddress(true);
        setAddressError('');

        try {
            if (editingAddressId) {
                // Update existing address
                const response = await apiClient.patch(`/shipping-addresses/${editingAddressId}`, addressForm);
                setShippingAddresses(prev =>
                    prev.map(addr => addr.id === editingAddressId ? { ...response.data } : addr)
                );
            } else {
                // Create new address
                const response = await apiClient.post('/shipping-addresses', {
                    ...addressForm,
                    isDefault: shippingAddresses.length === 0, // First address is default
                });
                setShippingAddresses(prev => [...prev, response.data]);
            }

            setShowAddressModal(false);
            setEditingAddressId(null);
        } catch (error: any) {
            setAddressError(error.response?.data?.message || 'Failed to save address');
        } finally {
            setIsSavingAddress(false);
        }
    };

    const handleSetDefault = async (addressId: string) => {
        try {
            await apiClient.patch(`/shipping-addresses/${addressId}/set-default`);
            setShippingAddresses(prev =>
                prev.map(addr => ({
                    ...addr,
                    isDefault: addr.id === addressId,
                }))
            );
        } catch (error) {
            console.error('Failed to set default address:', error);
        }
    };

    const handleDeleteAddress = async (addressId: string) => {
        if (!confirm('Are you sure you want to delete this address?')) return;

        try {
            await apiClient.delete(`/shipping-addresses/${addressId}`);
            setShippingAddresses(prev => prev.filter(addr => addr.id !== addressId));
        } catch (error) {
            console.error('Failed to delete address:', error);
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
        <div className="min-h-screen brand-bg pt-[var(--header-height)] pb-20 sm:pb-24 font-sans">
            <GradientOverlay variant="violet" />

            <div className="relative max-w-screen-xl mx-auto px-4 sm:px-6 md:px-8 lg:px-10">
                <div className="py-6 sm:py-8 md:py-10 lg:py-12">
                    {/* Header - Without Logout */}
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
                                <p className="text-white/60 text-xs sm:text-sm mt-1 flex items-center gap-2 truncate">
                                    <FiMail className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                                    <span className="truncate">{profile.email}</span>
                                </p>
                            </div>
                        </div>
                    </div>

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

                        {/* Shipping Addresses Card */}
                        <div className="group lg:col-span-2">
                            <div className="p-4 sm:p-5 md:p-6 lg:p-7 rounded-xl luxury-glass border border-white/10 hover:border-white/20 transition-all duration-300">
                                <div className="flex items-center justify-between mb-4 sm:mb-5 md:mb-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-white/5 flex items-center justify-center border border-white/10">
                                            <FiMapPin className="w-5 h-5 sm:w-6 sm:h-6 text-white/60" />
                                        </div>
                                        <h3 className="text-lg sm:text-xl font-light text-white tracking-wide">Shipping Addresses</h3>
                                    </div>
                                    <button
                                        onClick={() => handleOpenAddressModal()}
                                        className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 flex items-center gap-2 transition-all text-white text-sm"
                                    >
                                        <span className="text-lg">+</span>
                                        <span className="hidden sm:inline">Add Address</span>
                                    </button>
                                </div>

                                {/* Addresses List or Placeholder */}
                                {isLoadingAddress ? (
                                    <div className="text-center py-8 sm:py-12">
                                        <FiLoader className="w-8 h-8 sm:w-10 sm:h-10 mx-auto mb-3 animate-spin text-white/40" />
                                        <p className="text-white/40 text-xs sm:text-sm">Loading addresses...</p>
                                    </div>
                                ) : shippingAddresses.length > 0 ? (
                                    <div className="space-y-4">
                                        {shippingAddresses.map((addr) => (
                                            <div
                                                key={addr.id}
                                                className="p-4 rounded-lg bg-white/5 border border-white/10 hover:border-white/20 transition-all"
                                            >
                                                <div className="flex items-start justify-between mb-3">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <p className="text-base sm:text-lg font-medium text-white">{addr.fullName}</p>
                                                            {addr.isDefault && (
                                                                <span className="px-2 py-0.5 text-[10px] sm:text-xs bg-white/10 text-white rounded-full">Default</span>
                                                            )}
                                                        </div>
                                                        <p className="text-sm text-white/70">{addr.phone} • {addr.email}</p>
                                                        <p className="text-sm text-white/60 mt-2">
                                                            {addr.houseNumber}, {addr.address}
                                                            {addr.landmark && `, ${addr.landmark}`}
                                                        </p>
                                                        <p className="text-sm text-white/60">
                                                            {addr.city}, {addr.state} {addr.postalCode}, {addr.country}
                                                        </p>
                                                    </div>
                                                    <div className="flex gap-2 ml-4">
                                                        {!addr.isDefault && (
                                                            <button
                                                                onClick={() => handleSetDefault(addr.id!)}
                                                                className="w-8 h-8 rounded-lg bg-white/5 hover:bg-yellow-500/20 flex items-center justify-center transition-all"
                                                                title="Set as default"
                                                            >
                                                                <FiStar className="w-4 h-4 text-white/60" />
                                                            </button>
                                                        )}
                                                        <button
                                                            onClick={() => handleOpenAddressModal(addr)}
                                                            className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all"
                                                            title="Edit"
                                                        >
                                                            <FiEdit2 className="w-4 h-4 text-white/60" />
                                                        </button>
                                                        {!addr.isDefault && (
                                                            <button
                                                                onClick={() => handleDeleteAddress(addr.id!)}
                                                                className="w-8 h-8 rounded-lg bg-white/5 hover:bg-red-500/20 flex items-center justify-center transition-all"
                                                                title="Delete"
                                                            >
                                                                <FiX className="w-4 h-4 text-white/60" />
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8 sm:py-12">
                                        <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-3 sm:mb-4 rounded-full bg-white/5 flex items-center justify-center">
                                            <FiMapPin className="w-8 h-8 sm:w-10 sm:h-10 text-white/20" />
                                        </div>
                                        <p className="text-white/40 text-xs sm:text-sm mb-4 sm:mb-6">No shipping addresses on file</p>
                                        <button
                                            onClick={() => handleOpenAddressModal()}
                                            className="px-5 sm:px-6 py-3 sm:py-3.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all text-white text-xs sm:text-sm uppercase tracking-wider font-medium min-h-[44px] sm:min-h-[48px]"
                                        >
                                            Add Shipping Address
                                        </button>
                                    </div>
                                )}
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

            {/* Shipping Address Modal */}
            {showAddressModal && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-md z-[9999] overflow-y-auto py-8 sm:py-12 px-4"
                    onClick={() => setShowAddressModal(false)}
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="w-full sm:max-w-lg mx-auto rounded-2xl luxury-glass border border-white/10 bg-black/40 backdrop-blur-2xl p-4 sm:p-6"
                    >
                        {/* Modal Header */}
                        <div className="flex items-center justify-between mb-4 sm:mb-6">
                            <h2 className="text-lg sm:text-xl font-light text-white tracking-wide">
                                {editingAddressId ? 'Edit' : 'Add'} Address
                            </h2>
                            <button
                                onClick={() => setShowAddressModal(false)}
                                className="w-9 h-9 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
                            >
                                <FiX className="w-5 h-5 text-white/60" />
                            </button>
                        </div>

                        {/* Address Form */}
                        <div className="space-y-3 sm:space-y-4">
                            {/* Full Name & Phone */}
                            <div className="grid grid-cols-1 gap-3 sm:gap-4">
                                <div>
                                    <label className="block text-[10px] sm:text-xs text-white/60 mb-1.5 sm:mb-2 uppercase tracking-wider">Full Name *</label>
                                    <input
                                        type="text"
                                        value={addressForm.fullName}
                                        onChange={(e) => setAddressForm({ ...addressForm, fullName: e.target.value })}
                                        placeholder="John Doe"
                                        required
                                        minLength={2}
                                        maxLength={100}
                                        className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:border-white/30 focus:outline-none transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] sm:text-xs text-white/60 mb-1.5 sm:mb-2 uppercase tracking-wider">Phone Number *</label>
                                    <input
                                        type="tel"
                                        value={addressForm.phone}
                                        onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                                        placeholder="9876543210"
                                        required
                                        pattern="[0-9]{10}"
                                        maxLength={10}
                                        title="Enter 10-digit mobile number"
                                        className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:border-white/30 focus:outline-none transition-all"
                                    />
                                </div>
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-[10px] sm:text-xs text-white/60 mb-1.5 sm:mb-2 uppercase tracking-wider">Email Address *</label>
                                <input
                                    type="email"
                                    value={addressForm.email}
                                    onChange={(e) => setAddressForm({ ...addressForm, email: e.target.value })}
                                    placeholder="john@example.com"
                                    required
                                    maxLength={100}
                                    className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:border-white/30 focus:outline-none transition-all"
                                />
                            </div>

                            {/* House/Apartment Number */}
                            <div>
                                <label className="block text-[10px] sm:text-xs text-white/60 mb-1.5 sm:mb-2 uppercase tracking-wider">House/Apartment Number *</label>
                                <input
                                    type="text"
                                    value={addressForm.houseNumber}
                                    onChange={(e) => setAddressForm({ ...addressForm, houseNumber: e.target.value })}
                                    placeholder="123, Flat 4B"
                                    required
                                    maxLength={100}
                                    className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:border-white/30 focus:outline-none transition-all"
                                />
                            </div>

                            {/* Address */}
                            <div>
                                <label className="block text-[10px] sm:text-xs text-white/60 mb-1.5 sm:mb-2 uppercase tracking-wider">Address *</label>
                                <input
                                    type="text"
                                    value={addressForm.address}
                                    onChange={(e) => setAddressForm({ ...addressForm, address: e.target.value })}
                                    placeholder="Street name, Area"
                                    required
                                    maxLength={200}
                                    className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:border-white/30 focus:outline-none transition-all"
                                />
                            </div>

                            {/* Landmark */}
                            <div>
                                <label className="block text-[10px] sm:text-xs text-white/60 mb-1.5 sm:mb-2 uppercase tracking-wider">Landmark (Optional)</label>
                                <input
                                    type="text"
                                    value={addressForm.landmark}
                                    onChange={(e) => setAddressForm({ ...addressForm, landmark: e.target.value })}
                                    placeholder="Near Metro Station"
                                    maxLength={100}
                                    className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:border-white/30 focus:outline-none transition-all"
                                />
                            </div>

                            {/* City, State, Postal Code */}
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                                <div>
                                    <label className="block text-[10px] sm:text-xs text-white/60 mb-1.5 sm:mb-2 uppercase tracking-wider">City *</label>
                                    <input
                                        type="text"
                                        value={addressForm.city}
                                        onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                                        placeholder="Mumbai"
                                        required
                                        maxLength={50}
                                        className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:border-white/30 focus:outline-none transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] sm:text-xs text-white/60 mb-1.5 sm:mb-2 uppercase tracking-wider">State *</label>
                                    <input
                                        type="text"
                                        value={addressForm.state}
                                        onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                                        placeholder="Maharashtra"
                                        required
                                        maxLength={50}
                                        className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:border-white/30 focus:outline-none transition-all"
                                    />
                                </div>
                                <div className="col-span-2 sm:col-span-1">
                                    <label className="block text-[10px] sm:text-xs text-white/60 mb-1.5 sm:mb-2 uppercase tracking-wider">Pincode *</label>
                                    <input
                                        type="text"
                                        value={addressForm.postalCode}
                                        onChange={(e) => setAddressForm({ ...addressForm, postalCode: e.target.value.replace(/\D/g, '').slice(0, 6) })}
                                        placeholder="400001"
                                        required
                                        pattern="[0-9]{6}"
                                        maxLength={6}
                                        minLength={6}
                                        title="Enter 6-digit pincode"
                                        className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:border-white/30 focus:outline-none transition-all"
                                    />
                                </div>
                            </div>

                            {/* Country */}
                            <div>
                                <label className="block text-[10px] sm:text-xs text-white/60 mb-1.5 sm:mb-2 uppercase tracking-wider">Country *</label>
                                <input
                                    type="text"
                                    value={addressForm.country}
                                    onChange={(e) => setAddressForm({ ...addressForm, country: e.target.value })}
                                    placeholder="India"
                                    required
                                    maxLength={50}
                                    className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:border-white/30 focus:outline-none transition-all"
                                />
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-2 sm:gap-3 pt-2 sm:pt-4">
                                <button
                                    onClick={() => setShowAddressModal(false)}
                                    disabled={isSavingAddress}
                                    className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-all disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSaveAddress}
                                    disabled={isSavingAddress}
                                    className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base rounded-lg bg-white text-black hover:bg-white/90 transition-all font-medium disabled:opacity-50"
                                >
                                    {isSavingAddress ? 'Saving...' : 'Save'}
                                </button>
                            </div>

                            {/* Error Message */}
                            {addressError && (
                                <p className="text-red-400 text-xs sm:text-sm mt-2">{addressError}</p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
