"use client";

import Image from "next/image";
import Link from "next/link";
import { FiHeart, FiShoppingBag } from "react-icons/fi";
import PageContainer from "@/app/components/PageContainer";

/* ---------------------------------------------
   HUMANTEE — T-SHIRT COLLECTION PAGE (SIGNATURE)
   Luxury Editorial Layout • No Animation
---------------------------------------------- */

type TShirt = {
  id: number;
  title: string;
  caption: string;
  price: string;
  note: string;
  image: string;
};

const tshirts: TShirt[] = [
  {
    id: 1,
    title: "Midnight Core Tee",
    caption: "Heavyweight 280 GSM",
    price: "$58",
    note: "Signature Drop • Matte Black",
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1200&auto=format",
  },
  {
    id: 2,
    title: "Quantum Crest Tee",
    caption: "Premium Cotton Blend",
    price: "$62",
    note: "Embroidered Crest • Limited",
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1200&auto=format",
  },
  {
    id: 3,
    title: "Obsidian Logo Tee",
    caption: "Structured Fit",
    price: "$54",
    note: "Clean Typography • Blackout",
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1200&auto=format",
  },
  {
    id: 4,
    title: "Storm Fade Tee",
    caption: "Reactive Dye Wash",
    price: "$68",
    note: "Every Piece Unique",
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1200&auto=format",
  },
  {
    id: 5,
    title: "Void Graphic Tee",
    caption: "Silkscreen Print",
    price: "$72",
    note: "Art Series • Edition 01",
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1200&auto=format",
  },
  {
    id: 6,
    title: "Eclipse Minimal Tee",
    caption: "Ultra-Soft Fabric",
    price: "$49",
    note: "Daily Essential • Comfort Fit",
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1200&auto=format",
  },
];

export default function ShopPage() {
  return (
    <PageContainer className="brand-bg-dusk">
      <div className="max-w-screen-2xl mx-auto px-3 sm:px-6 lg:px-10 pb-4 sm:pb-6 lg:pb-8">

        {/* GRID */}
        <div
          className="
            grid
            grid-cols-1
            sm:grid-cols-2
            lg:grid-cols-3
            gap-5 sm:gap-8
          "
        >
          {tshirts.map((item, index) => (
            <TShirtCard key={item.id} item={item} index={index} />
          ))}
        </div>

      </div>
    </PageContainer>
  );
}

function TShirtCard({ item, index }: { item: TShirt; index: number }) {
  return (
    <Link href={`/product/${item.id}`} className="contents">
      <article
        className={`
          rounded-3xl overflow-hidden 
          luxury-glass border border-white/10 shadow-floating 
          flex flex-col

          ${index === 0 ? "lg:col-span-2 lg:row-span-2" : ""}
        `}
      >
        {/* IMAGE */}
        <div
          className={`
            relative w-full 
            aspect-[4/5] sm:aspect-[4/5] 
            ${index === 0 ? "lg:aspect-[5/8]" : "lg:aspect-[5/6]"}
          `}
        >
          <Image
            src={item.image}
            alt={item.title}
            fill
            className="object-cover"
          />

          <div
            className="
              absolute bottom-3 left-3 right-3 
              flex justify-between items-center
              text-white/80 
              uppercase tracking-[0.22em] 
              text-[10px]
            "
          >
            <span className="truncate">{item.caption}</span>
            <span>{String(item.id).padStart(2, "0")}</span>
          </div>
        </div>

        {/* DETAILS */}
        <div className="px-4 py-4 sm:px-6 sm:py-6 flex flex-col gap-3">

          <h3 className="
            text-white 
            text-[1.05rem] sm:text-[1.2rem] 
            leading-tight tracking-wide
          ">
            {item.title}
          </h3>

          <p className="
            text-white/60 
            text-[0.78rem] sm:text-[0.9rem]
            tracking-wide
          ">
            {item.note}
          </p>

          <div className="flex justify-between items-center mt-2">

            <span className="
              text-white 
              text-[1.05rem] sm:text-[1.2rem] 
              tracking-wide
            ">
              {item.price}
            </span>

            <div className="flex items-center gap-2">
              <button className="
                p-2.5 rounded-full luxury-glass 
                border border-white/10 text-white/70
              ">
                <FiHeart className="h-4 w-4" />
              </button>

              <button className="
                px-4 py-2 rounded-full luxury-glass 
                border border-white/10
                text-[10px] uppercase tracking-[0.24em]
                text-white/75
              ">
                <FiShoppingBag className="inline h-3 w-3 mr-1" />
                Add
              </button>
            </div>

          </div>

        </div>
      </article>
    </Link>
  );
}
