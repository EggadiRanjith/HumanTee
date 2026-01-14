import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/api-client";
import { queryKeys } from "@/lib/queryKeys";
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
    const queryClient = useQueryClient();

    // ✅ OPTIMIZED: Use React Query - checks cache from login payload first
    const { data: profileData, isLoading: isLoadingProfile, error: profileError, refetch: retryProfile } = useQuery({
        queryKey: queryKeys.user,
        queryFn: async () => {
            const response = await apiClient.get('/auth/me');
            return {
                id: response.data.id,
                email: response.data.email,
                role: response.data.role,
                fullName: response.data.profile?.fullName,
                phone: response.data.profile?.phone,
                avatarUrl: response.data.profile?.avatarUrl,
                profileComplete: response.data.profileComplete,
            };
        },
        enabled: !!userId,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });

    // ✅ OPTIMIZED: Use React Query - checks cache from login payload first
    const { data: addressesData, isLoading: isLoadingAddresses, error: addressesError, refetch: retryAddresses } = useQuery({
        queryKey: queryKeys.addresses(userId || ''),
        queryFn: async () => {
            const response = await apiClient.get('/shipping-addresses');
            if (response.data && response.data.length > 0) {
                return response.data.map((addr: any) => ({
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
            }
            return [];
        },
        enabled: !!userId,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });

    const updateProfile = (updated: Partial<UserProfile>) => {
        queryClient.setQueryData(queryKeys.user, (old: any) =>
            old ? { ...old, ...updated } : null
        );
    };

    const updateAddresses = (addresses: ShippingAddress[]) => {
        queryClient.setQueryData(queryKeys.addresses(userId || ''), addresses);
    };

    return {
        profile: profileData || (userId ? {
            id: userId,
            email: userEmail || '',
            role: userRole || 'customer',
            profileComplete: false,
        } : null),
        isLoadingProfile,
        profileError: !!profileError,
        shippingAddresses: addressesData || [],
        isLoadingAddresses,
        addressesError: !!addressesError,
        updateProfile,
        updateAddresses,
        retryProfile,
        retryAddresses,
    };
}
