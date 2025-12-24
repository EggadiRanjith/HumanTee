"use client";

import { motion } from "framer-motion";

export default function LoginBranding() {
    return (
        <div className="relative hidden lg:flex lg:w-1/2 p-8 lg:p-12 flex-col justify-between bg-gradient-to-br from-blue-900/20 to-transparent">
            <div className="absolute inset-0 z-0 bg-black/20 pointer-events-none"></div>

            <div className="relative z-10">
                <motion.h1
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-4xl font-bold text-white mb-2 tracking-tight"
                >
                    HUMANTEE
                </motion.h1>
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "80px" }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                    className="h-1 bg-gradient-to-r from-blue-500 via-blue-400 to-blue-300 mb-8"
                />

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-xl text-white/70 leading-relaxed max-w-md hidden lg:block"
                >
                    Where style meets <span className="text-white font-semibold">authenticity</span>.
                    Express yourself through premium streetwear.
                </motion.p>
            </div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="relative z-10 hidden lg:flex gap-6 pt-12"
            >
                <div className="space-y-1">
                    <div className="text-2xl font-bold text-white">10K+</div>
                    <div className="text-xs text-white/50 uppercase tracking-wider">Happy Customers</div>
                </div>
                <div className="w-px bg-white/10"></div>
                <div className="space-y-1">
                    <div className="text-2xl font-bold text-white">All India</div>
                    <div className="text-xs text-white/50 uppercase tracking-wider">Shipping</div>
                </div>
            </motion.div>

            {/* Decorative circle */}
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
        </div>
    );
}
