import { useState, useEffect } from "react";
import apiClient from "@/lib/api-client";
import { logError } from "@/lib/logger";

interface UserProfile {
    id: string;
    email: string;
    role: string;
    fullName?: string;
    phone?: string;
    avatarUrl?: string;
    profileComplete?: boolean;
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

interface UseProfileDataReturn {
    profile: UserProfile | null;
    isLoadingProfile: boolean;
    profileError: boolean;
    shippingAddresses: ShippingAddress[];
    isLoadingAddresses: boolean;
    addressesError: boolean;
    updateProfile: (updated: Partial<UserProfile>) => void;
    updateAddresses: (addresses: ShippingAddress[]) => void;
    retryProfile: () => void;
    retryAddresses: () => void;
}


export function useProfileData(
    userId?: string,
    userEmail?: string,
    userRole?: string
): UseProfileDataReturn {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [isLoadingProfile, setIsLoadingProfile] = useState(true);
    const [profileError, setProfileError] = useState(false);
    const [shippingAddresses, setShippingAddresses] = useState<ShippingAddress[]>([]);
    const [isLoadingAddresses, setIsLoadingAddresses] = useState(false);
    const [addressesError, setAddressesError] = useState(false);

    // Fetch profile
    const fetchProfile = async () => {
        if (!userId) return;

        setIsLoadingProfile(true);
        setProfileError(false);
        try {
            const response = await apiClient.get('/auth/me');
            setProfile({
                id: response.data.id,
                email: response.data.email,
                role: response.data.role,
                fullName: response.data.profile?.fullName,
                phone: response.data.profile?.phone,
                avatarUrl: response.data.profile?.avatarUrl,
                profileComplete: response.data.profileComplete,
            });
        } catch (error) {
            logError(error, 'Failed to load profile');
            setProfileError(true);
            // Fallback
            setProfile({
                id: userId,
                email: userEmail || '',
                role: userRole || 'customer',
                profileComplete: false,
            });
        } finally {
            setIsLoadingProfile(false);
        }
    };

    useEffect(() => {
        if (userId) {
            fetchProfile();
        }
    }, [userId, userEmail, userRole]);

    // Fetch addresses
    const fetchAddresses = async () => {
        if (!userId) return;

        setIsLoadingAddresses(true);
        setAddressesError(false);
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
            logError(error, 'Failed to load shipping addresses');
            setAddressesError(true);
        } finally {
            setIsLoadingAddresses(false);
        }
    };

    useEffect(() => {
        if (userId) {
            fetchAddresses();
        }
    }, [userId]);

    const updateProfile = (updated: Partial<UserProfile>) => {
        setProfile((prev) => (prev ? { ...prev, ...updated } : null));
    };

    const updateAddresses = (addresses: ShippingAddress[]) => {
        setShippingAddresses(addresses);
    };

    const retryProfile = () => {
        fetchProfile();
    };

    const retryAddresses = () => {
        fetchAddresses();
    };

    return {
        profile,
        isLoadingProfile,
        profileError,
        shippingAddresses,
        isLoadingAddresses,
        addressesError,
        updateProfile,
        updateAddresses,
        retryProfile,
        retryAddresses,
    };
}
