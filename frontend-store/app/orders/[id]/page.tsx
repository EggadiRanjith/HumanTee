"use client";

import {
  FiTruck,
  FiCheckCircle,
  FiClock,
  FiPackage,
  FiHelpCircle,
  FiShoppingBag
} from "react-icons/fi";

import Link from "next/link";


type Order = {
  id: string;
  date: string;
  status: string;
  subtotal: string;
  shipping: string;
  tax: string;
  total: string;
  tracking?: string;
  paymentMethod: string;
  shippingAddress: {
    name: string;
    line1: string;
    city: string;
    country: string;
    zip: string;
  };
  items: {
    title: string;
    size: string;
    price: string;
    quantity: number;
    image: string;
  }[];
};

const order: Order = {
  id: "ORD-001",
  date: "Dec 5, 2025",
  status: "delivered",
  subtotal: "$220.00",
  shipping: "$10.00",
  tax: "$28.00",
  total: "$258.00",
  tracking: "TRK123456789",
  paymentMethod: "Visa •••• 4219",
  shippingAddress: {
    name: "John Carter",
    line1: "221B Baker Street",
    city: "London",
    country: "UK",
    zip: "NW1 6XE",
  },
  items: [
    {
      title: "Midnight Core Tee",
      size: "L",
      price: "$58",
      quantity: 1,
      image:
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800&auto=format",
    },
    {
      title: "Quantum Crest Tee",
      size: "M",
      price: "$62",
      quantity: 1,
      image:
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800&auto=format",
    },
  ],
};

export default function OrderDetailsPage() {
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

  const Status = getStatus(order.status);
  const StatusIcon = Status.icon;

  return (
    <div className="min-h-screen brand-bg-dusk pt-[var(--header-height)]">
      <div className="max-w-screen-lg mx-auto px-4 sm:px-6 lg:px-10 pb-10 pt-8">

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
                {order.id}
              </h2>
              <p className="text-white/50 text-sm mt-1">
                Placed on {order.date}
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
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">

          {/* SHIPPING */}
          <div className="p-5 rounded-xl luxury-glass border border-white/10 bg-white/5">
            <h3 className="text-white/70 text-xs uppercase tracking-[0.18em] mb-2">
              Shipping Address
            </h3>
            <p className="text-white/90 text-sm leading-relaxed">
              {order.shippingAddress.name}<br />
              {order.shippingAddress.line1}<br />
              {order.shippingAddress.city}, {order.shippingAddress.country}<br />
              {order.shippingAddress.zip}
            </p>
          </div>

          {/* PAYMENT */}
          <div className="p-5 rounded-xl luxury-glass border border-white/10 bg-white/5">
            <h3 className="text-white/70 text-xs uppercase tracking-[0.18em] mb-2">
              Payment Method
            </h3>
            <p className="text-white/90 text-sm">{order.paymentMethod}</p>
          </div>

          {/* TRACKING */}
          <div className="p-5 rounded-xl luxury-glass border border-white/10 bg-white/5">
            <h3 className="text-white/70 text-xs uppercase tracking-[0.18em] mb-2">
              Tracking
            </h3>
            <p className="text-white/90 text-sm">
              {order.tracking ?? "Not Available"}
            </p>
          </div>

        </div>

        {/* ORDER ITEMS */}
        <div className="space-y-4 mb-12">
          {order.items.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center gap-4 p-4 rounded-xl luxury-glass border border-white/10 bg-white/5"
            >
              <img
                src={item.image}
                className="w-20 h-20 rounded-lg object-cover"
              />
              <div className="flex-1">
                <h4 className="text-white text-sm tracking-wide">{item.title}</h4>
                <p className="text-white/60 text-xs mt-1">Size: {item.size}</p>

                <p className="text-white/70 text-xs mt-1">
                  {item.price} × {item.quantity}
                </p>

                <p className="text-white text-sm font-light mt-2">
                  {(Number(item.price.replace("$", "")) * item.quantity).toFixed(2)}$
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* PRICE BREAKDOWN */}
        <div className="p-6 rounded-2xl luxury-glass border border-white/10 bg-white/5 space-y-3 mb-8">
          <div className="flex justify-between text-white/70 text-sm">
            <span>Subtotal</span>
            <span>{order.subtotal}</span>
          </div>

          <div className="flex justify-between text-white/70 text-sm">
            <span>Shipping</span>
            <span>{order.shipping}</span>
          </div>

          <div className="flex justify-between text-white/70 text-sm">
            <span>Tax</span>
            <span>{order.tax}</span>
          </div>

          <div className="border-t border-white/10 pt-3 flex justify-between text-white text-lg tracking-wide font-light">
            <span>Total</span>
            <span>{order.total}</span>
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
          <Link
            href="/support"
            className="
              w-full flex items-center justify-center gap-2
              px-6 py-3 rounded-xl
              luxury-glass border border-white/10 
              text-white/70 hover:text-white hover:bg-white/10
              transition-all text-sm uppercase tracking-[0.18em]
            "
          >
            <FiHelpCircle className="w-4 h-4" /> Need Help?
          </Link>

        </div>

      </div>
    </div>
  );
}
