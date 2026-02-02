import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
import { useUser } from "@/lib/queries/useUser";
import { useAddresses } from "@/lib/queries/useAddresses";

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

function normalizeProfile(raw: any): UserProfile | null {
    if (!raw) return null;
    const profileData = raw.profile?.profile || raw.profile || {};
    return {
        id: raw.id,
        email: raw.email,
        role: raw.role,
        fullName: profileData.fullName ?? raw.fullName,
        phone: profileData.phone ?? raw.phone,
        avatarUrl: profileData.avatarUrl ?? raw.avatarUrl,
        profileComplete: raw.profileComplete ?? profileData.profileComplete,
    };
}

function normalizeAddresses(raw: any[]): ShippingAddress[] {
    if (!Array.isArray(raw) || raw.length === 0) return [];
    return raw.map((addr: any) => ({
        id: addr.id,
        fullName: addr.fullName,
        phone: addr.phone,
        email: addr.email,
        houseNumber: addr.houseNumber,
        address: addr.address,
        landmark: addr.landmark ?? "",
        city: addr.city,
        state: addr.state,
        postalCode: addr.postalCode,
        country: addr.country,
        isDefault: addr.isDefault,
    }));
}

/**
 * Single source for profile + addresses. Uses useUser and useAddresses
 * (no duplicate GET /auth/me or GET /shipping-addresses).
 */
export function useProfileData(
    userId?: string,
    userEmail?: string,
    userRole?: string,
    authReady?: boolean // NEW: Wait for AuthContext to finish loading
): UseProfileDataReturn {
    const queryClient = useQueryClient();

    const { data: userData, isLoading: isLoadingProfile, error: profileError, refetch: retryProfile } = useUser({
        enabled: !!userId && authReady !== false, // Only enable when auth is ready
    });

    const { data: addressesData, isLoading: isLoadingAddresses, error: addressesError, refetch: retryAddresses } =
        useAddresses(userId ?? "");

    // Get cached profile data even if query is disabled (after session expires)
    const cachedProfile = queryClient.getQueryData(queryKeys.user);
    const normalizedCached = normalizeProfile(cachedProfile);

    // Use current data if available, otherwise fall back to cached data (stale)
    const profile = normalizeProfile(userData) ?? normalizedCached ?? (userId ? {
        id: userId,
        email: userEmail ?? "",
        role: userRole ?? "customer",
        profileComplete: false,
    } : null);

    const shippingAddresses = normalizeAddresses(addressesData ?? []);

    const updateProfile = (updated: Partial<UserProfile>) => {
        queryClient.setQueryData(queryKeys.user, (old: any) => {
            if (!old) return old;
            const profile = old.profile?.profile || old.profile || {};
            const merged = { ...profile, ...updated };
            if (old.fullName != null || old.profile == null) {
                return { ...old, ...merged };
            }
            return {
                ...old,
                profile: { ...(old.profile || {}), profile: merged },
                profileComplete: updated.profileComplete ?? old.profileComplete,
            };
        });
    };

    const updateAddresses = (addresses: ShippingAddress[]) => {
        queryClient.setQueryData(queryKeys.addresses(userId ?? ""), addresses);
    };

    return {
        profile,
        isLoadingProfile,
        profileError: !!profileError,
        shippingAddresses,
        isLoadingAddresses,
        addressesError: !!addressesError,
        updateProfile,
        updateAddresses,
        retryProfile,
        retryAddresses,
    };
}
