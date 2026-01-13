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
        <>
            <style jsx>{`
                #email-input:-webkit-autofill,
                #email-input:-webkit-autofill:hover,
                #email-input:-webkit-autofill:focus,
                #email-input:-webkit-autofill:active {
                    -webkit-box-shadow: 0 0 0 1000px #060010 inset !important;
                    -webkit-text-fill-color: white !important;
                    transition: background-color 5000s ease-in-out 0s, color 5000s ease-in-out 0s !important;
                }
            `}</style>

            <form
                onSubmit={onSubmit}
                className="space-y-6"
                aria-label="Email login form"
            >
                <div>
                    <label htmlFor="email-input" className="sr-only">
                        Email address
                    </label>
                    <div className="relative group">
                        <FiMail
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-white/70 transition-colors z-10"
                            aria-hidden="true"
                        />
                        <input
                            id="email-input"
                            type="email"
                            placeholder="Enter your email address"
                            value={email}
                            onChange={(e) => onEmailChange(e.target.value)}
                            disabled={isLoading}
                            required
                            autoComplete="email"
                            aria-required="true"
                            aria-invalid={!!error}
                            aria-describedby={error ? "email-error" : success ? "email-success" : undefined}
                            className="w-full pl-12 pr-4 py-4 rounded-3xl bg-black/40 border border-white/10 text-white placeholder:text-white/40 focus:border-white/30 focus:bg-black/60 focus:outline-none transition-all text-[14px] disabled:opacity-50"
                        />
                    </div>
                    {error && (
                        <motion.p
                            id="email-error"
                            role="alert"
                            aria-live="assertive"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-red-400 text-[12px] mt-2 ml-1"
                        >
                            {error}
                        </motion.p>
                    )}
                    {success && (
                        <motion.p
                            id="email-success"
                            role="status"
                            aria-live="polite"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-green-400 text-[12px] mt-2 ml-1 flex items-center gap-2"
                        >
                            <FiCheck className="w-4 h-4" aria-hidden="true" />
                            {success}
                        </motion.p>
                    )}
                </div>

                <motion.button
                    whileHover={{ scale: (isLoading || success) ? 1 : 1.02 }}
                    whileTap={{ scale: (isLoading || success) ? 1 : 0.98 }}
                    type="submit"
                    disabled={isLoading || !!success}
                    aria-busy={isLoading}
                    aria-label={isLoading ? "Sending OTP code" : "Continue with email"}
                    className="w-full py-4 bg-white text-black rounded-3xl font-bold uppercase tracking-wider hover:bg-white/90 shadow-lg shadow-white/10 transition-all duration-300 flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed text-[12px] min-h-[48px]"
                >
                    {isLoading ? (
                        <>
                            <div
                                className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin"
                                role="status"
                                aria-label="Loading"
                            ></div>
                            <span>Sending OTP...</span>
                        </>
                    ) : success ? (
                        <>
                            <FiCheck className="w-5 h-5" aria-hidden="true" />
                            <span>OTP Sent!</span>
                        </>
                    ) : (
                        <>
                            Continue with Email
                            <FiArrowRight
                                className="group-hover:translate-x-1 transition-transform"
                                aria-hidden="true"
                            />
                        </>
                    )}
                </motion.button>
            </form>
        </>
    );
});
