import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/app/contexts/CartContext";
import { useCheckout, type PaymentMethod } from "@/app/contexts/CheckoutContext";
import { useLoading } from "@/app/contexts/LoadingContext";
import apiClient from "@/lib/api-client";
import * as Sentry from '@sentry/nextjs';

// Extend Window interface for Razorpay
declare global {
    interface Window {
        Razorpay: any;
    }
}

export function usePaymentFlow() {
    const router = useRouter();
    const { items, clearCart } = useCart();
    const { paymentMethod, setPaymentMethod, setOrderNumber, shippingData } = useCheckout();
    const { setLoading } = useLoading();
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState('');

    const handlePlaceOrder = async () => {
        if (!paymentMethod) {
            setError('Please select a payment method');
            return;
        }

        setIsProcessing(true);
        setError('');

        try {
            // SECURITY: Backend calculates prices (frontend sends ONLY items + quantities)
            const response = await apiClient.post('/orders', {
                items: items.map(item => ({
                    productId: String(item.id),
                    variantId: item.variantId || String(item.id),
                    quantity: item.quantity,
                    imageUrlSnapshot: item.image,
                    // NO PRICES - backend fetches from database
                })),
                shippingAddress: {
                    fullName: shippingData.fullName,
                    email: shippingData.email,
                    phone: shippingData.phone,
                    addressLine1: shippingData.address,
                    city: shippingData.city,
                    state: shippingData.state,
                    postalCode: shippingData.postalCode,
                    country: shippingData.country || 'India',
                },
                // NO PRICES - backend calculates
            });

            const { orderNumber, razorpayOrderId, totalAmount } = response.data;

            // Set order number
            setOrderNumber(orderNumber);

            // Open Razorpay checkout
            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY,
                amount: Math.round(totalAmount * 100), // Convert to paise
                currency: 'INR',
                name: 'HumanTee',
                description: `Order ${orderNumber}`,
                order_id: razorpayOrderId,
                handler: async function (response: any) {
                    try {
                        // Verify payment on backend
                        await apiClient.post('/orders/verify-payment', {
                            orderId: response.razorpay_order_id,
                            razorpayPaymentId: response.razorpay_payment_id,
                            razorpayOrderId: response.razorpay_order_id,
                            razorpaySignature: response.razorpay_signature,
                        });

                        // Clear cart and redirect
                        clearCart();
                        setLoading(true);
                        router.push("/checkout/status/success");
                    } catch (err) {
                        Sentry.captureException(err, {
                            tags: { feature: 'payment' },
                            extra: { context: 'payment_verification' }
                        });
                        setError('Payment verification failed. Please contact support.');
                        setIsProcessing(false);
                    }
                },
                modal: {
                    ondismiss: function () {
                        Sentry.addBreadcrumb({
                            category: 'payment',
                            message: 'Payment cancelled by user',
                            level: 'info'
                        });
                        setIsProcessing(false);
                    }
                },
                prefill: {
                    name: shippingData.fullName,
                    email: shippingData.email,
                    contact: shippingData.phone,
                },
                theme: {
                    color: '#000000',
                },
            };

            const razorpay = new window.Razorpay(options);
            razorpay.open();

        } catch (err: any) {
            // Error handling
            if (err.isTimeout) {
                setError('The request took too long. Please try again.');
            } else if (err.response?.status === 400) {
                setError(err.response?.data?.message || 'Please check your order details and try again.');
            } else if (err.response?.status === 402) {
                setError('Payment was declined. Please try another method.');
            } else {
                setError('Unable to create order. Please try again.');
            }
            setIsProcessing(false);
        }
    };

    return {
        items,
        paymentMethod,
        setPaymentMethod,
        shippingData,
        isProcessing,
        error,
        handlePlaceOrder,
    };
}
