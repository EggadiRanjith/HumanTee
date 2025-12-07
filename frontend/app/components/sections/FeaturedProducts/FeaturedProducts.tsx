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
      price: "$58",
      image:
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800&auto=format",
    },
    {
      id: 2,
      title: "Quantum Crest Tee",
      subtitle: "Embroidered Crest Edition",
      price: "$62",
      image:
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800&auto=format",
    },
    {
      id: 3,
      title: "Obsidian Logo Tee",
      subtitle: "Structured Fit",
      price: "$54",
      image:
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800&auto=format",
    },
    {
      id: 4,
      title: "Storm Fade Tee",
      subtitle: "Reactive Dye Wash",
      price: "$68",
      image:
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800&auto=format",
    },
  ];

  return (
    <section className="relative w-full pt-10 pb-14 px-4 sm:px-6 md:px-10 lg:px-14">

      {/* Ambient glow */}
      <motion.div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          background:
            "radial-gradient(circle at 50% 15%, rgba(160,150,255,0.10), transparent 70%)",
          filter: "blur(70px)",
        }}
        animate={{ opacity: [0.2, 0.32, 0.2] }}
        transition={{ duration: 7, repeat: Infinity }}
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

        {/* GRID — MOBILE SUPER COMPACT */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8">
          {products.map((item) => (
            <Link
              key={item.id}
              href={`/product/${item.id}`}
              className="
                group block overflow-hidden 
                rounded-lg sm:rounded-2xl luxury-glass
                border border-white/10 backdrop-blur-xl
              "
            >
              {/* IMAGE — NOW MUCH SHORTER */}
              <div
                className="
                  relative w-full 
                  aspect-[4/3] sm:aspect-[4/5] 
                  overflow-hidden rounded-lg sm:rounded-xl
                "
              >
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="
                    object-cover 
                    transition-transform duration-700
                    group-hover:scale-[1.04]
                  "
                />

                <div className="absolute bottom-1 left-1 text-[8px] uppercase tracking-[0.2em] text-white/70">
                  {String(item.id).padStart(2, "0")}
                </div>
              </div>

              {/* TEXT CONTENT — TIGHTER */}
              <div className="p-3 sm:p-5 flex flex-col">

                <h3 className="text-white font-light text-[13px] sm:text-[18px] tracking-wide">
                  {item.title}
                </h3>

                <p className="text-white/60 text-[10px] sm:text-[12px] mt-0.5 tracking-wide">
                  {item.subtitle}
                </p>

                <div className="flex items-center justify-between mt-3 sm:mt-5">
                  <span className="text-white font-light text-[13px] sm:text-[17px]">
                    {item.price}
                  </span>

                  <span
                    className="
                      px-3 py-1 sm:px-4 sm:py-1.5
                      rounded-full border border-white/14 
                      text-white/80 text-[9px] sm:text-[10px]
                      tracking-[0.22em] uppercase luxury-glass
                    "
                  >
                    View
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* MOBILE VIEW ALL */}
        <div className="sm:hidden mt-7 flex justify-center">
          <Link
            href="/shop"
            className="
              text-white/70 text-[11px]
              uppercase tracking-[0.22em]
              border border-white/15 rounded-full
              px-6 py-2
              hover:text-white hover:border-white/30
              transition-all luxury-glass
            "
          >
            View All
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
