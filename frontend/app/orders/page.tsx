"use client";

import Image from "next/image";
import Link from "next/link";
import { FiPackage, FiTruck, FiCheckCircle, FiClock } from "react-icons/fi";

export default function OrdersPage() {
  const orders = [
    {
      id: "ORD-001",
      date: "Dec 5, 2025",
      status: "delivered",
      total: "$258.00",
      items: 2,
      tracking: "TRK123456789",
      images: [
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=60&w=600",
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=60&w=600",
      ],
    },
    {
      id: "ORD-002",
      date: "Dec 7, 2025",
      status: "shipped",
      total: "$129.00",
      items: 1,
      tracking: "TRK987654321",
      images: [
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=60&w=600",
      ],
    },
    {
      id: "ORD-003",
      date: "Dec 8, 2025",
      status: "processing",
      total: "$387.00",
      items: 3,
      tracking: null,
      images: [
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=60&w=600",
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=60&w=600",
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=60&w=600",
      ],
    },
  ];

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "delivered":
        return { icon: FiCheckCircle, label: "Delivered", class: "text-brand-primary" };
      case "shipped":
        return { icon: FiTruck, label: "Shipped", class: "text-brand-primary" };
      case "processing":
        return { icon: FiClock, label: "Processing", class: "text-white/60" };
      default:
        return { icon: FiPackage, label: "Unknown", class: "text-white/40" };
    }
  };

  return (
    <div className="min-h-screen brand-bg pb-24 pt-[var(--header-height)]">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-10">

        {/* PAGE TITLE */}
        <div className="mb-10">
          <h1 className="text-[26px] sm:text-[34px] lg:text-[42px] font-light uppercase tracking-[0.14em] text-white">
            Orders
          </h1>
          <p className="text-white/45 text-[11px] uppercase tracking-[0.22em] mt-2">
            Track and manage your previous purchases
          </p>
        </div>

        {/* ORDER CARDS */}
        <div className="space-y-5">
          {orders.map((order) => {
            const status = getStatusConfig(order.status);
            const Icon = status.icon;

            return (
              <div
                key={order.id}
                className="
                  p-6 rounded-2xl luxury-glass border border-white/10 
                  bg-white/5 backdrop-blur-xl
                  flex flex-col sm:flex-row justify-between gap-6
                "
              >
                {/* LEFT CONTENT */}
                <div className="flex-1 flex flex-col justify-between">
                  
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-white text-lg font-light tracking-wide">
                        {order.id}
                      </h3>

                      <span className="flex items-center gap-1.5 px-2 py-1 bg-white/5 border border-white/10 rounded-md">
                        <Icon className={`w-3.5 h-3.5 ${status.class}`} />
                        <span className="text-[10px] uppercase tracking-[0.18em] text-white/70">
                          {status.label}
                        </span>
                      </span>
                    </div>

                    <p className="text-white/50 text-sm mb-1">
                      {order.date} • {order.items} items
                    </p>

                    {order.tracking && (
                      <p className="text-white/40 text-xs">Tracking: {order.tracking}</p>
                    )}
                  </div>

                  {/* Amount + CTA */}
                  <div className="flex items-center gap-6 mt-4">
                    <p className="text-white text-xl font-light">{order.total}</p>

                    <Link
                      href={`/orders/${order.id}`}
                      className="
                        px-4 py-2 rounded-xl border border-white/10 
                        text-white/80 text-xs uppercase tracking-[0.18em]
                        hover:text-white hover:border-white/20 transition-colors
                      "
                    >
                      View Details
                    </Link>
                  </div>
                </div>

                {/* RIGHT IMAGE CLUSTER */}
                <div className="flex-shrink-0 flex gap-2 sm:gap-3">
                  {order.images.slice(0, 3).map((img, i) => (
                    <div
                      key={i}
                      className="relative w-16 h-20 sm:w-20 sm:h-24 rounded-lg overflow-hidden border border-white/10"
                    >
                      <Image
                        src={img}
                        fill
                        alt=""
                        className="object-cover"
                        sizes="120px"
                      />
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
