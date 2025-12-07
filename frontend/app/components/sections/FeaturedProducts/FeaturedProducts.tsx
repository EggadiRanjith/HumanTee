"use client";

import { motion } from "framer-motion";

interface Product {
  id: number;
  name: string;
  price: string;
}

const FeaturedProducts = () => {
  const products: Product[] = [
    { id: 1, name: "Luxury Watch", price: "$2,499" },
    { id: 2, name: "Designer Bag", price: "$1,899" },
    { id: 3, name: "Premium Sunglasses", price: "$599" },
    { id: 4, name: "Silk Scarf", price: "$349" },
  ];

  return (
    <section className="py-24 px-6 md:px-10 lg:px-16 relative overflow-hidden">

      {/* SUBTLE CINEMATIC BACKGROUND */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0 opacity-[0.16]"
          style={{
            background:
              "radial-gradient(circle at 50% 20%, rgba(180,170,255,0.12), transparent 70%)",
            filter: "blur(120px)",
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        
        {/* ---- TITLE ---- */}
        <div className="text-center mb-16">
          <h2
            className="
              text-[32px] sm:text-[40px] md:text-[52px] lg:text-[64px]
              font-geist font-light
              tracking-wide leading-tight
              text-white
            "
          >
            Featured Collection
          </h2>

          <motion.div
            className="h-[1px] w-32 mx-auto mt-4 bg-white/20"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.25, 1, 0.3, 1] }}
          />
        </div>

        {/* ---- PRODUCT GRID ---- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-14">
          {products.map((product, index) => (
            <div
              key={product.id}
              className="
                luxury-glass rounded-3xl
                border border-white/10 backdrop-blur-xl
                overflow-hidden
                group cursor-pointer
                transition-all duration-700
              "
            >
              <div className="flex flex-col sm:flex-row h-full">

                {/* ---- IMAGE AREA (CINEMATIC PLACEHOLDER) ---- */}
                <div className="sm:w-2/5 h-52 sm:h-auto relative overflow-hidden bg-black/20">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-20 h-20 rounded-full border border-white/20 flex items-center justify-center">
                      <div className="w-10 h-10 rounded-full bg-white/10"></div>
                    </div>
                  </div>

                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30" />
                </div>

                {/* ---- TEXT AREA ---- */}
                <div className="sm:w-3/5 p-6 md:p-8 lg:p-10 flex flex-col justify-center">
                  <h3
                    className="
                      text-xl md:text-2xl lg:text-3xl
                      text-white font-medium font-geist
                      tracking-wide mb-2
                    "
                  >
                    {product.name}
                  </h3>

                  <p
                    className="
                      text-white/60 font-geist text-sm md:text-base
                      leading-relaxed mb-6
                    "
                  >
                    Refined craftsmanship designed for those who appreciate true elegance.
                  </p>

                  <div className="flex items-center justify-between mt-auto">
                    <span
                      className="
                        text-lg md:text-xl lg:text-2xl
                        font-semibold text-white tracking-wide
                      "
                    >
                      {product.price}
                    </span>

                    {/* CTA BUTTON */}
                    <button
                      className="
                        px-5 py-2 rounded-full
                        border border-white/20
                        text-xs md:text-sm
                        tracking-[0.18em] uppercase font-semibold
                        text-white/80
                        luxury-glass
                      "
                    >
                      Discover
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default FeaturedProducts;
