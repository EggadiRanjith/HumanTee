import { useState, useRef } from "react";
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
    const { items, clearCart, appliedDiscount, discountedTotal } = useCart();
    const { paymentMethod, setPaymentMethod, setOrderNumber, shippingData } = useCheckout();
    const { setLoading } = useLoading();
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState('');

    // CRITICAL: Payment idempotency lock to prevent double-charging
    const [orderLock, setOrderLock] = useState<string | null>(null);

    // Browser-compatible UUID v4 generator
    const generateUUID = () => {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    };

    // CRITICAL: Generate idempotency key ONCE per component mount (not per click)
    // This prevents duplicate orders if user clicks multiple times
    const idempotencyKey = useRef(generateUUID()); // UUID v4 format

    // OBSERVABILITY: Correlation ID for tracing payment failures
    const correlationId = useRef(`order-${Date.now()}-${Math.random().toString(36).substring(7)}`);

    // Load Razorpay script dynamically
    const loadRazorpayScript = (): Promise<boolean> => {
        return new Promise((resolve) => {
            // Check if already loaded
            if (typeof window !== 'undefined' && window.Razorpay) {
                resolve(true);
                return;
            }

            // Load script
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handlePlaceOrder = async () => {
        // CRITICAL: Prevent double execution at the very start
        if (isProcessing || orderLock) {
            return;
        }

        // OBSERVABILITY: Set Sentry context for this payment attempt
        Sentry.setContext('payment', {
            correlationId: correlationId.current,
            idempotencyKey: idempotencyKey.current,
            userEmail: shippingData.email,
            cartTotal: items.reduce((sum, i) => sum + i.price * i.quantity, 0),
            itemCount: items.length,
            paymentMethod,
        });

        if (!paymentMethod) {
            setError('Please select a payment method');
            return;
        }

        // Set both locks immediately
        setOrderLock(idempotencyKey.current);
        setIsProcessing(true);
        setError('');

        try {
            // Load Razorpay script first
            const scriptLoaded = await loadRazorpayScript();
            if (!scriptLoaded) {
                // Log script load failure
                Sentry.captureException(new Error('Razorpay script load failed'), {
                    tags: { feature: 'payment', step: 'script_load' },
                });
                throw new Error('Failed to load Razorpay payment gateway');
            }

            // SECURITY: Backend calculates prices (frontend sends ONLY items + quantities)
            const payload = {
                idempotencyKey: idempotencyKey.current, // ← CRITICAL for preventing duplicates
                items: items.map(item => ({
                    productId: item.id, // ← Now correctly the product UUID
                    variantId: item.variantId || item.id, // ← Variant UUID or fallback to product UUID
                    quantity: item.quantity,
                    imageUrlSnapshot: item.image,
                })),
                shippingAddress: {
                    fullName: shippingData.fullName,
                    email: shippingData.email,
                    phone: shippingData.phone,
                    addressLine1: shippingData.addressLine1 || shippingData.address, // Use addressLine1 or fallback to address
                    addressLine2: shippingData.addressLine2 || '', // Optional
                    city: shippingData.city,
                    state: shippingData.state,
                    postalCode: shippingData.postalCode,
                    country: shippingData.country || 'India',
                },
                discountCode: appliedDiscount?.code || undefined, // ← Send discount code for backend validation
            };



            const response = await apiClient.post('/orders/prepare', payload);

            const { razorpayOrderId, totalAmount, orderData } = response.data;

            // Open Razorpay checkout
            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY,
                amount: Math.round(totalAmount * 100), // Convert to paise
                currency: 'INR',
                name: 'HumanTee',
                description: 'Order Payment',
                order_id: razorpayOrderId,
                handler: async function (response: any) {
                    try {
                        // Confirm order with payment details
                        const confirmResponse = await apiClient.post('/orders/confirm', {
                            idempotencyKey: idempotencyKey.current, // CRITICAL: Prevent duplicate orders
                            razorpayOrderId: response.razorpay_order_id,
                            razorpayPaymentId: response.razorpay_payment_id,
                            razorpaySignature: response.razorpay_signature,
                            orderData: orderData, // Pass back the prepared order data
                        });

                        // Set order number from confirmation
                        setOrderNumber(confirmResponse.data.orderNumber);

                        // Clear cart and redirect
                        clearCart();
                        setLoading(true);
                        router.push("/checkout/status/success");
                    } catch (err) {
                        Sentry.captureException(err, {
                            tags: { feature: 'payment', step: 'confirmation' },
                            extra: {
                                context: 'order_confirmation',
                                correlationId: correlationId.current
                            }
                        });
                        setError('Order confirmation failed. Please contact support with your payment ID.');
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
            // SECURITY: Generate user-facing error ID (no sensitive data in console)
            const errorId = `ERR-${new Date().toISOString().split('T')[0]}-${correlationId.current.slice(-8).toUpperCase()}`;

            // Log to Sentry only (not console)
            Sentry.captureException(err, {
                tags: {
                    feature: 'payment',
                    step: 'prepare_order',
                    errorId,
                },
                extra: {
                    correlationId: correlationId.current,
                    idempotencyKey: idempotencyKey.current,
                    status: err.response?.status,
                    message: err.message,
                },
            });

            // Enhanced error messages with error ID
            let errorMessage = '';
            if (err.isTimeout) {
                errorMessage = 'The request took too long. This might be due to a slow internet connection. Please check your connection and try again.';
            } else if (err.response?.status === 409) {
                // CRITICAL: Stock conflict - item sold out during checkout
                errorMessage = err.response?.data?.message || 'Some items are no longer available.';

                // Refresh cart to show updated stock
                // Note: Cart will auto-refresh on next page load, but we could also call a refresh method here
                errorMessage += '\n\nYour cart will be updated. Please review and try again.';
            } else if (err.response?.status === 400) {
                errorMessage = err.response?.data?.message || 'Please check your order details and try again.';
            } else if (err.response?.status === 402) {
                errorMessage = 'Payment was declined. Please try another payment method.';
            } else if (err.message.includes('Razorpay')) {
                errorMessage = 'Payment gateway unavailable. Please try again in a few minutes or contact support.';
            } else {
                errorMessage = 'Unable to create order. Please try again.';
            }

            // Add error ID to message for support debugging (except for stock conflicts)
            if (err.response?.status !== 409) {
                setError(
                    `${errorMessage}\n\n` +
                    `Error ID: ${errorId}\n\n` +
                    `If this persists, contact support with this error ID.`
                );
            } else {
                // Stock conflict - no error ID needed, just show the message
                setError(errorMessage);
            }

            // Clear locks on error so user can retry
            setIsProcessing(false);
            setOrderLock(null);
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
        appliedDiscount,
        discountedTotal,
    };
}
