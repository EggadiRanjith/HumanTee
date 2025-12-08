"use client";

import Image from "next/image";
import Link from "next/link";
import PageContainer from "@/app/components/PageContainer";
import { motion } from "framer-motion";

type TShirt = {
  id: number;
  title: string;
  subtitle: string;
  price: string;
  image: string;
};

const tshirts: TShirt[] = [
  {
    id: 1,
    title: "Midnight Core Tee",
    subtitle: "Heavyweight 280 GSM",
    price: "₹1,299",
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1200&auto=format",
  },
  {
    id: 2,
    title: "Quantum Crest Tee",
    subtitle: "Premium Cotton Blend",
    price: "₹1,499",
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1200&auto=format",
  },
  {
    id: 3,
    title: "Obsidian Logo Tee",
    subtitle: "Structured Fit",
    price: "₹1,199",
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1200&auto=format",
  },
  {
    id: 4,
    title: "Storm Fade Tee",
    subtitle: "Reactive Dye Wash",
    price: "₹1,699",
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1200&auto=format",
  },
  {
    id: 5,
    title: "Void Graphic Tee",
    subtitle: "Silkscreen Print",
    price: "₹1,799",
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1200&auto=format",
  },
  {
    id: 6,
    title: "Eclipse Minimal Tee",
    subtitle: "Ultra-Soft Fabric",
    price: "₹1,099",
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1200&auto=format",
  },
];

export default function ShopPage() {
  return (
    <PageContainer className="cinematic-bg-dusk relative">

      {/* Ambient Glow Behind Page */}
      <motion.div
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          background:
            "radial-gradient(circle at 50% 10%, rgba(183,164,255,0.20), transparent 70%)",
          filter: "blur(120px)",
        }}
        animate={{ opacity: [0.25, 0.45, 0.25] }}
        transition={{ duration: 8, repeat: Infinity }}
      />

      <div className="relative max-w-screen-xl mx-auto px-4 sm:px-6 md:px-10 lg:px-14 pb-12">

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
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
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

                {/* Quick View — Premium Version */}
                <div
                  className="
                    absolute bottom-0 left-0 right-0
                    translate-y-full group-hover:translate-y-0
                    transition-transform duration-500 ease-cinematic
                    bg-brand-oblivion/70 backdrop-blur-xl border-t border-white/10
                  "
                >
                  <button className="w-full py-3 text-step--1 tracking-wide brand-text-primary">
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

                {/* Subtitle */}
                <p className="brand-text-muted text-step--1 tracking-wide mt-0.5">
                  {item.subtitle}
                </p>

                {/* Price */}
                <div className="flex items-center justify-center gap-2 mt-2 mb-1">
                  <span className="brand-text-dim text-step--1 line-through">
                    ₹1,999
                  </span>
                  <span className="brand-text-primary text-step-0 font-heading">
                    {item.price}
                  </span>
                </div>

                {/* Stock — Cine-glow Indicator */}
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

      </div>
    </PageContainer>
  );
}
