"use client";

import Image from "next/image";
import Link from "next/link";


interface Product {
  id: number;
  title: string;
  subtitle: string;
  price: string;
  image: string;
  badge?: "sale" | "bestseller" | "new";
  stock: number;
}

const FeaturedProducts = () => {
  const products: Product[] = [
    {
      id: 1,
      title: "Midnight Core Tee",
      subtitle: "Heavyweight 280 GSM",
      price: "₹1,299",
      image: "/images/products/drive-front.jpg",
      badge: "bestseller",
      stock: 12,
    },
    {
      id: 2,
      title: "Quantum Crest Tee",
      subtitle: "Embroidered Crest Edition",
      price: "₹1,499",
      image: "/images/products/wild-beginings-front.jpg",
      badge: "sale",
      stock: 3,
    },
    {
      id: 3,
      title: "Obsidian Logo Tee",
      subtitle: "Structured Fit",
      price: "₹1,199",
      image:
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800&auto=format",
      badge: "new",
      stock: 8,
    },
    {
      id: 4,
      title: "Storm Fade Tee",
      subtitle: "Reactive Dye Wash",
      price: "₹1,699",
      image:
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800&auto=format",
      stock: 15,
    },
  ];

  const getBadgeStyles = (badge?: Product["badge"]) => {
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

  const getBadgeLabel = (badge?: Product["badge"]) => {
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

  return (
    <section className="relative w-full pt-12 pb-20 px-4 sm:px-6 md:px-10 lg:px-14 cinematic-bg-dusk">

      {/* Ambient Aurora Glow */}
      <div
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          background:
            "radial-gradient(circle at 50% 10%, rgba(183,164,255,0.18), transparent 70%)",
          filter: "blur(120px)",
        }}
      />

      <div className="relative max-w-screen-xl mx-auto">

        {/* HEADER ROW */}
        <div className="flex items-center justify-between mb-7 sm:mb-10">
          <h2 className="text-[18px] sm:text-[28px] md:text-[34px] font-light tracking-wide text-white">
            Featured Pieces
          </h2>

          <Link
            href="/shop"
            className="
              text-white/70 text-[10px] sm:text-[12px]
              uppercase tracking-[0.22em]
              border border-white/15 rounded-full
              px-3 py-1.5 sm:px-4 sm:py-2
              hover:text-white hover:border-white/30
              transition-all luxury-glass
            "
          >
            View All
          </Link>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {products.map((item) => (
            <div
              key={item.id}
              className="group relative"
            >

              <Link
                href={`/product/${item.id}`}
                className="
                  block relative w-full aspect-[4/5]
                  overflow-hidden rounded-md 
                  luxury-glass shadow-floating motion-cinematic
                  hover:shadow-glow-violet-medium
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

                {/* BADGE */}
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

              {/* TEXT AREA */}
              <div className="mt-3 sm:mt-4 text-center">

                <h3 className="brand-text-primary text-step-0 tracking-tight font-heading">
                  {item.title}
                </h3>



                <div className="flex items-center justify-center gap-2 mt-2 mb-1">
                  <span className="text-red-400/70 text-step--1 line-through">
                    ₹1,999
                  </span>
                  <span className="brand-text-primary text-step-0 font-heading">
                    {item.price}
                  </span>
                </div>

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

        {/* MOBILE VIEW ALL */}
        <div className="sm:hidden mt-10 flex justify-center">
          <Link
            href="/shop"
            className="
              brand-text-muted text-step--1 tracking-wide 
              border border-white/10 rounded-full
              px-6 py-2 motion-cinematic luxury-glass
              hover:border-white/20 hover:brand-text-primary
            "
          >
            VIEW ALL
          </Link>
        </div>

      </div>
    </section>
  );
};

export default FeaturedProducts;
