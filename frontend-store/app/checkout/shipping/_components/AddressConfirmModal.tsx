/**
 * Address Confirmation Modal
 * Shows the selected address in full before proceeding to payment.
 * Forces user to visually verify their address to prevent typos.
 */

"use client";

import { motion, AnimatePresence } from "framer-motion";
import { FiMapPin, FiPhone, FiMail, FiAlertTriangle } from "react-icons/fi";

interface AddressData {
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
}

interface Props {
    isOpen: boolean;
    address: AddressData;
    onConfirm: () => void;
    onEdit: () => void;
}

export default function AddressConfirmModal({ isOpen, address, onConfirm, onEdit }: Props) {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                onClick={onEdit}
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="w-full max-w-md rounded-2xl luxury-glass border border-white/15 p-5 sm:p-6 shadow-2xl"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="flex items-center gap-3 mb-5">
                        <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center">
                            <FiAlertTriangle className="w-5 h-5 text-amber-400" />
                        </div>
                        <div>
                            <h3 className="text-white text-base font-semibold">Verify Your Address</h3>
                            <p className="text-white/50 text-xs">Please confirm before payment</p>
                        </div>
                    </div>

                    {/* Address Card */}
                    <div className="rounded-xl bg-white/5 border border-white/10 p-4 space-y-3 mb-5">
                        {/* Name */}
                        <div className="flex items-start gap-3">
                            <FiMapPin className="w-4 h-4 text-white/50 mt-0.5 flex-shrink-0" />
                            <div>
                                <p className="text-white font-medium text-sm">{address.fullName}</p>
                                <p className="text-white/80 text-sm mt-1 leading-relaxed">
                                    {address.houseNumber}, {address.address}
                                </p>
                                {address.landmark && (
                                    <p className="text-white/60 text-xs mt-0.5">
                                        Near: {address.landmark}
                                    </p>
                                )}
                                <p className="text-white/80 text-sm mt-0.5">
                                    {address.city}, {address.state} <span className="font-mono">{address.postalCode}</span>
                                </p>
                                <p className="text-white/60 text-xs mt-0.5">{address.country || 'India'}</p>
                            </div>
                        </div>

                        <div className="border-t border-white/10 pt-3 space-y-2">
                            <div className="flex items-center gap-3">
                                <FiPhone className="w-3.5 h-3.5 text-white/50 flex-shrink-0" />
                                <p className="text-white/70 text-sm font-mono">{address.phone}</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <FiMail className="w-3.5 h-3.5 text-white/50 flex-shrink-0" />
                                <p className="text-white/70 text-sm truncate">{address.email}</p>
                            </div>
                        </div>
                    </div>

                    {/* Warning */}
                    <p className="text-amber-400/80 text-[11px] text-center mb-4 leading-relaxed">
                        Address cannot be changed after payment. Please check carefully.
                    </p>

                    {/* Buttons */}
                    <div className="flex gap-3">
                        <button
                            onClick={onEdit}
                            className="
                                flex-1 px-4 py-2.5 rounded-xl
                                border border-white/15 text-white/70
                                hover:text-white hover:bg-white/5
                                transition-all text-sm
                            "
                        >
                            Edit Address
                        </button>
                        <button
                            onClick={onConfirm}
                            className="
                                flex-1 px-4 py-2.5 rounded-xl
                                bg-white text-black font-medium
                                hover:bg-white/90
                                transition-all text-sm
                            "
                        >
                            Confirm & Pay
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
