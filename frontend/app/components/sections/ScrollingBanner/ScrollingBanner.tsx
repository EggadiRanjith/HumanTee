"use client";

import { motion } from "framer-motion";

const ScrollingBanner = () => {
  const messages = [
    "FREE SHIPPING ON ORDERS ABOVE ₹2000",
    "LUXURY PREMIUM CRAFTSMANSHIP",
    "HANDCRAFTED WITH PRECISION",
    "SUSTAINABLE FASHION CHOICE",
    "LIMITED EDITION COLLECTIONS",
    "EXPRESS DELIVERY AVAILABLE",
  ];

  return (
    <section className="relative w-full py-4 overflow-hidden bg-white border-y border-gray-200">
      {/* Gradient overlays for smooth fade effect */}
      <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-white to-transparent z-10"></div>
      <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white to-transparent z-10"></div>

      {/* Scrolling container */}
      <div className="relative flex items-center">
        <motion.div
          className="flex whitespace-nowrap"
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 20,
              ease: "linear",
            },
          }}
        >
          {/* Render messages twice for seamless loop */}
          {[...messages, ...messages].map((message, index) => (
            <div
              key={index}
              className="inline-flex items-center px-8 text-[11px] uppercase tracking-[0.3em] text-gray-800 font-light"
            >
              <span className="text-gray-400 mx-2">•</span>
              {message}
              <span className="text-gray-400 mx-2">•</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default ScrollingBanner;
