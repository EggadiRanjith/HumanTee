"use client";

import { memo, useEffect, useState } from "react";
import { FiCheck, FiStar, FiChevronDown } from "react-icons/fi";

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
    // Pagination state - MUST be before any early returns
    const [visibleCount, setVisibleCount] = useState(3);

    // Render measurement
    useEffect(() => {
        if (process.env.NODE_ENV === 'development') {
            console.count('AddressSelector render');
        }
    });

    // Reset visible count when addresses change
    useEffect(() => {
        setVisibleCount(3);
    }, [addresses.length]);

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

    // Calculate pagination values after early returns
    const hasMore = addresses.length > visibleCount;
    const remainingCount = addresses.length - visibleCount;
    const visibleAddresses = addresses.slice(0, visibleCount);

    return (
        <div className="space-y-3">
            {visibleAddresses.map((addr) => (
                <div
                    key={addr.id}
                    onClick={() => onSelectAddress(addr.id)}
                    className={`p-4 rounded-lg cursor-pointer transition-all ${selectedAddressId === addr.id
                        ? 'border-2 border-white bg-white/5'
                        : 'border border-white/10 hover:border-white/30'
                        }`}
                >
                    <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2 flex-wrap">
                                <p className="text-[13px] sm:text-[14px] font-medium text-white truncate">
                                    {addr.fullName}
                                </p>
                                {addr.isDefault && (
                                    <span className="px-2 py-0.5 text-[10px] bg-white/10 text-white rounded-full flex items-center gap-1 flex-shrink-0">
                                        <FiStar className="w-3 h-3" /> Default
                                    </span>
                                )}
                            </div>
                            <p className="text-[12px] text-white/70 truncate">
                                {addr.phone} • {addr.email}
                            </p>
                            <p className="text-[12px] text-white/60 mt-2 line-clamp-2">
                                {addr.houseNumber}, {addr.address}
                                {addr.landmark && `, ${addr.landmark}`}
                            </p>
                            <p className="text-[12px] text-white/60 truncate">
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

            {/* Show More/Less Buttons */}
            {hasMore && (
                <button
                    onClick={() => setVisibleCount(prev => prev + 3)}
                    className="
                        w-full py-3 rounded-lg border border-white/10 
                        text-white/70 hover:text-white hover:border-white/20 hover:bg-white/5
                        transition-all text-[12px] uppercase tracking-wide
                        flex items-center justify-center gap-2
                        min-h-[44px]
                    "
                >
                    <FiChevronDown className="w-4 h-4" />
                    Show More ({remainingCount} more)
                </button>
            )}

            {visibleCount > 3 && (
                <button
                    onClick={() => setVisibleCount(3)}
                    className="
                        w-full py-3 rounded-lg border border-white/10 
                        text-white/70 hover:text-white hover:border-white/20 hover:bg-white/5
                        transition-all text-[12px] uppercase tracking-wide
                        flex items-center justify-center gap-2
                        min-h-[44px]
                    "
                >
                    <FiChevronDown className="w-4 h-4 rotate-180" />
                    Show Less
                </button>
            )}
        </div>
    );
});
