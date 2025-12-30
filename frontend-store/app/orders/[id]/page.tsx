/**
 * Order Detail Page
 * FANG-Level Refactored with modular components
 * Displays comprehensive order information
 * Supports GUEST access (via ID check on backend)
 */

"use client";

import Link from "next/link";
import { logError } from '@/lib/logger';
import { useState, useEffect, use } from "react";
import { useAuth } from "@/app/contexts/AuthContext";
import { useRouter } from "next/navigation";
import apiClient from "@/lib/api-client";
import axios from "axios";
import { HelpActionModal } from "@/app/components/orders/HelpActionModal";
import { LazyMotion, domAnimation } from "framer-motion";
import { FiArrowLeft, FiLoader } from "react-icons/fi";
import { Order } from '../../types/order.types';
import {
  OrderHeader,
  OrderTimeline,
  OrderItems,
  OrderSummary,
  OrderActions
} from './components';

export default function OrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);

  // Unwrap params Promise
  const { id } = use(params);

  // Fetch order details
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await apiClient.get(`/orders/${id}`);
        setOrder(response.data);
      } catch (error: unknown) {
        logError(error, 'Failed to fetch order');
        if (axios.isAxiosError(error)) {
          if (error.response?.status === 401 && !isAuthenticated) {
            // Only redirect to login if it's a 401 AND it's not a public order
            router.push('/login');
          }
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (!authLoading) {
      fetchOrder();
    }
  }, [authLoading, id, isAuthenticated, router]);

  // Loading state
  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen brand-bg-dusk pt-[var(--header-height)] flex items-center justify-center">
        <FiLoader className="w-8 h-8 animate-spin text-white/40" />
      </div>
    );
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

        {/* Order Timeline */}
        <OrderTimeline
          status={order.status}
          createdAt={order.createdAt}
          updatedAt={order.updatedAt}
          trackingNumber={order.trackingNumber}
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

        {/* Action Buttons */}
        <OrderActions onHelpClick={() => setIsHelpModalOpen(true)} />

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
