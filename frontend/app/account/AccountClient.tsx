"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiUser, FiPackage, FiMapPin, FiLogOut, FiChevronRight, FiClock, FiCheck, FiX } from "react-icons/fi";
import Image from "next/image";
import { CustomerSession } from "@/app/lib/customer-session";

interface Order {
    node: {
        id: string;
        name: string;
        orderNumber: number;
        processedAt: string;
        financialStatus: string;
        fulfillmentStatus: string;
        totalPrice: {
            amount: string;
            currencyCode: string;
        };
        lineItems: {
            edges: Array<{
                node: {
                    title: string;
                    quantity: number;
                    price: {
                        amount: string;
                        currencyCode: string;
                    };
                    image: {
                        url: string;
                        altText: string;
                    };
                };
            }>;
        };
    };
}

interface Customer {
    id: string;
    emailAddress: {
        emailAddress: string;
    };
    firstName: string;
    lastName: string;
    phoneNumber?: {
        phoneNumber: string;
    };
    defaultAddress?: {
        address1: string;
        address2?: string;
        city: string;
        province: string;
        country: string;
        zip: string;
    };
}

interface AccountClientProps {
    customer: Customer;
    orders: Order[];
    session: CustomerSession;
}

export default function AccountClient({ customer, orders, session }: AccountClientProps) {
    const [activeTab, setActiveTab] = useState<"orders" | "profile">("orders");
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const handleLogout = async () => {
        setIsLoggingOut(true);
        try {
            const response = await fetch('/api/auth/logout', { method: 'POST' });
            const data = await response.json();

            if (data.logoutUrl) {
                window.location.href = data.logoutUrl;
            } else {
                window.location.href = '/';
            }
        } catch (error) {
            console.error('Logout failed:', error);
            setIsLoggingOut(false);
        }
    };

    const getStatusColor = (status: string) => {
        const statusLower = status.toLowerCase();
        if (statusLower.includes('paid') || statusLower.includes('fulfilled')) return 'text-green-400';
        if (statusLower.includes('pending')) return 'text-yellow-400';
        if (statusLower.includes('cancelled') || statusLower.includes('refunded')) return 'text-red-400';
        return 'text-white/60';
    };

    const getStatusIcon = (status: string) => {
        const statusLower = status.toLowerCase();
        if (statusLower.includes('paid') || statusLower.includes('fulfilled')) return <FiCheck className="w-4 h-4" />;
        if (statusLower.includes('pending')) return <FiClock className="w-4 h-4" />;
        if (statusLower.includes('cancelled') || statusLower.includes('refunded')) return <FiX className="w-4 h-4" />;
        return null;
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const formatPrice = (amount: string, currencyCode: string) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: currencyCode,
        }).format(parseFloat(amount));
    };

    return (
        <div className="min-h-screen bg-[#060010] text-white">
            {/* Header */}
            <div className="border-b border-white/10 bg-black/20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold">
                                Welcome back, {customer.firstName || 'Customer'}!
                            </h1>
                            <p className="text-white/60 mt-1">{customer.emailAddress.emailAddress}</p>
                        </div>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleLogout}
                            disabled={isLoggingOut}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-all disabled:opacity-50"
                        >
                            <FiLogOut className="w-4 h-4" />
                            <span className="text-sm font-medium">
                                {isLoggingOut ? 'Logging out...' : 'Logout'}
                            </span>
                        </motion.button>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-white/10 bg-black/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex gap-8">
                        <button
                            onClick={() => setActiveTab("orders")}
                            className={`flex items-center gap-2 py-4 border-b-2 transition-all ${activeTab === "orders"
                                    ? "border-white text-white"
                                    : "border-transparent text-white/40 hover:text-white/60"
                                }`}
                        >
                            <FiPackage className="w-5 h-5" />
                            <span className="font-medium">Order History</span>
                        </button>
                        <button
                            onClick={() => setActiveTab("profile")}
                            className={`flex items-center gap-2 py-4 border-b-2 transition-all ${activeTab === "profile"
                                    ? "border-white text-white"
                                    : "border-transparent text-white/40 hover:text-white/60"
                                }`}
                        >
                            <FiUser className="w-5 h-5" />
                            <span className="font-medium">Profile</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <AnimatePresence mode="wait">
                    {activeTab === "orders" ? (
                        <motion.div
                            key="orders"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            <h2 className="text-2xl font-bold mb-6">Your Orders</h2>

                            {orders.length === 0 ? (
                                <div className="text-center py-16">
                                    <FiPackage className="w-16 h-16 mx-auto text-white/20 mb-4" />
                                    <p className="text-white/60 text-lg">No orders yet</p>
                                    <p className="text-white/40 text-sm mt-2">Start shopping to see your orders here</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {orders.map((order) => (
                                        <motion.div
                                            key={order.node.id}
                                            whileHover={{ scale: 1.01 }}
                                            className="bg-black/40 border border-white/10 rounded-xl p-6 hover:border-white/20 transition-all"
                                        >
                                            <div className="flex items-start justify-between mb-4">
                                                <div>
                                                    <h3 className="text-lg font-bold">{order.node.name}</h3>
                                                    <p className="text-white/60 text-sm mt-1">
                                                        Placed on {formatDate(order.node.processedAt)}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-xl font-bold">
                                                        {formatPrice(order.node.totalPrice.amount, order.node.totalPrice.currencyCode)}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Status */}
                                            <div className="flex gap-4 mb-4">
                                                <div className="flex items-center gap-2">
                                                    {getStatusIcon(order.node.financialStatus)}
                                                    <span className={`text-sm font-medium ${getStatusColor(order.node.financialStatus)}`}>
                                                        {order.node.financialStatus.replace('_', ' ')}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    {getStatusIcon(order.node.fulfillmentStatus || 'pending')}
                                                    <span className={`text-sm font-medium ${getStatusColor(order.node.fulfillmentStatus || 'pending')}`}>
                                                        {(order.node.fulfillmentStatus || 'Pending').replace('_', ' ')}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Line Items */}
                                            <div className="space-y-3 border-t border-white/10 pt-4">
                                                {order.node.lineItems.edges.slice(0, 3).map((item, idx) => (
                                                    <div key={idx} className="flex items-center gap-4">
                                                        {item.node.image && (
                                                            <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-white/5">
                                                                <Image
                                                                    src={item.node.image.url}
                                                                    alt={item.node.image.altText || item.node.title}
                                                                    fill
                                                                    className="object-cover"
                                                                />
                                                            </div>
                                                        )}
                                                        <div className="flex-1">
                                                            <p className="font-medium">{item.node.title}</p>
                                                            <p className="text-white/60 text-sm">Qty: {item.node.quantity}</p>
                                                        </div>
                                                        <p className="font-medium">
                                                            {formatPrice(item.node.price.amount, item.node.price.currencyCode)}
                                                        </p>
                                                    </div>
                                                ))}
                                                {order.node.lineItems.edges.length > 3 && (
                                                    <p className="text-white/60 text-sm">
                                                        +{order.node.lineItems.edges.length - 3} more items
                                                    </p>
                                                )}
                                            </div>

                                            <div className="flex justify-end mt-4">
                                                <button className="flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors">
                                                    View Details
                                                    <FiChevronRight className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    ) : (
                        <motion.div
                            key="profile"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            <h2 className="text-2xl font-bold mb-6">Profile Information</h2>

                            <div className="grid md:grid-cols-2 gap-6">
                                {/* Personal Info */}
                                <div className="bg-black/40 border border-white/10 rounded-xl p-6">
                                    <div className="flex items-center gap-3 mb-4">
                                        <FiUser className="w-5 h-5 text-white/60" />
                                        <h3 className="text-lg font-bold">Personal Information</h3>
                                    </div>
                                    <div className="space-y-3">
                                        <div>
                                            <p className="text-white/60 text-sm">Name</p>
                                            <p className="font-medium">{customer.firstName} {customer.lastName}</p>
                                        </div>
                                        <div>
                                            <p className="text-white/60 text-sm">Email</p>
                                            <p className="font-medium">{customer.emailAddress.emailAddress}</p>
                                        </div>
                                        {customer.phoneNumber && (
                                            <div>
                                                <p className="text-white/60 text-sm">Phone</p>
                                                <p className="font-medium">{customer.phoneNumber.phoneNumber}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Address */}
                                <div className="bg-black/40 border border-white/10 rounded-xl p-6">
                                    <div className="flex items-center gap-3 mb-4">
                                        <FiMapPin className="w-5 h-5 text-white/60" />
                                        <h3 className="text-lg font-bold">Default Address</h3>
                                    </div>
                                    {customer.defaultAddress ? (
                                        <div className="space-y-1">
                                            <p className="font-medium">{customer.defaultAddress.address1}</p>
                                            {customer.defaultAddress.address2 && (
                                                <p className="text-white/80">{customer.defaultAddress.address2}</p>
                                            )}
                                            <p className="text-white/80">
                                                {customer.defaultAddress.city}, {customer.defaultAddress.province} {customer.defaultAddress.zip}
                                            </p>
                                            <p className="text-white/80">{customer.defaultAddress.country}</p>
                                        </div>
                                    ) : (
                                        <p className="text-white/60">No default address set</p>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
