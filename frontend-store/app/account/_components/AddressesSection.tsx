"use client";

import { useState, memo, useEffect } from "react";
import { logError } from '@/lib/logger';
import dynamic from "next/dynamic";
import { FiMapPin, FiEdit2, FiX, FiStar, FiLoader } from "react-icons/fi";
import apiClient from "@/lib/api-client";

// Lazy-load modal (Phase 1.1 - Runtime optimization)
const AddressModal = dynamic(() => import("./AddressModal"), { ssr: false });

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

interface AddressesSectionProps {
    addresses: ShippingAddress[];
    isLoading: boolean;
    onAddressesChange: (addresses: ShippingAddress[]) => void;
    profileEmail?: string;
    profileName?: string;
    profilePhone?: string;
}

// Phase 1.2: React.memo for render optimization
export default memo(function AddressesSection({
    addresses,
    isLoading,
    onAddressesChange,
    profileEmail,
    profileName,
    profilePhone,
}: AddressesSectionProps) {
    // Render measurement
    useEffect(() => {
        if (process.env.NODE_ENV === 'development') {
            console.count('AddressesSection render');
        }
    });
    const [showModal, setShowModal] = useState(false);
    const [editingAddress, setEditingAddress] = useState<ShippingAddress | null>(null);

    const handleOpenModal = (address?: ShippingAddress) => {
        if (address) {
            setEditingAddress(address);
        } else {
            setEditingAddress(null);
        }
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingAddress(null);
    };

    const handleSaveAddress = async (
        addressData: Omit<ShippingAddress, 'id' | 'isDefault'>
    ) => {
        if (editingAddress?.id) {
            // Update existing
            const response = await apiClient.patch(
                `/shipping-addresses/${editingAddress.id}`,
                addressData
            );
            onAddressesChange(
                addresses.map((addr) =>
                    addr.id === editingAddress.id ? response.data : addr
                )
            );
        } else {
            // Create new
            const response = await apiClient.post('/shipping-addresses', {
                ...addressData,
                isDefault: addresses.length === 0,
            });
            onAddressesChange([...addresses, response.data]);
        }
    };

    const handleSetDefault = async (addressId: string) => {
        try {
            await apiClient.patch(`/shipping-addresses/${addressId}/set-default`);
            onAddressesChange(
                addresses.map((addr) => ({
                    ...addr,
                    isDefault: addr.id === addressId,
                }))
            );
        } catch (error) {
            logError(error, 'Failed to set default address');
        }
    };

    const handleDeleteAddress = async (addressId: string) => {
        if (!confirm('Are you sure you want to delete this address?')) return;

        try {
            await apiClient.delete(`/shipping-addresses/${addressId}`);
            onAddressesChange(addresses.filter((addr) => addr.id !== addressId));
        } catch (error) {
            logError(error, 'Failed to delete address');
        }
    };

    return (
        <>
            <div className="group lg:col-span-2">
                <div className="p-4 sm:p-5 md:p-6 lg:p-7 rounded-xl luxury-glass border border-white/10 hover:border-white/20 transition-all duration-300">
                    <div className="flex items-center justify-between mb-4 sm:mb-5 md:mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-white/5 flex items-center justify-center border border-white/10">
                                <FiMapPin className="w-5 h-5 sm:w-6 sm:h-6 text-white/60" />
                            </div>
                            <h3 className="text-lg sm:text-xl font-light text-white tracking-wide">
                                Shipping Addresses
                            </h3>
                        </div>
                        <button
                            onClick={() => handleOpenModal()}
                            className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 flex items-center gap-2 transition-all text-white text-sm"
                        >
                            <span className="text-lg">+</span>
                            <span className="hidden sm:inline">Add Address</span>
                        </button>
                    </div>

                    {/* Content */}
                    {isLoading ? (
                        <div className="text-center py-8 sm:py-12">
                            <FiLoader className="w-8 h-8 sm:w-10 sm:h-10 mx-auto mb-3 animate-spin text-white/40" />
                            <p className="text-white/40 text-xs sm:text-sm">
                                Loading addresses...
                            </p>
                        </div>
                    ) : addresses.length > 0 ? (
                        <div className="space-y-4">
                            {addresses.map((addr) => (
                                <div
                                    key={addr.id}
                                    className="p-4 rounded-lg bg-white/5 border border-white/10 hover:border-white/20 transition-all"
                                >
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <p className="text-base sm:text-lg font-medium text-white">
                                                    {addr.fullName}
                                                </p>
                                                {addr.isDefault && (
                                                    <span className="px-2 py-0.5 text-[10px] sm:text-xs bg-white/10 text-white rounded-full">
                                                        Default
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-sm text-white/70">
                                                {addr.phone} • {addr.email}
                                            </p>
                                            <p className="text-sm text-white/60 mt-2">
                                                {addr.houseNumber}, {addr.address}
                                                {addr.landmark && `, ${addr.landmark}`}
                                            </p>
                                            <p className="text-sm text-white/60">
                                                {addr.city}, {addr.state} {addr.postalCode},{' '}
                                                {addr.country}
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
                                                onClick={() => handleOpenModal(addr)}
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
                            <p className="text-white/40 text-xs sm:text-sm mb-4 sm:mb-6">
                                No shipping addresses on file
                            </p>
                            <button
                                onClick={() => handleOpenModal()}
                                className="px-5 sm:px-6 py-3 sm:py-3.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all text-white text-xs sm:text-sm uppercase tracking-wider font-medium min-h-[44px] sm:min-h-[48px]"
                            >
                                Add Shipping Address
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal */}
            <AddressModal
                isOpen={showModal}
                onClose={handleCloseModal}
                onSave={handleSaveAddress}
                editingAddress={editingAddress}
                defaultFormData={{
                    fullName: profileName,
                    phone: profilePhone,
                    email: profileEmail,
                }}
            />
        </>
    );
});
