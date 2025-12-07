"use client";

import { FiPackage, FiTruck, FiCheckCircle, FiClock } from "react-icons/fi";
import Link from "next/link";

export default function OrdersPage() {
  const orders = [
    {
      id: "ORD-001",
      date: "Dec 5, 2025",
      status: "delivered",
      total: "$258.00",
      items: 2,
      tracking: "TRK123456789"
    },
    {
      id: "ORD-002",
      date: "Dec 7, 2025",
      status: "shipped",
      total: "$129.00",
      items: 1,
      tracking: "TRK987654321"
    },
    {
      id: "ORD-003",
      date: "Dec 8, 2025",
      status: "processing",
      total: "$387.00",
      items: 3,
      tracking: null
    }
  ];

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "delivered":
        return { icon: FiCheckCircle, label: "Delivered", class: "text-brand-primary" };
      case "shipped":
        return { icon: FiTruck, label: "Shipped", class: "text-brand-primary" };
      case "processing":
        return { icon: FiClock, label: "Processing", class: "text-brand-text-muted" };
      default:
        return { icon: FiPackage, label: "Unknown", class: "text-brand-text-dim" };
    }
  };

  return (
    <div className="min-h-screen brand-bg pb-24">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-10">

        {/* PAGE TITLE */}
        <div className="pt-24 sm:pt-28 lg:pt-36 mb-8">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-light tracking-wide text-white">
            Orders
          </h1>
          <p className="text-white/50 text-sm sm:text-base mt-1">
            Track and manage your previous purchases
          </p>
        </div>

        {/* SUMMARY → MOVED TO TOP */}
        <div className="grid grid-cols-3 gap-3 mb-10">

          <div className="
            p-4 rounded-xl luxury-glass border border-white/10 text-center 
            flex flex-col justify-center
          ">
            <p className="text-lg sm:text-xl text-white font-light">3</p>
            <p className="text-white/50 text-[10px] sm:text-xs tracking-wide mt-1">Total Orders</p>
          </div>

          <div className="
            p-4 rounded-xl luxury-glass border border-white/10 text-center 
            flex flex-col justify-center
          ">
            <p className="text-lg sm:text-xl text-white font-light">1</p>
            <p className="text-white/50 text-[10px] sm:text-xs tracking-wide mt-1">Delivered</p>
          </div>

          <div className="
            p-4 rounded-xl luxury-glass border border-white/10 text-center 
            flex flex-col justify-center
          ">
            <p className="text-lg sm:text-xl text-white font-light">$774</p>
            <p className="text-white/50 text-[10px] sm:text-xs tracking-wide mt-1">Total Spent</p>
          </div>

        </div>

        {/* ORDERS LIST */}
        <div className="space-y-4">
          {orders.map((order) => {
            const status = getStatusConfig(order.status);
            const StatusIcon = status.icon;

            return (
              <div
                key={order.id}
                className="
                  p-5 sm:p-6 
                  rounded-2xl luxury-glass border border-white/10 
                  bg-white/5 backdrop-blur-xl
                "
              >
                <div className="flex flex-col sm:flex-row justify-between gap-4">

                  {/* LEFT */}
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg text-white font-light tracking-wide">
                        {order.id}
                      </h3>

                      <div
                        className="
                          flex items-center gap-1.5 
                          px-2 py-1 rounded-md 
                          bg-white/5 border border-white/10
                        "
                      >
                        <StatusIcon className={`w-3.5 h-3.5 ${status.class}`} />
                        <span className="text-[10px] uppercase tracking-[0.18em] text-white/70">
                          {status.label}
                        </span>
                      </div>
                    </div>

                    <p className="text-white/50 text-sm">
                      {order.date} • {order.items} items
                    </p>

                    {order.tracking && (
                      <p className="text-white/40 text-xs">
                        Tracking: {order.tracking}
                      </p>
                    )}
                  </div>

                  {/* RIGHT */}
                  <div className="flex items-center gap-4 sm:gap-8 justify-between sm:justify-end">

                    <p className="text-xl text-white font-light tracking-wide">
                      {order.total}
                    </p>

                    <Link
                      href={`/orders/${order.id}`}
                      className="
                        px-4 py-2 
                        rounded-xl luxury-glass 
                        border border-white/10 
                        text-white/80 text-xs uppercase tracking-[0.2em]
                        hover:text-white transition-colors
                      "
                    >
                      View Details
                    </Link>

                  </div>

                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
