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
            <form
                onSubmit={onSubmit}
                className="space-y-4"
                aria-label="OTP verification form"
            >
                {/* OTP Input */}
                <div>
                    <label
                        htmlFor="otp-input"
                        className="block text-white/60 text-sm mb-3 uppercase tracking-wide"
                    >
                        Enter Verification Code
                    </label>
                    <input
                        id="otp-input"
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        placeholder="000000"
                        value={otp}
                        onChange={(e) =>
                            onOtpChange(e.target.value.replace(/\D/g, '').slice(0, 6))
                        }
                        disabled={isLoading}
                        maxLength={6}
                        autoFocus
                        required
                        autoComplete="one-time-code"
                        aria-required="true"
                        aria-invalid={!!error}
                        aria-describedby="otp-description otp-error otp-success"
                        className="w-full px-4 py-3 rounded-3xl bg-black/40 border border-white/10 text-white text-center text-2xl font-mono tracking-[0.5em] placeholder:text-white/20 placeholder:tracking-[0.5em] focus:border-white/30 focus:bg-black/60 focus:outline-none transition-all disabled:opacity-50"
                    />
                    <p
                        id="otp-description"
                        className="text-white/40 text-xs mt-3 text-center"
                    >
                        Code sent to {email}
                    </p>
                </div>

                {/* Error/Success Messages */}
                {error && (
                    <p
                        id="otp-error"
                        role="alert"
                        aria-live="assertive"
                        className="text-red-400 text-sm text-center"
                    >
                        {error}
                    </p>
                )}
                {success && (
                    <p
                        id="otp-success"
                        role="status"
                        aria-live="polite"
                        className="text-green-400 text-sm text-center flex items-center justify-center gap-2"
                    >
                        <FiCheck className="w-4 h-4" aria-hidden="true" />
                        {success}
                    </p>
                )}

                <motion.button
                    whileHover={{ scale: isLoading ? 1 : 1.02 }}
                    whileTap={{ scale: isLoading ? 1 : 0.98 }}
                    type="submit"
                    disabled={isLoading}
                    aria-busy={isLoading}
                    aria-label={isLoading ? "Verifying OTP code" : "Verify and login"}
                    className="w-full py-3 bg-white text-black rounded-3xl font-bold uppercase tracking-wider hover:bg-white/90 shadow-lg shadow-white/10 transition-all duration-300 flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed text-sm min-h-[44px]"
                >
                    {isLoading ? (
                        <>
                            <div
                                className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin"
                                role="status"
                                aria-label="Loading"
                            ></div>
                            <span>Verifying...</span>
                        </>
                    ) : (
                        <>
                            Verify & Login
                            <FiArrowRight
                                className="group-hover:translate-x-1 transition-transform"
                                aria-hidden="true"
                            />
                        </>
                    )}
                </motion.button>

                <button
                    type="button"
                    onClick={onBackToEmail}
                    aria-label="Go back to email input"
                    className="w-full text-white/60 hover:text-white text-sm transition-colors min-h-[44px]"
                >
                    ← Back to email
                </button>
            </form>

            <div className="mt-8">
                <div
                    className="bg-white/5 border border-white/10 rounded-xl p-4"
                    role="complementary"
                    aria-label="Resend OTP section"
                >
                    <p className="text-white/60 text-xs leading-relaxed text-center">
                        Didn't receive the code?{' '}
                        <button
                            onClick={onResendOtp}
                            aria-label="Resend OTP code"
                            className="text-blue-400 hover:text-blue-300 font-semibold underline decoration-transparent hover:decoration-blue-300 transition-all"
                        >
                            Resend OTP
                        </button>
                    </p>
                </div>
            </div>
        </>
    );
});
