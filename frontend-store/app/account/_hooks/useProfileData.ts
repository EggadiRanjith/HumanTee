import { useState, useEffect } from "react";
import apiClient from "@/lib/api-client";

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
    shippingAddresses: ShippingAddress[];
    isLoadingAddresses: boolean;
    updateProfile: (updated: Partial<UserProfile>) => void;
    updateAddresses: (addresses: ShippingAddress[]) => void;
}

export function useProfileData(
    userId?: string,
    userEmail?: string,
    userRole?: string
): UseProfileDataReturn {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [isLoadingProfile, setIsLoadingProfile] = useState(true);
    const [shippingAddresses, setShippingAddresses] = useState<ShippingAddress[]>([]);
    const [isLoadingAddresses, setIsLoadingAddresses] = useState(false);

    // Fetch profile
    useEffect(() => {
        const fetchProfile = async () => {
            if (!userId) return;

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
                console.error('Failed to load profile:', error);
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

        if (userId) {
            fetchProfile();
        }
    }, [userId, userEmail, userRole]);

    // Fetch addresses
    useEffect(() => {
        const fetchAddresses = async () => {
            if (!userId) return;

            setIsLoadingAddresses(true);
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
                setIsLoadingAddresses(false);
            }
        };

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

    return {
        profile,
        isLoadingProfile,
        shippingAddresses,
        isLoadingAddresses,
        updateProfile,
        updateAddresses,
    };
}
