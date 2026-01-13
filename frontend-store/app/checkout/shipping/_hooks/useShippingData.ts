import { useState, useEffect } from "react";
import { logError } from '@/lib/logger';
import { useRouter } from "next/navigation";
import apiClient from "@/lib/api-client";

interface ShippingAddress {
    id: string;
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
    isDefault: boolean;
}

interface AddressFormData {
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
}

export function useShippingData(userId?: string) {
    const router = useRouter();
    const [addresses, setAddresses] = useState<ShippingAddress[]>([]);
    const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
    const [isLoadingAddresses, setIsLoadingAddresses] = useState(true);
    const [showAddressModal, setShowAddressModal] = useState(false);
    const [addressForm, setAddressForm] = useState<AddressFormData>({
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
    const [isSavingAddress, setIsSavingAddress] = useState(false);
    const [addressError, setAddressError] = useState('');

    // Fetch addresses
    useEffect(() => {
        const fetchAddresses = async () => {
            if (!userId) {
                const localAddress = typeof window !== 'undefined' ? localStorage.getItem('guest_address') : null;
                if (localAddress) {
                    try {
                        const parsed = JSON.parse(localAddress);
                        setAddresses([parsed]);
                        setSelectedAddressId(parsed.id);
                    } catch (e) {
                        console.error('Failed to parse guest address', e);
                    }
                }
                setIsLoadingAddresses(false);
                return;
            }

            setIsLoadingAddresses(true);
            try {
                const response = await apiClient.get('/shipping-addresses');
                if (response.data && response.data.length > 0) {
                    setAddresses(response.data);
                    // Auto-select default address
                    const defaultAddr = response.data.find(
                        (addr: ShippingAddress) => addr.isDefault
                    );
                    if (defaultAddr) {
                        setSelectedAddressId(defaultAddr.id);
                    } else {
                        setSelectedAddressId(response.data[0].id);
                    }
                }
            } catch (error) {
                logError(error, 'Failed to load addresses');
            } finally {
                setIsLoadingAddresses(false);
            }
        };

        fetchAddresses();
    }, [userId]);

    const openAddressModal = () => {
        setAddressForm({
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
        setAddressError('');
        setShowAddressModal(true);
    };

    const closeAddressModal = () => {
        setShowAddressModal(false);
        setAddressError('');
    };

    // Single validation function - used by both validateAddress and saveAddress
    const validateAddressData = (data: AddressFormData): string | null => {
        if (!data.fullName.trim()) return 'Full name is required';
        if (!/^[0-9]{10}$/.test(data.phone)) {
            return 'Please enter a valid 10-digit mobile number';
        }
        if (!data.email.trim() || !/\S+@\S+\.\S+/.test(data.email)) {
            return 'Valid email is required';
        }
        if (
            !data.houseNumber.trim() ||
            !data.address.trim() ||
            !data.city.trim() ||
            !data.state.trim()
        ) {
            return 'All address fields are required';
        }
        if (!/^[0-9]{6}$/.test(data.postalCode)) {
            return 'Please enter a valid 6-digit pincode';
        }
        return null;
    };

    const validateAddress = (): string | null => {
        return validateAddressData(addressForm);
    };

    const saveAddress = async (dataToSave?: any): Promise<boolean> => {
        // Use provided data or fall back to state
        const addressData = dataToSave || addressForm;

        // Check if this is an edit operation (has id field)
        const isEditing = !!addressData.id;

        // Validate using shared function
        const validationError = validateAddressData(addressData);
        if (validationError) {
            setAddressError(validationError);
            return false;
        }

        setIsSavingAddress(true);
        setAddressError('');

        try {
            if (!userId) {
                // GUEST FLOW: Save locally
                const guestAddress: ShippingAddress = {
                    ...addressData,
                    id: addressData.id || `guest_${Date.now()}`,
                    isDefault: true
                };
                setAddresses([guestAddress]);
                setSelectedAddressId(guestAddress.id);
                if (typeof window !== 'undefined') {
                    localStorage.setItem('guest_address', JSON.stringify(guestAddress));
                }
                setShowAddressModal(false);
                return true;
            }


            if (isEditing) {
                // UPDATE existing address - exclude ALL metadata fields
                const { id, isDefault, userId, createdAt, updatedAt, deletedAt, ...updateData } = addressData;
                const response = await apiClient.patch(`/shipping-addresses/${id}`, updateData);
                setAddresses((prev) =>
                    prev.map((addr) => (addr.id === id ? response.data : addr))
                );
            } else {
                // CREATE new address
                const response = await apiClient.post('/shipping-addresses', {
                    ...addressData,
                    isDefault: addresses.length === 0,
                });
                setAddresses((prev) => [...prev, response.data]);
                setSelectedAddressId(response.data.id);
            }



            setShowAddressModal(false);
            return true;
        } catch (error: any) {
            console.error('❌ Save Address Error:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status,
                fullError: error
            });
            setAddressError(
                error.response?.data?.message || `Failed to ${isEditing ? 'update' : 'save'} address`
            );
            return false;
        } finally {
            setIsSavingAddress(false);
        }
    };

    return {
        addresses,
        selectedAddressId,
        setSelectedAddressId,
        isLoadingAddresses,
        showAddressModal,
        addressForm,
        setAddressForm,
        isSavingAddress,
        addressError,
        openAddressModal,
        closeAddressModal,
        saveAddress,
    };
}
