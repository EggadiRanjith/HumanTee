"use client";

import Image from "next/image";
import Link from "next/link";



type TShirt = {
  id: number;
  title: string;
  subtitle: string;
  price: string;
  image: string;
  badge?: "sale" | "bestseller" | "new";
  stock: number;
};

const tshirts: TShirt[] = [
  {
    id: 1,
    title: "Midnight Core Tee",
    subtitle: "Heavyweight 280 GSM",
    price: "₹1,299",
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1200&auto=format",
    badge: "bestseller",
    stock: 12,
  },
  {
    id: 2,
    title: "Quantum Crest Tee",
    subtitle: "Premium Cotton Blend",
    price: "₹1,499",
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1200&auto=format",
    badge: "sale",
    stock: 3,
  },
  {
    id: 3,
    title: "Obsidian Logo Tee",
    subtitle: "Structured Fit",
    price: "₹1,199",
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1200&auto=format",
    badge: "new",
    stock: 8,
  },
  {
    id: 4,
    title: "Storm Fade Tee",
    subtitle: "Reactive Dye Wash",
    price: "₹1,699",
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1200&auto=format",
    stock: 15,
  },
  {
    id: 5,
    title: "Void Graphic Tee",
    subtitle: "Silkscreen Print",
    price: "₹1,799",
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1200&auto=format",
    stock: 6,
  },
  {
    id: 6,
    title: "Eclipse Minimal Tee",
    subtitle: "Ultra-Soft Fabric",
    price: "₹1,099",
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1200&auto=format",
    stock: 20,
  },
];

const getBadgeStyles = (badge?: TShirt["badge"]) => {
  switch (badge) {
    case "sale":
      return "bg-red-500 text-white shadow-red-500/40";
    case "bestseller":
      return "bg-amber-300 text-black shadow-amber-300/50";
    case "new":
      return "bg-emerald-400 text-black shadow-emerald-400/40";
    default:
      return "";
  }
};

const getBadgeLabel = (badge?: TShirt["badge"]) => {
  switch (badge) {
    case "sale":
      return "SALE";
    case "bestseller":
      return "BESTSELLER";
    case "new":
      return "NEW";
    default:
      return "";
  }
};

const getStockColor = (stock: number) => {
  if (stock <= 3) {
    return {
      dot: "bg-red-400/70",
      text: "text-red-400/80",
      label: "Low Stock"
    };
  } else if (stock <= 8) {
    return {
      dot: "bg-amber-400/70",
      text: "text-amber-400/80",
      label: "Limited Stock"
    };
  } else {
    return {
      dot: "bg-emerald-400/70",
      text: "text-emerald-400/80",
      label: "In Stock"
    };
  }
};

export default function ShopPage() {
  return (
    <div className="min-h-screen cinematic-bg-dusk relative pt-[var(--header-height)]">

      {/* Ambient Glow Behind Page */}
      <div
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          background:
            "radial-gradient(circle at 50% 10%, rgba(183,164,255,0.20), transparent 70%)",
          filter: "blur(120px)",
        }}
      />

      <div className="relative max-w-screen-xl mx-auto px-4 sm:px-6 md:px-10 lg:px-14 pb-12 pt-12">

        {/* PAGE TITLE */}
        <div className="mb-8 sm:mb-10">
          <h1
            className="
              text-[22px] sm:text-[30px] lg:text-[38px]
              font-light uppercase tracking-[0.14em]
              brand-text-primary
            "
          >
            All Products
          </h1>

          <p
            className="
              brand-text-muted 
              text-[10px] sm:text-[11px] uppercase 
              tracking-[0.22em] mt-2
            "
          >
            Explore our premium collections
          </p>
        </div>

        {/* GRID — NEW LAYOUT + CINEMATIC STYLING */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {tshirts.map((item, index) => (
            <div
              key={item.id}
              className="group relative"
            >
              {/* IMAGE WRAPPER */}
              <Link
                href={`/product/${item.id}`}
                className="
                  block relative w-full aspect-[4/5] overflow-hidden
                  rounded-md luxury-glass shadow-floating 
                  motion-cinematic hover:shadow-glow-violet-medium
                "
              >
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="
                    object-cover motion-luxury-slow 
                    group-hover:scale-[1.05]
                  "
                />

                {item.badge && (
                  <span
                    className={`
                      absolute top-3 left-3
                      rounded-full px-3 py-1
                      text-[10px] uppercase tracking-wider font-medium
                      ${getBadgeStyles(item.badge)}
                    `}
                  >
                    {getBadgeLabel(item.badge)}
                  </span>
                )}

                {/* Quick View - Desktop Only */}
                <div
                  className="
                    absolute bottom-0 left-0 right-0
                    translate-y-full group-hover:translate-y-0
                    transition-transform duration-500 ease-cinematic
                    bg-[#050512]
                    border-t border-white/10
                    hidden md:block
                  "
                >
                  <button className="w-full py-3 text-step--1 tracking-wide text-white font-bold">
                    QUICK VIEW
                  </button>
                </div>
              </Link>

              {/* TEXT CONTENT */}
              <div className="mt-3 sm:mt-4 text-center">

                {/* Title */}
                <Link href={`/product/${item.id}`}>
                  <h3 className="brand-text-primary text-step-0 tracking-tight font-heading">
                    {item.title}
                  </h3>
                </Link>



                {/* Price */}
                <div className="flex items-center justify-center gap-2 mt-2 mb-1">
                  <span className="text-red-400/70 text-step--1 line-through">
                    ₹1,999
                  </span>
                  <span className="brand-text-primary text-step-0 font-heading">
                    {item.price}
                  </span>
                </div>

                {/* Stock - Dynamic Color Based on Count */}
                <div className="flex items-center justify-center gap-2">
                  <div className="relative">
                    <div className={`w-2 h-2 rounded-full ${getStockColor(item.stock).dot} animate-pulse`}></div>
                    <div className={`absolute inset-0 w-2 h-2 rounded-full ${getStockColor(item.stock).dot} animate-ping opacity-75`}></div>
                  </div>
                  <span className={`text-step--1 ${getStockColor(item.stock).text} tracking-wide font-medium`}>
                    {item.stock} in stock
                  </span>
                </div>

              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
