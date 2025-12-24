"use client";

import { memo, useEffect } from "react";
import { FiCheck, FiStar } from "react-icons/fi";

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

interface AddressSelectorProps {
    addresses: ShippingAddress[];
    selectedAddressId: string | null;
    onSelectAddress: (id: string) => void;
    onAddNewAddress: () => void;
    isLoading: boolean;
}

// Phase 1.2: React.memo for render optimization
export default memo(function AddressSelector({
    addresses,
    selectedAddressId,
    onSelectAddress,
    onAddNewAddress,
    isLoading,
}: AddressSelectorProps) {
    // Render measurement
    useEffect(() => {
        if (process.env.NODE_ENV === 'development') {
            console.count('AddressSelector render');
        }
    });
    if (isLoading) {
        return (
            <div className="text-center py-12">
                <div className="w-10 h-10 border-2 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-3"></div>
                <p className="text-white/60 text-sm">Loading addresses...</p>
            </div>
        );
    }

    if (addresses.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-white/60 text-sm mb-4">No saved addresses</p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {addresses.map((addr) => (
                <div
                    key={addr.id}
                    onClick={() => onSelectAddress(addr.id)}
                    className={`p-4 rounded-lg cursor-pointer transition-all ${selectedAddressId === addr.id
                        ? 'border-2 border-white bg-white/5'
                        : 'border border-white/10 hover:border-white/30'
                        }`}
                >
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                                <p className="text-base font-medium text-white">
                                    {addr.fullName}
                                </p>
                                {addr.isDefault && (
                                    <span className="px-2 py-0.5 text-[10px] bg-white/10 text-white rounded-full flex items-center gap-1">
                                        <FiStar className="w-3 h-3" /> Default
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
                                {addr.city}, {addr.state} {addr.postalCode}, {addr.country}
                            </p>
                        </div>
                        {selectedAddressId === addr.id && (
                            <div className="ml-4 w-6 h-6 rounded-full bg-white flex items-center justify-center flex-shrink-0">
                                <FiCheck className="w-4 h-4 text-black" />
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
});
