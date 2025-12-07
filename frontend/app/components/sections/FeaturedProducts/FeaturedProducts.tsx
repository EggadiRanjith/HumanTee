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
    { id: 4, name: "Silk Scarf", price: "$349" }
  ];

  return (
    <section className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.h2 
          className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-16 brand-text-primary"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          Featured Products
        </motion.h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              className="group cursor-pointer"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.6, 
                delay: index * 0.1, 
                ease: "easeOut" 
              }}
              viewport={{ once: true }}
              whileHover={{ y: -8 }}
            >
              <div className="bg-slate-800 rounded-lg overflow-hidden transition-all duration-300 group-hover:shadow-xl group-hover:shadow-black/20">
                {/* Image placeholder */}
                <div className="h-48 md:h-56 bg-slate-700 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-slate-600 to-slate-800 opacity-50" />
                </div>
                
                <div className="p-6">
                  <h3 className="text-lg font-semibold mb-2 brand-text-primary group-hover:text-white transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-xl font-bold brand-text-muted">
                    {product.price}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
