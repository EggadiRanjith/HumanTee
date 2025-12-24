"use client";

import { FormEvent, memo, useEffect } from "react";
import { motion } from "framer-motion";
import { FiArrowRight, FiCheck } from "react-icons/fi";

interface OTPFormProps {
    email: string;
    otp: string;
    onOtpChange: (otp: string) => void;
    onSubmit: (e: FormEvent) => void;
    onBackToEmail: () => void;
    onResendOtp: (e: FormEvent) => void;
    isLoading: boolean;
    error: string;
    success: string;
}

// Phase 1.2: React.memo for render optimization
export default memo(function OTPForm({
    email,
    otp,
    onOtpChange,
    onSubmit,
    onBackToEmail,
    onResendOtp,
    isLoading,
    error,
    success,
}: OTPFormProps) {
    // Render measurement
    useEffect(() => {
        if (process.env.NODE_ENV === 'development') {
            console.count('OTPForm render');
        }
    });
    return (
        <>
            <form onSubmit={onSubmit} className="space-y-6">
                {/* OTP Input */}
                <div>
                    <label className="block text-white/60 text-sm mb-3 uppercase tracking-wide">
                        Enter Verification Code
                    </label>
                    <input
                        type="text"
                        placeholder="000000"
                        value={otp}
                        onChange={(e) =>
                            onOtpChange(e.target.value.replace(/\D/g, '').slice(0, 6))
                        }
                        disabled={isLoading}
                        maxLength={6}
                        autoFocus
                        className="w-full px-4 py-4 rounded-xl bg-black/40 border border-white/10 text-white text-center text-2xl font-mono tracking-[0.5em] placeholder:text-white/20 placeholder:tracking-[0.5em] focus:border-white/30 focus:bg-black/60 focus:outline-none transition-all disabled:opacity-50"
                    />
                    <p className="text-white/40 text-xs mt-3 text-center">
                        Code sent to {email}
                    </p>
                </div>

                {/* Error/Success Messages */}
                {error && (
                    <p className="text-red-400 text-sm text-center">{error}</p>
                )}
                {success && (
                    <p className="text-green-400 text-sm text-center flex items-center justify-center gap-2">
                        <FiCheck className="w-4 h-4" />
                        {success}
                    </p>
                )}

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
                            Verifying...
                        </>
                    ) : (
                        <>
                            Verify & Login
                            <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                        </>
                    )}
                </motion.button>

                <button
                    type="button"
                    onClick={onBackToEmail}
                    className="w-full text-white/60 hover:text-white text-sm transition-colors"
                >
                    ← Back to email
                </button>
            </form>

            <div className="mt-8">
                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                    <p className="text-white/60 text-xs leading-relaxed text-center">
                        Didn't receive the code?{' '}
                        <button
                            onClick={onResendOtp}
                            className="text-blue-400 hover:text-blue-300 font-semibold"
                        >
                            Resend OTP
                        </button>
                    </p>
                </div>
            </div>
        </>
    );
});
