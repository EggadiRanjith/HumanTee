/**
 * Order Detail Page
 * FANG-Level Refactored with modular components
 * Displays comprehensive order information
 * Supports GUEST access (via ID check on backend)
 */

"use client";

import Link from "next/link";
import { useState, useEffect, use } from "react";
import { useAuth } from "@/app/contexts/AuthContext";
import { useLoading } from "@/app/contexts/LoadingContext";
import { useRouter } from "next/navigation";
import { HelpActionModal } from "@/app/components/orders/HelpActionModal";
import { LazyMotion, domAnimation } from "framer-motion";
import { FiArrowLeft, FiHelpCircle } from "react-icons/fi";
import {
  OrderHeader,
  OrderItems,
  OrderSummary,
  OrderDetailSkeleton
} from './components';
import { useSettings } from "@/app/contexts/SettingsContext";
import { useOrder } from '../hooks/useOrder';

export default function OrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { setLoading } = useLoading();
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);

  // Settings for feature flags
  const { settings } = useSettings();

  // Unwrap params Promise
  const { id } = use(params);

  // Use the optimized useOrder hook instead of manual fetching
  const { order, isLoading, error } = useOrder(id);

  // Handle auth redirect for 401 errors
  useEffect(() => {
    if (error && !isAuthenticated) {
      router.push(`/login?redirect=/orders/${id}`);
    }
  }, [error, isAuthenticated, id, router]);

  // Hide navigation loader when data arrives or error occurs
  useEffect(() => {
    if (!isLoading) {
      setLoading(false);
    }
  }, [isLoading, setLoading]);

  // Hide loader when auth check completes without needing data fetch
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      setLoading(false);
    }
  }, [authLoading, isAuthenticated, setLoading]);

  // Show skeleton while loading
  if (authLoading || isLoading) {
    return <OrderDetailSkeleton />;
  }

  // Not found state
  if (!order) {
    return (
      <div className="min-h-screen brand-bg-dusk pt-[var(--header-height)] flex items-center justify-center">
        <div className="text-center px-4">
          <p className="text-white/60 mb-4">Order not found or access denied</p>
          <button
            onClick={() => router.back()}
            className="text-white/60 hover:text-white text-sm"
          >
            ← Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen brand-bg-dusk pt-[var(--header-height)]">
      <div className="max-w-screen-lg mx-auto px-4 sm:px-6 lg:px-10 pb-10 pt-8">
        {/* Back Button */}
        <button
          onClick={() => isAuthenticated ? router.push('/orders') : router.push('/shop')}
          className="flex items-center gap-2 text-white/60 hover:text-white text-sm mb-6 transition-colors"
        >
          <FiArrowLeft className="w-4 h-4" />
          {isAuthenticated ? 'Back to Orders' : 'Back to Shop'}
        </button>

        {/* Page Title */}
        <div className="mb-10 space-y-1">
          <h1 className="text-[28px] sm:text-[36px] lg:text-[44px] font-light tracking-[0.14em] uppercase text-white leading-tight">
            Order Details
          </h1>
          <p className="text-white/45 text-[11px] sm:text-[12px] uppercase tracking-[0.22em]">
            Review your purchase summary
          </p>
        </div>

        {/* Order Header */}
        <OrderHeader
          orderNumber={order.orderNumber}
          createdAt={order.createdAt}
          status={order.status}
        />

        {/* Order Summary (Shipping & Payment) */}
        <OrderSummary
          address={order.address}
          payments={order.payments}
          subtotal={order.subtotal}
          shippingAmount={order.shippingAmount}
          taxAmount={order.taxAmount}
          discountAmount={order.discountAmount}
          totalAmount={order.totalAmount}
        />

        {/* Order Items */}
        <OrderItems items={order.items} />

        {/* Need Help Button - Only show if tickets feature enabled */}
        {settings?.features?.ticketsEnabled && (
          <button
            onClick={() => setIsHelpModalOpen(true)}
            className="
              w-full flex items-center justify-center gap-2
              px-6 py-3 rounded-xl mt-6
              luxury-glass border border-white/10 
              text-white/70 hover:text-white hover:bg-white/10
              transition-all text-sm uppercase tracking-[0.18em]
            "
          >
            <FiHelpCircle className="w-4 h-4" /> Need Help?
          </button>
        )}

        {/* Help Modal */}
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
