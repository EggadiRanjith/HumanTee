"use client";

import Image from "next/image";
import Link from "next/link";
import { FiHeart } from "react-icons/fi";
import { notFound } from "next/navigation";
import { use } from "react";
import PageContainer from "@/app/components/PageContainer";

/* ---------------------------------------------
   HUMANTEE — ULTRA-LUXURY T-SHIRT PDP (FINAL)
   Mobile-First • Editorial Minimalism • No Animation
---------------------------------------------- */

type Product = {
  id: number;
  title: string;
  subtitle: string;
  price: string;
  description: string;
  details: string[];
  sizes: string[];
  image: string;
};

const products: Product[] = [
  {
    id: 1,
    title: "Midnight Core Tee",
    subtitle: "Heavyweight 280 GSM • Signature Drop",
    price: "$58",
    description:
      "Crafted from premium heavyweight cotton, this essential tee embodies the Humantee philosophy of understated luxury. A modern boxy silhouette, exceptional hand feel, and precise structure define this wardrobe staple.",
    details: [
      "280 GSM heavyweight cotton",
      "Premium garment dye finish",
      "Structured fit that holds shape",
      "Ethically sourced materials",
      "Made in Portugal",
    ],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1200&auto=format",
  },
  // Add other products...
];

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const product = products.find((p) => p.id === parseInt(resolvedParams.id));

  if (!product) notFound();

  return (
    <PageContainer className="brand-bg-dusk">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-10 pb-4 sm:pb-6 lg:pb-8">

        {/* GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">

          {/* IMAGE SECTION */}
          <div className="w-full">
            <div className="relative aspect-[4/5] sm:aspect-[4/5] lg:aspect-[5/6] rounded-[28px] overflow-hidden luxury-glass border border-white/10 shadow-floating">
              <Image
                src={product!.image}
                alt={product!.title}
                fill
                className="object-cover"
              />

              {/* CAPTION */}
              <div className="absolute bottom-3 left-3 right-3 flex justify-between text-[10px] uppercase tracking-[0.2em] text-white/75">
                <span className="truncate">
                  {product!.subtitle.split(" • ")[0]}
                </span>
                <span>{String(product!.id).padStart(2, "0")}</span>
              </div>
            </div>
          </div>

          {/* DETAILS */}
          <div className="flex flex-col gap-6 sm:gap-8">

            {/* TITLE */}
            <div className="space-y-1">
              <h1 className="text-white text-[1.7rem] sm:text-[2.2rem] lg:text-[2.6rem] font-light tracking-wide leading-tight">
                {product!.title}
              </h1>
              <p className="text-white/60 text-[0.85rem] sm:text-[0.95rem] tracking-wide">
                {product!.subtitle}
              </p>
            </div>

            {/* PRICE */}
            <div className="text-white text-[1.6rem] sm:text-[2rem] font-light tracking-wide">
              {product!.price}
            </div>

            {/* SIZE SELECTOR */}
            <div className="space-y-3">
              <p className="text-white/70 text-xs tracking-[0.2em] uppercase">
                Select Size
              </p>

              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                {product!.sizes.map((size) => (
                  <button
                    key={size}
                    className="
                      py-2.5 rounded-lg 
                      border border-white/10 
                      luxury-glass text-white/75 
                      text-[0.75rem] uppercase tracking-[0.15em]
                    "
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex items-center gap-3 pt-2">

              <button
                className="
                  flex-1 py-3.5 sm:py-4 
                  rounded-full bg-white text-black 
                  text-[0.8rem] uppercase tracking-[0.18em] font-medium
                "
              >
                Add to Cart
              </button>

              <button
                className="
                  p-3 rounded-full luxury-glass 
                  border border-white/10 text-white/60
                "
              >
                <FiHeart className="h-5 w-5" />
              </button>

            </div>

            {/* DESCRIPTION */}
            <div className="pt-2 space-y-4">
              <div>
                <h3 className="text-white/70 text-xs uppercase tracking-[0.15em] mb-2">
                  Description
                </h3>
                <p className="text-white/65 text-[0.9rem] leading-relaxed">
                  {product!.description}
                </p>
              </div>

              {/* KEY DETAILS */}
              <div>
                <h3 className="text-white/70 text-xs uppercase tracking-[0.15em] mb-2">
                  Key Details
                </h3>

                <ul className="space-y-1.5">
                  {product!.details.map((detail, i) => (
                    <li
                      key={i}
                      className="text-white/60 text-[0.9rem] flex gap-2"
                    >
                      <span className="text-white/30">•</span>
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

          </div>
        </div>

      </div>
    </PageContainer>
  );
}
