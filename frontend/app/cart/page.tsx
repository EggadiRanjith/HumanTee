"use client";

import { useRouter } from "next/navigation";
import { useCart } from "@/app/components/context/CartContext";
import { useLoading } from "@/app/components/context/LoadingContext";
import { CartItem, CartSummary } from "@/app/components/ui/cart";
import { GradientOverlay } from "@/app/components/ui/layout";
import { EmptyCart } from "@/app/components/ui/EmptyState";

export default function CartPage() {
    const router = useRouter();
    const { items, removeFromCart, updateQuantity, totalPrice, totalItems } = useCart();
    const { setLoading } = useLoading();

    const handleCheckout = () => {
        setLoading(true);
        router.push("/checkout");
    };

    if (items.length === 0) {
        return (
            <div className="min-h-screen brand-bg pb-24 pt-[var(--header-height)]">
                <GradientOverlay variant="violet" />
                <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-10">
                    <EmptyCart />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen brand-bg pb-24 pt-[var(--header-height)]">
            <GradientOverlay variant="violet" />

            <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-10 pt-12">

                {/* Page Header */}
                <div className="mb-10">
                    <h1 className="text-[26px] sm:text-[34px] lg:text-[42px] font-light uppercase tracking-[0.14em] text-white">
                        Shopping Cart
                    </h1>
                    <p className="text-white/45 text-[11px] uppercase tracking-[0.22em] mt-2">
                        {totalItems} {totalItems === 1 ? "item" : "items"} in your cart
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-4">
                        {items.map((item, index) => (
                            <CartItem
                                key={`${item.id}-${item.size}`}
                                item={item}
                                index={index}
                                onUpdateQuantity={updateQuantity}
                                onRemove={removeFromCart}
                            />
                        ))}
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <CartSummary
                            subtotal={totalPrice}
                            totalItems={totalItems}
                            onCheckout={handleCheckout}
                        />
                    </div>

                </div>
            </div>
        </div>
    );
}
