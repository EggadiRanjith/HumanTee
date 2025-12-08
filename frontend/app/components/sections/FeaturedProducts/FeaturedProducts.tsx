"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

interface Product {
  id: number;
  title: string;
  subtitle: string;
  price: string;
  image: string;
}

const FeaturedProducts = () => {
  const products: Product[] = [
    {
      id: 1,
      title: "Midnight Core Tee",
      subtitle: "Heavyweight 280 GSM",
      price: "₹1,299",
      image: "/images/products/drive-front.jpg",
    },
    {
      id: 2,
      title: "Quantum Crest Tee",
      subtitle: "Embroidered Crest Edition",
      price: "₹1,499",
      image: "/images/products/wild-beginings-front.jpg",
    },
    {
      id: 3,
      title: "Obsidian Logo Tee",
      subtitle: "Structured Fit",
      price: "₹1,199",
      image:
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800&auto=format",
    },
    {
      id: 4,
      title: "Storm Fade Tee",
      subtitle: "Reactive Dye Wash",
      price: "₹1,699",
      image:
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800&auto=format",
    },
  ];

  return (
    <section className="relative w-full pt-12 pb-20 px-4 sm:px-6 md:px-10 lg:px-14 cinematic-bg-dusk">

      {/* Ambient Aurora Glow */}
      <motion.div
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          background:
            "radial-gradient(circle at 50% 10%, rgba(183,164,255,0.18), transparent 70%)",
          filter: "blur(120px)",
        }}
        animate={{ opacity: [0.25, 0.45, 0.25] }}
        transition={{ duration: 8, repeat: Infinity }}
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

        {/* GRID — NEW LAYOUT, OLD STYLES */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {products.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="group relative"
            >
              {/* IMAGE WRAPPER — luxury glass, floating, cinematic */}
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

                {/* Quick View — premium version */}
                <div
                  className="
                    absolute bottom-0 left-0 right-0 
                    translate-y-full group-hover:translate-y-0 
                    transition-transform duration-500 ease-cinematic
                    backdrop-blur-xl bg-brand-oblivion/60
                    border-t border-white/10
                  "
                >
                  <button className="w-full py-3 text-step--1 tracking-wide brand-text-primary">
                    QUICK VIEW
                  </button>
                </div>
              </Link>

              {/* TEXT AREA */}
              <div className="mt-3 sm:mt-4 text-center">

                {/* TITLE */}
                <Link href={`/product/${item.id}`}>
                  <h3 className="brand-text-primary text-step-0 tracking-tight font-heading">
                    {item.title}
                  </h3>
                </Link>

                {/* SUBTITLE */}
                <p className="brand-text-muted text-step--1 tracking-wide mt-0.5">
                  {item.subtitle}
                </p>

                {/* PRICE AREA */}
                <div className="flex items-center justify-center gap-2 mt-2 mb-1">
                  <span className="brand-text-dim text-step--1 line-through">
                    ₹1,999
                  </span>
                  <span className="brand-text-primary text-step-0 font-heading">
                    {item.price}
                  </span>
                </div>

                {/* STOCK — replaced orange trash with premium glow pulse */}
                <div className="flex items-center justify-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-brand-secondary animate-glowPulse shadow-glow-violet-medium"></div>
                  <span className="text-step--1 brand-text-secondary tracking-wide">
                    4 in stock
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* MOBILE VIEW ALL (styled correctly now) */}
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
