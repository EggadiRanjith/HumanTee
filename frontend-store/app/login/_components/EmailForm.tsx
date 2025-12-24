"use client";

import { FormEvent, memo, useEffect } from "react";
import { motion } from "framer-motion";
import { FiMail, FiArrowRight, FiCheck } from "react-icons/fi";

interface EmailFormProps {
    email: string;
    onEmailChange: (email: string) => void;
    onSubmit: (e: FormEvent) => void;
    isLoading: boolean;
    error: string;
    success: string;
}

// Phase 1.2: React.memo for render optimization
export default memo(function EmailForm({
    email,
    onEmailChange,
    onSubmit,
    isLoading,
    error,
    success,
}: EmailFormProps) {
    // Render measurement
    useEffect(() => {
        if (process.env.NODE_ENV === 'development') {
            console.count('EmailForm render');
        }
    });
    return (
        <form onSubmit={onSubmit} className="space-y-6">
            <div>
                <div className="relative group">
                    <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-white/70 transition-colors z-10" />
                    <input
                        type="email"
                        placeholder="Enter your email address"
                        value={email}
                        onChange={(e) => onEmailChange(e.target.value)}
                        disabled={isLoading}
                        className="w-full pl-12 pr-4 py-4 rounded-xl bg-black/40 border border-white/10 text-white placeholder:text-white/40 focus:border-white/30 focus:bg-black/60 focus:outline-none transition-all text-sm disabled:opacity-50"
                    />
                </div>
                {error && (
                    <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-400 text-xs mt-2 ml-1"
                    >
                        {error}
                    </motion.p>
                )}
                {success && (
                    <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-green-400 text-xs mt-2 ml-1 flex items-center gap-2"
                    >
                        <FiCheck className="w-4 h-4" />
                        {success}
                    </motion.p>
                )}
            </div>

            <motion.button
                whileHover={{ scale: isLoading ? 1 : 1.02 }}
                whileTap={{ scale: isLoading ? 1 : 0.98 }}
                type="submit"
                disabled={isLoading}
                className="w-full py-4 bg-white text-black rounded-xl font-bold uppercase tracking-wider hover:bg-white/90 shadow-lg shadow-white/10 transition-all duration-300 flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
                {isLoading ? (
                    <>
                        <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin"></div>
                        Sending OTP...
                    </>
                ) : (
                    <>
                        Continue with Email
                        <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                    </>
                )}
            </motion.button>
        </form>
    );
});
