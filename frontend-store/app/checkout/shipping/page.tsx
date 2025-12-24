"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/app/components/context/CartContext";
import { useCheckout } from "@/app/components/context/CheckoutContext";
import { useLoading } from "@/app/components/context/LoadingContext";
import { useAuth } from "@/app/context/AuthContext";
import { CheckoutProgress, OrderSummaryCheckout } from "@/app/components/ui/checkout";
import { GradientOverlay } from "@/app/components/ui/layout";
import { motion } from "framer-motion";
import { FiPlus, FiX, FiStar, FiCheck } from "react-icons/fi";
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

export default function ShippingPage() {
    const router = useRouter();
    const { items, totalPrice } = useCart();
    const { setShippingData } = useCheckout();
    const { setLoading } = useLoading();
    const { user, isAuthenticated, isLoading: authLoading } = useAuth();

    const [addresses, setAddresses] = useState<ShippingAddress[]>([]);
    const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
    const [isLoadingAddresses, setIsLoadingAddresses] = useState(true);
    const [showAddressModal, setShowAddressModal] = useState(false);
    const [addressForm, setAddressForm] = useState({
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

    // Redirect to login if not authenticated
    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            router.push('/login');
        }
    }, [authLoading, isAuthenticated, router]);

    // Fetch addresses on mount
    useEffect(() => {
        const fetchAddresses = async () => {
            if (!user) return;

            setIsLoadingAddresses(true);
            try {
                const response = await apiClient.get('/shipping-addresses');
                if (response.data && response.data.length > 0) {
                    setAddresses(response.data);
                    // Auto-select default address
                    const defaultAddr = response.data.find((addr: ShippingAddress) => addr.isDefault);
                    if (defaultAddr) {
                        setSelectedAddressId(defaultAddr.id);
                    } else {
                        setSelectedAddressId(response.data[0].id);
                    }
                }
            } catch (error) {
                console.error('Failed to load addresses:', error);
            } finally {
                setIsLoadingAddresses(false);
            }
        };

        if (user) {
            fetchAddresses();
        }
    }, [user]);

    const handleOpenAddressModal = () => {
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

    const handleSaveAddress = async () => {
        // Validation
        if (!addressForm.fullName.trim()) {
            setAddressError('Full name is required');
            return;
        }
        if (!/^[0-9]{10}$/.test(addressForm.phone)) {
            setAddressError('Please enter a valid 10-digit mobile number');
            return;
        }
        if (!addressForm.email.trim() || !/\S+@\S+\.\S+/.test(addressForm.email)) {
            setAddressError('Valid email is required');
            return;
        }
        if (!addressForm.houseNumber.trim() || !addressForm.address.trim() ||
            !addressForm.city.trim() || !addressForm.state.trim()) {
            setAddressError('All address fields are required');
            return;
        }
        if (!/^[0-9]{6}$/.test(addressForm.postalCode)) {
            setAddressError('Please enter a valid 6-digit pincode');
            return;
        }

        setIsSavingAddress(true);
        setAddressError('');

        try {
            const response = await apiClient.post('/shipping-addresses', {
                ...addressForm,
                isDefault: addresses.length === 0,
            });
            setAddresses(prev => [...prev, response.data]);
            setSelectedAddressId(response.data.id);
            setShowAddressModal(false);
        } catch (error: any) {
            setAddressError(error.response?.data?.message || 'Failed to save address');
        } finally {
            setIsSavingAddress(false);
        }
    };

    const handleContinueToPayment = () => {
        const selectedAddress = addresses.find(addr => addr.id === selectedAddressId);
        if (!selectedAddress) {
            alert('Please select a shipping address');
            return;
        }

        // Populate shipping data
        setShippingData({
            fullName: selectedAddress.fullName,
            email: selectedAddress.email,
            phone: selectedAddress.phone,
            address: `${selectedAddress.houseNumber}, ${selectedAddress.address}${selectedAddress.landmark ? `, ${selectedAddress.landmark}` : ''}`,
            city: selectedAddress.city,
            state: selectedAddress.state,
            postalCode: selectedAddress.postalCode,
            country: selectedAddress.country,
        });

        setLoading(true);
        router.push("/checkout/payment");
    };

    if (items.length === 0) {
        return (
            <div className="min-h-screen brand-bg pt-[var(--header-height)] flex items-center justify-center px-4">
                <div className="text-center max-w-md w-full">
                    <p className="text-white/60 text-base sm:text-lg mb-4">Your cart is empty</p>
                    <button
                        onClick={() => router.push("/shop")}
                        className="w-full sm:w-auto px-6 py-3 bg-white text-black rounded-full text-sm uppercase tracking-wider hover:bg-white/90 transition-colors min-h-[44px]"
                    >
                        Continue Shopping
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen brand-bg pt-[var(--header-height)] pb-8 sm:pb-16">
            <GradientOverlay variant="violet" />

            <div className="relative max-w-screen-xl mx-auto px-3 sm:px-6 md:px-8 lg:px-10">
                <div className="py-8 sm:py-10 md:py-12">
                    <CheckoutProgress currentStep={1} />

                    <h1 className="text-white text-base sm:text-lg md:text-xl lg:text-2xl font-light mb-3 sm:mb-5 uppercase tracking-wide text-center sm:text-left">Select Shipping Address</h1>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                        {/* Address Selection */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="lg:col-span-2 space-y-3 sm:space-y-5"
                        >
                            <div className="p-3 sm:p-5 md:p-7 rounded-lg sm:rounded-xl luxury-glass border border-white/10">
                                {isLoadingAddresses ? (
                                    <div className="text-center py-12">
                                        <div className="w-10 h-10 border-2 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-3"></div>
                                        <p className="text-white/60 text-sm">Loading addresses...</p>
                                    </div>
                                ) : addresses.length > 0 ? (
                                    <div className="space-y-3">
                                        {addresses.map((addr) => (
                                            <div
                                                key={addr.id}
                                                onClick={() => setSelectedAddressId(addr.id)}
                                                className={`p-4 rounded-lg cursor-pointer transition-all ${selectedAddressId === addr.id
                                                    ? 'border-2 border-white bg-white/5'
                                                    : 'border border-white/10 hover:border-white/30'
                                                    }`}
                                            >
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <p className="text-base font-medium text-white">{addr.fullName}</p>
                                                            {addr.isDefault && (
                                                                <span className="px-2 py-0.5 text-[10px] bg-white/10 text-white rounded-full flex items-center gap-1">
                                                                    <FiStar className="w-3 h-3" /> Default
                                                                </span>
                                                            )}
                                                        </div>
                                                        <p className="text-sm text-white/70">{addr.phone} • {addr.email}</p>
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
                                ) : (
                                    <div className="text-center py-12">
                                        <p className="text-white/60 text-sm mb-4">No saved addresses</p>
                                    </div>
                                )}

                                {/* Add Address Button */}
                                <button
                                    onClick={handleOpenAddressModal}
                                    className="w-full mt-4 py-3 rounded-lg border-2 border-dashed border-white/20 hover:border-white/40 flex items-center justify-center gap-2 text-white/60 hover:text-white transition-all"
                                >
                                    <FiPlus className="w-5 h-5" />
                                    <span className="text-sm uppercase tracking-wider">Add New Address</span>
                                </button>
                            </div>

                            {/* Continue Button */}
                            <motion.button
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.99 }}
                                onClick={handleContinueToPayment}
                                disabled={!selectedAddressId}
                                className="w-full py-3.5 sm:py-4 bg-white text-black rounded-full text-sm sm:text-base uppercase tracking-wider font-medium hover:bg-white/90 transition-colors min-h-[48px] sm:min-h-[52px] disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Continue to Payment
                            </motion.button>

                            <div className="mt-4 text-center">
                                <button
                                    onClick={() => {
                                        setLoading(true);
                                        router.push("/cart");
                                    }}
                                    className="text-white/40 hover:text-white text-xs uppercase tracking-wider transition-colors"
                                >
                                    Back to Cart
                                </button>
                            </div>
                        </motion.div>

                        {/* Order Summary */}
                        <OrderSummaryCheckout
                            items={items}
                            totalPrice={totalPrice}
                            pincode={addresses.find(addr => addr.id === selectedAddressId)?.postalCode}
                        />
                    </div>
                </div>
            </div>

            {/* Add Address Modal - Same as account page */}
            {showAddressModal && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-md z-[9999] overflow-y-auto py-8 sm:py-12 px-4"
                    onClick={() => setShowAddressModal(false)}
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="w-full sm:max-w-lg mx-auto rounded-2xl luxury-glass border border-white/10 bg-black/40 backdrop-blur-2xl p-4 sm:p-6"
                    >
                        <div className="flex items-center justify-between mb-4 sm:mb-6">
                            <h2 className="text-lg sm:text-xl font-light text-white tracking-wide">
                                Add Shipping Address
                            </h2>
                            <button
                                onClick={() => setShowAddressModal(false)}
                                className="w-9 h-9 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
                            >
                                <FiX className="w-5 h-5 text-white/60" />
                            </button>
                        </div>

                        <div className="space-y-3 sm:space-y-4">
                            {/* Form fields - same as account page */}
                            <div className="grid grid-cols-1 gap-3 sm:gap-4">
                                <input
                                    type="text"
                                    value={addressForm.fullName}
                                    onChange={(e) => setAddressForm({ ...addressForm, fullName: e.target.value })}
                                    placeholder="Full Name"
                                    required
                                    className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:border-white/30 focus:outline-none transition-all"
                                />
                                <input
                                    type="tel"
                                    value={addressForm.phone}
                                    onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                                    placeholder="Phone (10 digits)"
                                    required
                                    pattern="[0-9]{10}"
                                    maxLength={10}
                                    className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:border-white/30 focus:outline-none transition-all"
                                />
                            </div>

                            <input
                                type="email"
                                value={addressForm.email}
                                onChange={(e) => setAddressForm({ ...addressForm, email: e.target.value })}
                                placeholder="Email"
                                required
                                className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:border-white/30 focus:outline-none transition-all"
                            />

                            <input
                                type="text"
                                value={addressForm.houseNumber}
                                onChange={(e) => setAddressForm({ ...addressForm, houseNumber: e.target.value })}
                                placeholder="House/Apartment Number"
                                required
                                className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:border-white/30 focus:outline-none transition-all"
                            />

                            <input
                                type="text"
                                value={addressForm.address}
                                onChange={(e) => setAddressForm({ ...addressForm, address: e.target.value })}
                                placeholder="Street Address"
                                required
                                className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:border-white/30 focus:outline-none transition-all"
                            />

                            <input
                                type="text"
                                value={addressForm.landmark}
                                onChange={(e) => setAddressForm({ ...addressForm, landmark: e.target.value })}
                                placeholder="Landmark (Optional)"
                                className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:border-white/30 focus:outline-none transition-all"
                            />

                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                                <input
                                    type="text"
                                    value={addressForm.city}
                                    onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                                    placeholder="City"
                                    required
                                    className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:border-white/30 focus:outline-none transition-all"
                                />
                                <input
                                    type="text"
                                    value={addressForm.state}
                                    onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                                    placeholder="State"
                                    required
                                    className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:border-white/30 focus:outline-none transition-all"
                                />
                                <input
                                    type="text"
                                    value={addressForm.postalCode}
                                    onChange={(e) => setAddressForm({ ...addressForm, postalCode: e.target.value.replace(/\D/g, '').slice(0, 6) })}
                                    placeholder="Pincode"
                                    required
                                    pattern="[0-9]{6}"
                                    maxLength={6}
                                    className="col-span-2 sm:col-span-1 w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:border-white/30 focus:outline-none transition-all"
                                />
                            </div>

                            <input
                                type="text"
                                value={addressForm.country}
                                onChange={(e) => setAddressForm({ ...addressForm, country: e.target.value })}
                                placeholder="Country"
                                required
                                className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:border-white/30 focus:outline-none transition-all"
                            />

                            <div className="flex gap-2 sm:gap-3 pt-2 sm:pt-4">
                                <button
                                    onClick={() => setShowAddressModal(false)}
                                    disabled={isSavingAddress}
                                    className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-all disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSaveAddress}
                                    disabled={isSavingAddress}
                                    className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base rounded-lg bg-white text-black hover:bg-white/90 transition-all font-medium disabled:opacity-50"
                                >
                                    {isSavingAddress ? 'Saving...' : 'Save'}
                                </button>
                            </div>

                            {addressError && (
                                <p className="text-red-400 text-xs sm:text-sm mt-2">{addressError}</p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
