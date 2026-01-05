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
        console.log('🔵 Place Order clicked!', { paymentMethod, itemsCount: items.length });

        if (!paymentMethod) {
            console.log('❌ No payment method selected');
            setError('Please select a payment method');
            return;
        }

        console.log('✅ Starting order creation...');
        setIsProcessing(true);
        setError('');

        try {
            // SECURITY: Backend calculates prices (frontend sends ONLY items + quantities)
            console.log('📤 Sending order request...');
            const response = await apiClient.post('/orders', {
                items: items.map(item => ({
                    productId: String(item.id),
                    variantId: item.variantId || String(item.id),
                    quantity: item.quantity,
                    imageUrlSnapshot: item.image,
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
            });

            console.log('✅ Order response received:', response.data);

            const { orderNumber, razorpayOrderId, totalAmount } = response.data;

            // Set order number
            setOrderNumber(orderNumber);

            console.log('🔍 Checking order type:', { orderNumber, razorpayOrderId });

            // Check if this is a development order (backend returns dev_timestamp)
            const isDevelopmentOrder = razorpayOrderId?.startsWith('dev_');

            console.log('🎯 Is development order?', isDevelopmentOrder);

            if (isDevelopmentOrder) {
                // Development mode: Skip payment, go straight to success
                console.log('🚀 Development mode detected! Redirecting to success...');
                clearCart();
                setLoading(true);
                router.push("/checkout/status/success");
                return;
            }

            // Production mode: Open Razorpay checkout
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
            console.error('❌ Order creation failed:', err);
            console.error('Error details:', {
                message: err.message,
                response: err.response?.data,
                status: err.response?.status,
                isTimeout: err.isTimeout
            });
            console.error('Full response data:', err.response?.data);

            // Error handling
            if (err.isTimeout) {
                setError('The request took too long. Please try again.');
            } else if (err.response?.status === 400) {
                const errorMessage = err.response?.data?.message || 'Please check your order details and try again.';
                console.error('Backend validation error:', errorMessage);
                setError(errorMessage);
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
