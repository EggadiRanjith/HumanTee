"use client";

import {
  FiTruck,
  FiCheckCircle,
  FiClock,
  FiPackage,
  FiHelpCircle,
  FiShoppingBag,
  FiArrowLeft,
  FiLoader
} from "react-icons/fi";

import Link from "next/link";
import { useState, useEffect, use } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import apiClient from "@/lib/api-client";
import { HelpActionModal } from "@/app/components/orders/HelpActionModal";
import { LazyMotion, domAnimation } from "framer-motion";

export default function OrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [order, setOrder] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);

  // Unwrap params Promise
  const { id } = use(params);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await apiClient.get(`/orders/${id}`);
        setOrder(response.data);
      } catch (error) {
        console.error('Failed to fetch order:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchOrder();
    }
  }, [isAuthenticated, id]);

  const getStatus = (status: string) => {
    switch (status) {
      case "delivered":
        return { icon: FiCheckCircle, label: "Delivered", class: "text-white" };
      case "shipped":
        return { icon: FiTruck, label: "Shipped", class: "text-white" };
      case "processing":
        return { icon: FiClock, label: "Processing", class: "text-white/60" };
      default:
        return { icon: FiPackage, label: "Unknown", class: "text-white/40" };
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen brand-bg-dusk pt-[var(--header-height)] flex items-center justify-center">
        <FiLoader className="w-8 h-8 animate-spin text-white/40" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen brand-bg-dusk pt-[var(--header-height)] flex items-center justify-center">
        <div className="text-center">
          <p className="text-white/60 mb-4">Order not found</p>
          <Link href="/orders">
            <button className="text-white/60 hover:text-white text-sm">← Back to Orders</button>
          </Link>
        </div>
      </div>
    );
  }

  const Status = getStatus(order.status);
  const StatusIcon = Status.icon;

  return (
    <div className="min-h-screen brand-bg-dusk pt-[var(--header-height)]">
      <div className="max-w-screen-lg mx-auto px-4 sm:px-6 lg:px-10 pb-10 pt-8">

        {/* Back Button */}
        <Link href="/orders">
          <button className="flex items-center gap-2 text-white/60 hover:text-white text-sm mb-6 transition-colors">
            <FiArrowLeft className="w-4 h-4" />
            Back to Orders
          </button>
        </Link>

        <div className="mb-10 space-y-1">
          <h1
            className="
            text-[28px] sm:text-[36px] lg:text-[44px]
            font-light
            tracking-[0.14em]
            uppercase
            text-white
            leading-tight
          "
          >
            Order Details
          </h1>

          <p className="
            text-white/45
            text-[11px] sm:text-[12px]
            uppercase tracking-[0.22em]
          "
          >
            Review your purchase summary
          </p>
        </div>


        {/* ORDER HEADER CARD */}
        <div className="p-5 rounded-2xl luxury-glass border border-white/10 bg-white/5 backdrop-blur-xl mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl text-white tracking-wide font-light">
                {order.orderNumber}
              </h2>
              <p className="text-white/50 text-sm mt-1">
                Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric'
                })}
              </p>
            </div>

            <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg">
              <StatusIcon className={`w-4 h-4 ${Status.class}`} />
              <span className="uppercase text-[10px] tracking-[0.2em] text-white/70">
                {Status.label}
              </span>
            </div>
          </div>
        </div>

        {/* GRID SUMMARY */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">

          {/* SHIPPING */}
          <div className="p-5 rounded-xl luxury-glass border border-white/10 bg-white/5">
            <h3 className="text-white/70 text-xs uppercase tracking-[0.18em] mb-2">
              Shipping Address
            </h3>
            <p className="text-white/90 text-sm leading-relaxed">
              {order.address.fullName}<br />
              {order.address.addressLine1}<br />
              {order.address.addressLine2 && <>{order.address.addressLine2}<br /></>}
              {order.address.city}, {order.address.state}<br />
              {order.address.postalCode}, {order.address.country}
            </p>
          </div>

          {/* PAYMENT */}
          <div className="p-5 rounded-xl luxury-glass border border-white/10 bg-white/5">
            <h3 className="text-white/70 text-xs uppercase tracking-[0.18em] mb-2">
              Payment Method
            </h3>
            <p className="text-white/90 text-sm">
              {order.payments?.[0]?.paymentMethod || 'Razorpay'}
            </p>
            <p className="text-white/60 text-xs mt-1">
              Status: {order.payments?.[0]?.status || 'Captured'}
            </p>
          </div>

        </div>

        {/* ORDER ITEMS */}
        <div className="space-y-4 mb-12">
          {order.items.map((item: any) => (
            <div
              key={item.id}
              className="flex items-center gap-4 p-4 rounded-xl luxury-glass border border-white/10 bg-white/5"
            >
              <Link href={`/product/${item.productId}`} className="flex-shrink-0">
                <img
                  src={item.imageUrlSnapshot || '/placeholder.png'}
                  className="w-20 h-20 rounded-lg object-cover hover:opacity-80 transition-opacity cursor-pointer"
                  alt={item.productNameSnapshot}
                />
              </Link>
              <div className="flex-1">
                <Link href={`/product/${item.productId}`} className="hover:underline">
                  <h4 className="text-white text-sm tracking-wide">{item.productNameSnapshot}</h4>
                </Link>
                <p className="text-white/60 text-xs mt-1">Size: {item.variantLabelSnapshot}</p>

                <p className="text-white/70 text-xs mt-1">
                  ₹{Number(item.unitPrice).toFixed(2)} × {item.quantity}
                </p>

                <p className="text-white text-sm font-light mt-2">
                  ₹{Number(item.lineTotal).toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* PRICE BREAKDOWN */}
        <div className="p-6 rounded-2xl luxury-glass border border-white/10 bg-white/5 space-y-3 mb-8">
          <div className="flex justify-between text-white/70 text-sm">
            <span>Subtotal</span>
            <span>₹{Number(order.subtotal).toFixed(2)}</span>
          </div>

          {order.shippingAmount > 0 && (
            <div className="flex justify-between text-white/70 text-sm">
              <span>Shipping</span>
              <span>₹{Number(order.shippingAmount).toFixed(2)}</span>
            </div>
          )}

          {order.taxAmount > 0 && (
            <div className="flex justify-between text-white/70 text-sm">
              <span>Tax</span>
              <span>₹{Number(order.taxAmount).toFixed(2)}</span>
            </div>
          )}

          {order.discountAmount > 0 && (
            <div className="flex justify-between text-green-400 text-sm">
              <span>Discount</span>
              <span>-₹{Number(order.discountAmount).toFixed(2)}</span>
            </div>
          )}

          <div className="border-t border-white/10 pt-3 flex justify-between text-white text-lg tracking-wide font-light">
            <span>Total</span>
            <span>₹{Number(order.totalAmount).toFixed(2)}</span>
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex flex-col gap-3">

          {/* REORDER */}
          <Link
            href="/shop"
            className="
              w-full flex items-center justify-center gap-2
              px-6 py-3 rounded-xl
              luxury-glass border border-white/15
              text-white/90 hover:text-white hover:bg-white/10
              transition-all text-sm uppercase tracking-[0.18em]
            "
          >
            <FiShoppingBag className="w-4 h-4" /> Reorder Items
          </Link>

          {/* SUPPORT */}
          <button
            onClick={() => setIsHelpModalOpen(true)}
            className="
              w-full flex items-center justify-center gap-2
              px-6 py-3 rounded-xl
              luxury-glass border border-white/10 
              text-white/70 hover:text-white hover:bg-white/10
              transition-all text-sm uppercase tracking-[0.18em]
            "
          >
            <FiHelpCircle className="w-4 h-4" /> Need Help?
          </button>

        </div>

        <LazyMotion features={domAnimation}>
          <HelpActionModal
            isOpen={isHelpModalOpen}
            onClose={() => setIsHelpModalOpen(false)}
            orderId={id}
            orderNumber={order.orderNumber}
          />
        </LazyMotion>
      </div>
    </div>
  );
}
