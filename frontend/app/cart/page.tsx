"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiTrash2, FiMinus, FiPlus } from "react-icons/fi";
import { useCart } from "@/app/components/context/CartContext";
import { useLoading } from "@/app/components/context/LoadingContext";
import { motion } from "framer-motion";
import { EmptyCart } from "@/app/components/ui/EmptyState";

export default function CartPage() {
    const router = useRouter();
    const { items, removeFromCart, updateQuantity, totalPrice, totalItems } = useCart();
    const { setLoading } = useLoading();

    if (items.length === 0) {
        return (
            <div className="min-h-screen brand-bg pb-24 pt-[var(--header-height)]">
                <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-10">
                    <EmptyCart />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen brand-bg pb-24 pt-[var(--header-height)]">
            <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-10 pt-12">

                {/* PAGE TITLE */}
                <div className="mb-10">
                    <h1 className="text-[26px] sm:text-[34px] lg:text-[42px] font-light uppercase tracking-[0.14em] text-white">
                        Shopping Cart
                    </h1>
                    <p className="text-white/45 text-[11px] uppercase tracking-[0.22em] mt-2">
                        {totalItems} {totalItems === 1 ? "item" : "items"} in your cart
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* CART ITEMS */}
                    <div className="lg:col-span-2 space-y-4">
                        {items.map((item, index) => (
                            <motion.div
                                key={`${item.id}-${item.size}`}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: index * 0.05 }}
                                className="
                  p-4 sm:p-6 rounded-2xl luxury-glass
                  border border-white/10 bg-white/5 backdrop-blur-xl
                  flex gap-4 sm:gap-6
                "
                            >
                                {/* IMAGE */}
                                <div className="relative w-24 h-28 sm:w-28 sm:h-32 rounded-lg overflow-hidden border border-white/10 flex-shrink-0">
                                    <Image
                                        src={item.image}
                                        alt={item.title}
                                        fill
                                        className="object-cover"
                                    />
                                </div>

                                {/* DETAILS */}
                                <div className="flex-1 flex flex-col justify-between">
                                    <div>
                                        <Link href={`/product/${item.id}`}>
                                            <h3 className="text-white text-base sm:text-lg font-light tracking-wide hover:text-brand-secondary transition-colors">
                                                {item.title}
                                            </h3>
                                        </Link>
                                        <p className="text-white/60 text-xs sm:text-sm mt-1">
                                            {item.subtitle}
                                        </p>
                                        {item.size && (
                                            <p className="text-white/50 text-xs mt-1">
                                                Size: <span className="text-white/70">{item.size}</span>
                                            </p>
                                        )}
                                    </div>

                                    <div className="flex flex-wrap items-center justify-start mt-4 gap-6 sm:gap-10">
                                        {/* QUANTITY CONTROLS */}
                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                className="
                          w-8 h-8 rounded-lg luxury-glass border border-white/10
                          text-white/70 hover:text-white hover:bg-white/10
                          transition-colors flex items-center justify-center
                        "
                                            >
                                                <FiMinus size={14} />
                                            </button>

                                            <span className="text-white text-sm font-light min-w-[2rem] text-center">
                                                {item.quantity}
                                            </span>

                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                className="
                          w-8 h-8 rounded-lg luxury-glass border border-white/10
                          text-white/70 hover:text-white hover:bg-white/10
                          transition-colors flex items-center justify-center
                        "
                                            >
                                                <FiPlus size={14} />
                                            </button>
                                        </div>

                                        {/* PRICE BLOCK - Adjusted to show Line Total left aligned next to quantity */}
                                        <div className="flex items-center gap-3 text-left">
                                            <p className="text-white text-base sm:text-lg font-light">
                                                ₹ {(parseFloat(item.price.replace(/[^0-9.]/g, "")) * item.quantity).toFixed(2)}
                                            </p>
                                            {item.quantity > 1 && (
                                                <p className="text-yellow-400/80 text-xs sm:text-sm font-light">
                                                    ({item.price} each)
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* REMOVE BUTTON */}
                                <button
                                    onClick={() => removeFromCart(item.id)}
                                    className="
                    self-start p-2 rounded-lg
                    text-white/40 hover:text-red-400 hover:bg-red-500/10
                    transition-colors
                  "
                                >
                                    <FiTrash2 size={18} />
                                </button>
                            </motion.div>
                        ))}
                    </div>

                    {/* ORDER SUMMARY */}
                    <div className="lg:col-span-1">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="
                p-6 rounded-2xl luxury-glass
                border border-white/10 bg-white/5 backdrop-blur-xl
                sticky top-24
              "
                        >
                            <h2 className="text-white text-lg font-light uppercase tracking-wide mb-6">
                                Order Summary
                            </h2>

                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between text-sm">
                                    <span className="text-white/60">Subtotal</span>
                                    <span className="text-white">₹{totalPrice.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-white/60">Shipping</span>
                                    <span className="text-white">Free</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-white/60">Tax</span>
                                    <span className="text-white">Calculated at checkout</span>
                                </div>
                            </div>

                            <div className="h-px bg-white/10 mb-6" />

                            <div className="flex justify-between mb-6">
                                <span className="text-white text-lg font-light">Total</span>
                                <span className="text-white text-xl font-light">₹{totalPrice.toFixed(2)}</span>
                            </div>

                            <button
                                onClick={() => {
                                    setLoading(true);
                                    router.push("/checkout");
                                }}
                                className="
                  w-full py-4 rounded-full
                  bg-white text-black
                  text-xs uppercase tracking-[0.18em] font-medium
                  hover:bg-white/90 transition-colors
                  mb-3
                "
                            >
                                Proceed to Checkout
                            </button>

                            <Link
                                href="/shop"
                                className="
                  block w-full py-3 rounded-full text-center
                  border border-white/10 luxury-glass
                  text-white/70 text-xs uppercase tracking-[0.18em]
                  hover:text-white hover:bg-white/5 transition-colors
                "
                            >
                                Continue Shopping
                            </Link>
                        </motion.div>
                    </div>

                </div>
            </div>
        </div>
    );
}
