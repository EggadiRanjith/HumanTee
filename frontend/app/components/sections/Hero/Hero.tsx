"use client";

import { motion } from "framer-motion";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden -mt-[var(--header-height)] pt-[var(--header-height)]">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
      
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <motion.h1 
          className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 brand-text-primary"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          Discover
          <br />
          Luxury
        </motion.h1>
        
        <motion.p 
          className="text-lg md:text-xl lg:text-2xl mb-8 brand-text-muted max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        >
          Experience the finest collection of premium products crafted with excellence
        </motion.p>
        
        <motion.button 
          className="luxury-glass px-8 py-4 text-lg font-medium text-white rounded-lg hover:scale-105 transition-transform duration-300"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
        >
          Shop Collection
        </motion.button>
      </div>
    </section>
  );
};

export default Hero;
