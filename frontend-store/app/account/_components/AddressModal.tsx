import { useState, useEffect, useCallback } from "react";
import { FiX } from "react-icons/fi";
import { usePincodeLookup } from "@/lib/hooks/usePincodeLookup";

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

interface AddressModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (addressData: Omit<ShippingAddress, 'id' | 'isDefault'>) => Promise<void>;
    editingAddress?: ShippingAddress | null;
    defaultFormData?: Partial<ShippingAddress>;
}

export default function AddressModal({
    isOpen,
    onClose,
    onSave,
    editingAddress,
    defaultFormData,
}: AddressModalProps) {
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState<ShippingAddress>(() => {
        if (editingAddress) return editingAddress;
        return {
            fullName: defaultFormData?.fullName || '',
            phone: defaultFormData?.phone || '',
            email: defaultFormData?.email || '',
            houseNumber: '',
            address: '',
            landmark: '',
            city: '',
            state: '',
            postalCode: '',
            country: 'India',
        };
    });

    // Pincode auto-fill
    const handleAutoFill = useCallback((data: { city: string; state: string }) => {
        setFormData(prev => ({ ...prev, city: data.city, state: data.state }));
    }, []);

    const { lookupPincode, isLooking, pendingOverwrite, acceptOverwrite, rejectOverwrite } = usePincodeLookup(handleAutoFill);

    // Reset form data when modal opens or editingAddress changes
    useEffect(() => {
        if (isOpen) {
            if (editingAddress) {
                setFormData(editingAddress);
            } else {
                setFormData({
                    fullName: defaultFormData?.fullName || '',
                    phone: defaultFormData?.phone || '',
                    email: defaultFormData?.email || '',
                    houseNumber: '',
                    address: '',
                    landmark: '',
                    city: '',
                    state: '',
                    postalCode: '',
                    country: 'India',
                });
            }
            setError('');
        }
    }, [isOpen, editingAddress, defaultFormData]);

    const validateForm = (): string | null => {
        if (!formData.fullName.trim()) return 'Full name is required';
        if (!formData.phone.trim()) return 'Phone number is required';
        if (!/^[0-9]{10}$/.test(formData.phone)) {
            return 'Please enter a valid 10-digit mobile number';
        }
        if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
            return 'Valid email is required';
        }
        if (!formData.houseNumber.trim()) {
            return 'House/Apartment number is required';
        }
        if (!formData.address.trim()) return 'Address is required';
        if (!formData.city.trim()) return 'City is required';
        if (!formData.state.trim()) return 'State is required';
        if (!formData.postalCode.trim()) return 'Pincode is required';
        if (!/^[0-9]{6}$/.test(formData.postalCode)) {
            return 'Please enter a valid 6-digit pincode';
        }
        return null;
    };

    const handleSave = async () => {
        const validationError = validateForm();
        if (validationError) {
            setError(validationError);
            return;
        }

        setIsSaving(true);
        setError('');

        try {
            // Strip ALL metadata fields that backend doesn't accept
            // Backend rejects: userId, createdAt, updatedAt, deletedAt, id, isDefault
            const { id, isDefault, userId, createdAt, updatedAt, deletedAt, ...addressData } = formData as any;
            await onSave(addressData);
            onClose();
        } catch (err: any) {
            setError(err.message || 'Failed to save address');
        } finally {
            setIsSaving(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-black/60 z-[9999] overflow-y-auto py-8 sm:py-12 px-4"
            onClick={onClose}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="w-full sm:max-w-lg mx-auto rounded-2xl luxury-glass border border-white/10 bg-black/40 p-4 sm:p-6"
            >
                {/* Header */}
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                    <h2 className="text-lg sm:text-xl font-light text-white tracking-wide">
                        {editingAddress ? 'Edit' : 'Add'} Address
                    </h2>
                    <button
                        onClick={onClose}
                        className="w-9 h-9 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
                    >
                        <FiX className="w-5 h-5 text-white/60" />
                    </button>
                </div>

                {/* Form */}
                <div className="space-y-3 sm:space-y-4">
                    {/* Name & Phone */}
                    <div className="grid grid-cols-1 gap-3 sm:gap-4">
                        <div>
                            <label className="block text-[10px] sm:text-xs text-white/60 mb-1.5 sm:mb-2 uppercase tracking-wider">
                                Full Name *
                            </label>
                            <input
                                type="text"
                                value={formData.fullName}
                                onChange={(e) =>
                                    setFormData({ ...formData, fullName: e.target.value })
                                }
                                placeholder="John Doe"
                                maxLength={100}
                                className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:border-white/30 focus:outline-none transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] sm:text-xs text-white/60 mb-1.5 sm:mb-2 uppercase tracking-wider">
                                Phone Number *
                            </label>
                            <input
                                type="tel"
                                value={formData.phone}
                                onChange={(e) =>
                                    setFormData({ ...formData, phone: e.target.value })
                                }
                                placeholder="9876543210"
                                maxLength={10}
                                className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:border-white/30 focus:outline-none transition-all"
                            />
                        </div>
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-[10px] sm:text-xs text-white/60 mb-1.5 sm:mb-2 uppercase tracking-wider">
                            Email Address *
                        </label>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) =>
                                setFormData({ ...formData, email: e.target.value })
                            }
                            placeholder="john@example.com"
                            maxLength={100}
                            className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:border-white/30 focus:outline-none transition-all"
                        />
                    </div>

                    {/* House Number */}
                    <div>
                        <label className="block text-[10px] sm:text-xs text-white/60 mb-1.5 sm:mb-2 uppercase tracking-wider">
                            House/Apartment Number *
                        </label>
                        <input
                            type="text"
                            value={formData.houseNumber}
                            onChange={(e) =>
                                setFormData({ ...formData, houseNumber: e.target.value })
                            }
                            placeholder="123, Flat 4B"
                            maxLength={100}
                            className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:border-white/30 focus:outline-none transition-all"
                        />
                    </div>

                    {/* Address */}
                    <div>
                        <label className="block text-[10px] sm:text-xs text-white/60 mb-1.5 sm:mb-2 uppercase tracking-wider">
                            Address *
                        </label>
                        <input
                            type="text"
                            value={formData.address}
                            onChange={(e) =>
                                setFormData({ ...formData, address: e.target.value })
                            }
                            placeholder="Street name, Area"
                            maxLength={200}
                            className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:border-white/30 focus:outline-none transition-all"
                        />
                    </div>

                    {/* Landmark */}
                    <div>
                        <label className="block text-[10px] sm:text-xs text-white/60 mb-1.5 sm:mb-2 uppercase tracking-wider">
                            Landmark (Optional)
                        </label>
                        <input
                            type="text"
                            value={formData.landmark}
                            onChange={(e) =>
                                setFormData({ ...formData, landmark: e.target.value })
                            }
                            placeholder="Near Metro Station"
                            maxLength={100}
                            className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:border-white/30 focus:outline-none transition-all"
                        />
                    </div>

                    {/* City, State, Pincode */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                        <div>
                            <label className="block text-[10px] sm:text-xs text-white/60 mb-1.5 sm:mb-2 uppercase tracking-wider">
                                City *
                            </label>
                            <input
                                type="text"
                                value={formData.city}
                                onChange={(e) =>
                                    setFormData({ ...formData, city: e.target.value })
                                }
                                placeholder="Mumbai"
                                maxLength={50}
                                className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:border-white/30 focus:outline-none transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] sm:text-xs text-white/60 mb-1.5 sm:mb-2 uppercase tracking-wider">
                                State *
                            </label>
                            <input
                                type="text"
                                value={formData.state}
                                onChange={(e) =>
                                    setFormData({ ...formData, state: e.target.value })
                                }
                                placeholder="Maharashtra"
                                maxLength={50}
                                className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:border-white/30 focus:outline-none transition-all"
                            />
                        </div>
                        <div className="col-span-2 sm:col-span-1">
                            <label className="block text-[10px] sm:text-xs text-white/60 mb-1.5 sm:mb-2 uppercase tracking-wider">
                                Pincode *
                            </label>
                            <input
                                type="text"
                                value={formData.postalCode}
                                onChange={(e) => {
                                    const pincode = e.target.value.replace(/\D/g, '').slice(0, 6);
                                    setFormData({ ...formData, postalCode: pincode });
                                    if (pincode.length === 6) {
                                        lookupPincode(pincode, formData.city, formData.state);
                                    }
                                }}
                                placeholder="400001"
                                maxLength={6}
                                className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:border-white/30 focus:outline-none transition-all"
                            />
                            {isLooking && (
                                <p className="text-white/40 text-[10px] mt-1">Looking up pincode...</p>
                            )}
                        </div>
                    </div>

                    {/* Pincode Overwrite Confirmation */}
                    {pendingOverwrite && (
                        <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30">
                            <p className="text-amber-200 text-xs sm:text-sm mb-2">
                                Pincode suggests: <span className="font-medium">{pendingOverwrite.city}, {pendingOverwrite.state}</span>. Update city &amp; state?
                            </p>
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={acceptOverwrite}
                                    className="px-3 py-1 text-xs rounded bg-white/10 text-white hover:bg-white/20 transition-colors"
                                >
                                    Yes, update
                                </button>
                                <button
                                    type="button"
                                    onClick={rejectOverwrite}
                                    className="px-3 py-1 text-xs rounded bg-white/5 text-white/60 hover:bg-white/10 transition-colors"
                                >
                                    No, keep mine
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Country */}
                    <div>
                        <label className="block text-[10px] sm:text-xs text-white/60 mb-1.5 sm:mb-2 uppercase tracking-wider">
                            Country *
                        </label>
                        <input
                            type="text"
                            value={formData.country}
                            onChange={(e) =>
                                setFormData({ ...formData, country: e.target.value })
                            }
                            placeholder="India"
                            maxLength={50}
                            className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:border-white/30 focus:outline-none transition-all"
                        />
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-2 sm:gap-3 pt-2 sm:pt-4">
                        <button
                            onClick={onClose}
                            disabled={isSaving}
                            className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-all disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base rounded-lg bg-white text-black hover:bg-white/90 transition-all font-medium disabled:opacity-50"
                        >
                            {isSaving ? 'Saving...' : 'Save'}
                        </button>
                    </div>

                    {/* Error */}
                    {error && (
                        <p className="text-red-400 text-xs sm:text-sm mt-2">{error}</p>
                    )}
                </div>
            </div>
        </div>
    );
}
