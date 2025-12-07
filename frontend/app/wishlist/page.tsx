"use client";

import { motion } from "framer-motion";
import { FiHeart, FiShoppingBag, FiX } from "react-icons/fi";

export default function WishlistPage() {
  return (
    <div className="min-h-screen bg-brand-bg">
      <div className="max-w-screen-2xl mx-auto px-3 xs:px-4 sm:px-5 md:px-6 lg:px-8 pt-6 pb-24 md:pb-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.25, 1, 0.3, 1] }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <FiHeart className="w-6 h-6 text-brand-primary" />
            <h1 className="text-3xl xs:text-4xl md:text-5xl font-bold brand-text-primary">
              WISHLIST
            </h1>
          </div>
          <p className="text-brand-text-muted">
            Your saved items and favorites
          </p>
        </motion.div>

        {/* Wishlist Items */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.25, 1, 0.3, 1] }}
          className="space-y-4"
        >
          {/* Placeholder Wishlist Items */}
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1, ease: [0.25, 1, 0.3, 1] }}
              className="flex flex-col sm:flex-row gap-4 p-6 rounded-2xl luxury-glass border border-white/12 bg-white/5 backdrop-blur-xl"
            >
              {/* Product Image */}
              <div className="w-full sm:w-32 h-32 rounded-xl overflow-hidden luxury-glass border border-white/12 bg-white/5 flex-shrink-0">
                <div className="w-full h-full bg-gradient-to-br from-brand-primary/20 to-brand-secondary/20" />
              </div>

              {/* Product Details */}
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-brand-text mb-2">
                    Premium Essential {i + 1}
                  </h3>
                  <p className="text-brand-text-muted text-sm mb-3">
                    High-quality material with exceptional craftsmanship
                  </p>
                  <p className="text-brand-primary font-bold text-xl">$129.00</p>
                </div>

                {/* Actions */}
                <div className="flex gap-3 mt-4">
                  <button className="flex items-center gap-2 px-4 py-2 rounded-xl luxury-glass border border-white/12 bg-white/5 backdrop-blur-xl text-brand-text hover:bg-white/10 transition-all">
                    <FiShoppingBag className="w-4 h-4" />
                    <span className="font-medium">Add to Cart</span>
                  </button>
                  <button className="p-2 rounded-xl luxury-glass border border-red-500/20 bg-red-500/5 backdrop-blur-xl text-red-400 hover:bg-red-500/10 transition-all">
                    <FiX className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Empty State (if no items) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 0 }}
          className="text-center py-16"
        >
          <FiHeart className="w-16 h-16 text-brand-text-dim mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-brand-text mb-2">
            Your wishlist is empty
          </h3>
          <p className="text-brand-text-muted mb-6">
            Start adding items you love to see them here
          </p>
          <button className="px-6 py-3 rounded-2xl luxury-glass border border-white/12 bg-white/5 backdrop-blur-xl text-brand-text hover:bg-white/10 transition-all font-medium">
            Continue Shopping
          </button>
        </motion.div>

        {/* Wishlist Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: [0.25, 1, 0.3, 1] }}
          className="mt-8 p-6 rounded-2xl luxury-glass border border-white/12 bg-white/5 backdrop-blur-xl"
        >
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div>
              <p className="text-brand-text-muted text-sm">Total Value</p>
              <p className="text-2xl font-bold text-brand-primary">$387.00</p>
            </div>
            <button className="w-full sm:w-auto px-6 py-3 rounded-2xl luxury-glass border border-brand-primary/20 bg-brand-primary/10 backdrop-blur-xl text-brand-primary hover:bg-brand-primary/20 transition-all font-medium">
              Add All to Cart
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
