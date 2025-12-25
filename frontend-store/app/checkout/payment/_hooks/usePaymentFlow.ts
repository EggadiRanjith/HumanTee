import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/app/contexts/CartContext";
import { useCheckout, type PaymentMethod } from "@/app/contexts/CheckoutContext";
import { useLoading } from "@/app/contexts/LoadingContext";
import apiClient from "@/lib/api-client";

export function usePaymentFlow() {
    const router = useRouter();
    const { items, totalPrice, clearCart } = useCart();
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
            // Create order in database
            const response = await apiClient.post('/orders', {
                items: items.map(item => ({
                    productId: String(item.id),
                    variantId: item.variantId || String(item.id),
                    productNameSnapshot: item.title,
                    variantLabelSnapshot: item.size || 'Default',
                    skuSnapshot: item.size || 'N/A',
                    imageUrlSnapshot: item.image,
                    quantity: item.quantity,
                    unitPrice: item.price,
                    lineTotal: item.price * item.quantity,
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
                subtotal: totalPrice,
                totalAmount: totalPrice,
            });

            // Set order number from response
            setOrderNumber(response.data.orderNumber);

            // Clear cart and redirect to success
            clearCart();
            setLoading(true);
            router.push("/checkout/status/success");
        } catch (err: any) {
            // P1-C: Refined error copy based on error type
            if (err.isTimeout) {
                setError('The request took too long. Please try again.');
            } else if (err.response?.status === 400) {
                setError('Please check your order details and try again.');
            } else if (err.response?.status === 402) {
                setError('Payment was declined. Please try another method.');
            } else {
                setError('Unable to complete the order. Please try again.');
            }
            setIsProcessing(false);
        }
    };

    return {
        items,
        totalPrice,
        paymentMethod,
        setPaymentMethod,
        shippingData,
        isProcessing,
        error,
        handlePlaceOrder,
    };
}
