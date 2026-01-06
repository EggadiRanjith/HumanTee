"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface ShippingData {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
}

export type PaymentMethod = "razorpay";

interface CheckoutContextType {
    shippingData: ShippingData;
    setShippingData: (data: ShippingData) => void;
    paymentMethod: PaymentMethod;
    setPaymentMethod: (method: PaymentMethod) => void;
    orderNumber: string;
    setOrderNumber: (orderNum: string) => void;
    clearCheckoutData: () => void;
}

const CheckoutContext = createContext<CheckoutContextType | undefined>(undefined);

const initialShippingData: ShippingData = {
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India",
};

export function CheckoutProvider({ children }: { children: ReactNode }) {
    // Load from sessionStorage on mount
    const [shippingData, setShippingData] = useState<ShippingData>(() => {
        if (typeof window === 'undefined') return initialShippingData;

        const saved = sessionStorage.getItem('checkout-shipping');
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch {
                return initialShippingData;
            }
        }
        return initialShippingData;
    });

    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(() => {
        if (typeof window === 'undefined') return "razorpay";

        const saved = sessionStorage.getItem('checkout-payment-method');
        return (saved as PaymentMethod) || "razorpay";
    });

    const [orderNumber, setOrderNumber] = useState("");

    // Persist shipping data to sessionStorage
    useEffect(() => {
        if (typeof window !== 'undefined') {
            sessionStorage.setItem('checkout-shipping', JSON.stringify(shippingData));
        }
    }, [shippingData]);

    // Persist payment method to sessionStorage
    useEffect(() => {
        if (typeof window !== 'undefined') {
            sessionStorage.setItem('checkout-payment-method', paymentMethod);
        }
    }, [paymentMethod]);

    const clearCheckoutData = () => {
        setShippingData(initialShippingData);
        setPaymentMethod("razorpay");
        setOrderNumber("");

        // Clear from sessionStorage
        if (typeof window !== 'undefined') {
            sessionStorage.removeItem('checkout-shipping');
            sessionStorage.removeItem('checkout-payment-method');
        }
    };

    return (
        <CheckoutContext.Provider
            value={{
                shippingData,
                setShippingData,
                paymentMethod,
                setPaymentMethod,
                orderNumber,
                setOrderNumber,
                clearCheckoutData,
            }}
        >
            {children}
        </CheckoutContext.Provider>
    );
}

export function useCheckout() {
    const context = useContext(CheckoutContext);
    if (context === undefined) {
        throw new Error("useCheckout must be used within a CheckoutProvider");
    }
    return context;
}
