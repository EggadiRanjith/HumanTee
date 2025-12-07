"use client";

import { motion } from "framer-motion";

interface Review {
  id: number;
  name: string;
  text: string;
}

const Reviews = () => {
  const reviews: Review[] = [
    {
      id: 1,
      name: "Alexander Chen",
      text: "Absolutely exceptional quality and service. This is exactly what I was looking for in a luxury shopping experience."
    },
    {
      id: 2,
      name: "Sophia Martinez",
      text: "The attention to detail and craftsmanship is outstanding. I couldn't be happier with my purchase."
    },
    {
      id: 3,
      name: "James Williams",
      text: "Premium products that exceed expectations. The shopping experience was seamless and elegant."
    }
  ];

  return (
    <section className="py-20 px-6 bg-slate-900/50">
      <div className="max-w-6xl mx-auto">
        <motion.h2 
          className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-16 brand-text-primary"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          Customer Reviews
        </motion.h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {reviews.map((review, index) => (
            <motion.div
              key={review.id}
              className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-6 md:p-8 border border-slate-700/50"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ 
                duration: 0.6, 
                delay: index * 0.1, 
                ease: "easeOut" 
              }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02 }}
            >
              {/* Avatar placeholder */}
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-slate-600 mr-4 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold brand-text-primary">
                    {review.name}
                  </h3>
                </div>
              </div>
              
              <p className="brand-text-muted leading-relaxed">
                {review.text}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Reviews;
