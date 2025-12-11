"use client";

import { OrderCard } from "@/app/components/ui/orders";
import { GradientOverlay } from "@/app/components/ui/layout";
import { mockOrders } from "@/app/data/orders.data";

export default function OrdersPage() {
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

        {/* Order Cards */}
        <div className="space-y-5">
          {mockOrders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>

      </div>
    </div>
  );
}
