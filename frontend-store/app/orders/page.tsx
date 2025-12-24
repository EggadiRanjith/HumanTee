"use client";

import { OrderCard } from "@/app/components/ui/orders";
import { GradientOverlay } from "@/app/components/ui/layout";
import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from "@/app/contexts/AuthContext";
import { useRouter } from "next/navigation";
import apiClient from "@/lib/api-client";

// Dynamically import Lottie to avoid SSR issues
const Lottie = dynamic(() => import('lottie-react'), { ssr: false });

export default function OrdersPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [emptyOrderAnimation, setEmptyOrderAnimation] = useState(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await apiClient.get('/orders');
        setOrders(response.data);
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchOrders();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    // Load Lottie animation only on client side
    if (orders.length === 0 && !isLoading) {
      fetch('/animation/lottie/Empty_order.json')
        .then(res => res.json())
        .then(data => setEmptyOrderAnimation(data))
        .catch(err => console.error('Failed to load empty order animation:', err));
    }
  }, [orders.length, isLoading]);

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen brand-bg pb-24 pt-[var(--header-height)] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white/40"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen brand-bg pb-24 pt-[var(--header-height)]">
      <GradientOverlay variant="violet" />

      <div className="relative max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-10 pt-12">

        {/* Page Title */}
        <div className="mb-10">
          <h1 className="text-[26px] sm:text-[34px] lg:text-[42px] font-light uppercase tracking-[0.14em] text-white">
            Orders
          </h1>
          <p className="text-white/45 text-[11px] uppercase tracking-[0.22em] mt-2">
            Track and manage your previous purchases
          </p>
        </div>

        {/* Empty State */}
        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 sm:py-20 lg:py-24 min-h-[60vh]">
            {emptyOrderAnimation && (
              <div className="w-[200px] sm:w-[280px] lg:w-[320px] mb-6">
                <Lottie animationData={emptyOrderAnimation} loop={true} />
              </div>
            )}
            <h3 className="text-[18px] sm:text-[22px] lg:text-[26px] font-light uppercase tracking-[0.12em] text-white mb-3">
              No Orders Yet
            </h3>
            <p className="text-white/45 text-[11px] sm:text-[12px] uppercase tracking-[0.18em] mb-8 text-center max-w-md">
              Start shopping to see your order history here
            </p>
            <Link
              href="/shop"
              className="
                text-white/60 text-step--1 tracking-wide 
                border border-white/10 rounded-full
                px-8 py-3 motion-cinematic luxury-glass
                hover:border-white/20 hover:text-white
              "
            >
              START SHOPPING
            </Link>
          </div>
        ) : (
          /* Order Cards */
          <div className="space-y-5">
            {orders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
