"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

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

export type PaymentMethod = "card" | "upi" | "cod";

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
    const [shippingData, setShippingData] = useState<ShippingData>(initialShippingData);
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");
    const [orderNumber, setOrderNumber] = useState("");

    const clearCheckoutData = () => {
        setShippingData(initialShippingData);
        setPaymentMethod("card");
        setOrderNumber("");
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
