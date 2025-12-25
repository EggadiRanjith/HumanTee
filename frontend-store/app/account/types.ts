/**
 * Account Types
 * Complete type definitions for account management
 */

export interface UserProfile {
    id: string;
    email: string;
    fullName: string | null;
    phone: string | null;
    role: 'customer' | 'admin';
    profileComplete: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface ShippingAddress {
    id: string;
    userId: string;
    fullName: string;
    email: string;
    phone: string;
    houseNumber: string;
    address: string;
    landmark?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    isDefault: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface AccountSection {
    id: string;
    title: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
    href: string;
    badge?: number;
    color?: string;
}

export interface ProfileUpdateData {
    fullName?: string;
    phone?: string;
}

export interface AddressFormData {
    fullName: string;
    email: string;
    phone: string;
    houseNumber: string;
    address: string;
    landmark?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    isDefault: boolean;
}

export interface ProfileWarningProps {
    profileComplete: boolean;
    missingName: boolean;
    missingPhone: boolean;
}
