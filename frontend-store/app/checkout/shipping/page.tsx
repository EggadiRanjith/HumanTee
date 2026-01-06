"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { useCart } from "@/app/contexts/CartContext";
import { useCheckout } from "@/app/contexts/CheckoutContext";
import { useLoading } from "@/app/contexts/LoadingContext";
import { useAuth } from "@/app/contexts/AuthContext";
import { CheckoutProgress, OrderSummaryCheckout } from "@/app/components/ui/checkout";
import { GradientOverlay } from "@/app/components/ui/layout";
import { useShippingData } from "./_hooks/useShippingData";
import AddressSelector from "./_components/AddressSelector";
import ShippingActions from "./_components/ShippingActions";

// Lazy-load modal (Phase 1.1 - Runtime optimization)
const AddressModal = dynamic(() => import("./_components/AddressModal"), { ssr: false });

export default function ShippingPage() {
    const router = useRouter();
    const { items, totalPrice } = useCart();
    const { setShippingData } = useCheckout();
    const { setLoading } = useLoading();
    const { user, isAuthenticated, isLoading: authLoading } = useAuth();

    const {
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
    } = useShippingData(user?.id);

    // Optional redirect to login has been removed for guest checkout support

    const handleContinueToPayment = () => {
        const selectedAddress = addresses.find(
            (addr) => addr.id === selectedAddressId
        );
        if (!selectedAddress) {
            alert('Please select a shipping address');
            return;
        }

        // Populate shipping data
        setShippingData({
            fullName: selectedAddress.fullName,
            email: selectedAddress.email,
            phone: selectedAddress.phone,
            address: `${selectedAddress.houseNumber}, ${selectedAddress.address}${selectedAddress.landmark ? `, ${selectedAddress.landmark}` : ''
                }`,
            city: selectedAddress.city,
            state: selectedAddress.state,
            postalCode: selectedAddress.postalCode,
            country: selectedAddress.country,
        });

        setLoading(true);
        router.push("/checkout/payment");
    };

    const handleBackToCart = () => {
        setLoading(true);
        router.push("/cart");
    };

    // Empty cart state
    if (items.length === 0) {
        return (
            <div className="min-h-screen brand-bg pt-[var(--header-height)] flex items-center justify-center px-4">
                <div className="text-center max-w-md w-full">
                    <p className="text-white/60 text-base sm:text-lg mb-4">
                        Your cart is empty
                    </p>
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
                <div className="py-6 sm:py-8 md:py-10 lg:py-12">
                    <CheckoutProgress currentStep={1} />

                    <h1 className="text-white text-sm sm:text-base md:text-lg lg:text-xl font-light mb-4 sm:mb-5 uppercase tracking-wide text-center sm:text-left">
                        Select Shipping Address
                    </h1>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
                        {/* Address Selection - CRITICAL RENDER */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="lg:col-span-2 space-y-3 sm:space-y-4 md:space-y-5">
                            <div className="p-3 sm:p-4 md:p-5 lg:p-7 rounded-lg sm:rounded-xl luxury-glass border border-white/10">
                                <AddressSelector
                                    addresses={addresses}
                                    selectedAddressId={selectedAddressId}
                                    onSelectAddress={setSelectedAddressId}
                                    onAddNewAddress={openAddressModal}
                                    isLoading={isLoadingAddresses}
                                />

                                <ShippingActions
                                    selectedAddressId={selectedAddressId}
                                    onContinue={handleContinueToPayment}
                                    onAddAddress={openAddressModal}
                                    onBackToCart={handleBackToCart}
                                />
                            </div>
                        </motion.div>

                        {/* Order Summary - DEFER */}
                        <OrderSummaryCheckout
                            items={items}
                            pincode={
                                addresses.find((addr) => addr.id === selectedAddressId)
                                    ?.postalCode
                            }
                        />
                    </div>
                </div>
            </div>

            {/* Address Modal */}
            {showAddressModal && (
                <AddressModal
                    isOpen={showAddressModal}
                    onClose={closeAddressModal}
                    onSave={async (data) => {
                        // Pass data directly to saveAddress to avoid async state issues
                        await saveAddress(data);
                    }}
                    editingAddress={null}
                    defaultFormData={{
                        fullName: (user as any)?.fullName || '',
                        phone: (user as any)?.phone || '',
                        email: user?.email || '',
                    }}
                />
            )}
        </div>
    );
}
