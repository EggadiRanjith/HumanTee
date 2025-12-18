"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FiMail, FiArrowRight, FiCheck } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import dynamic from "next/dynamic";
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { useAuth } from "@/app/context/AuthContext";

// Dynamic import with ssr: false to prevent Three.js from loading on server
const LaserFlow = dynamic(
    () => import("../components/ui/LaserFlow").then(mod => ({ default: mod.LaserFlow })),
    { ssr: false }
);

type AuthStep = 'email' | 'otp';

export default function LoginPage() {
    const router = useRouter();
    const { login: authLogin, isAuthenticated, isLoading: authLoading } = useAuth();

    const [step, setStep] = useState<AuthStep>('email');
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
    const [error, setError] = useState("");
    const [googleError, setGoogleError] = useState("");
    const [success, setSuccess] = useState("");

    // Redirect if already logged in
    useEffect(() => {
        if (!authLoading && isAuthenticated) {
            router.push('/');
        }
    }, [isAuthenticated, authLoading, router]);

    const validateEmail = (email: string) => {
        return /\S+@\S+\.\S+/.test(email);
    };

    const handleSendOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (!email.trim()) {
            setError("Email is required");
            return;
        }

        if (!validateEmail(email)) {
            setError("Please enter a valid email address");
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch('http://localhost:3001/auth/send-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            if (!response.ok) {
                throw new Error('Failed to send OTP');
            }

            setSuccess("OTP sent! Check your email.");
            setStep('otp');
        } catch (err) {
            setError("Failed to send OTP. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (!otp.trim() || otp.length !== 6) {
            setError("Please enter a valid 6-digit OTP");
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch('http://localhost:3001/auth/verify-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email,
                    otp
                }),
            });

            if (!response.ok) {
                throw new Error('Invalid OTP');
            }

            const data = await response.json();

            // Login with cart merge
            await authLogin(data.accessToken, data.user);

            setSuccess("Login successful! Redirecting...");

            // Redirect to account page
            setTimeout(() => {
                router.push('/account');
            }, 1000);
        } catch (err) {
            setError("Invalid OTP. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleLogin = async (credentialResponse: any) => {
        setGoogleLoading(true);
        setGoogleError("");
        setError("");

        try {
            const response = await fetch('http://localhost:3001/auth/google', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ idToken: credentialResponse.credential }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.error('Google login error:', errorData);
                throw new Error(errorData.message || 'Google login failed');
            }

            const data = await response.json();

            // Login with cart merge
            await authLogin(data.accessToken, data.user);

            // Redirect to account page
            router.push('/account');
        } catch (err: any) {
            console.error('Google login error:', err);
            setGoogleError(err.message || "Google login failed. Please try again.");
        } finally {
            setGoogleLoading(false);
        }
    };

    const handleBackToEmail = () => {
        setStep('email');
        setOtp("");
        setError("");
        setSuccess("");
    };

    return (
        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ""}>
            <>
                <style>
                    {`
                /* Performance optimizations */
                .laser-responsive {
                    will-change: transform;
                    transform: translate3d(-50%, -20%, 0);
                    backface-visibility: hidden;
                    -webkit-backface-visibility: hidden;
                }
                
                .card-responsive {
                    will-change: transform;
                    backface-visibility: hidden;
                    -webkit-backface-visibility: hidden;
                }
                
                @media (max-width: 768px) {
                    .laser-responsive {
                        transform: translate3d(-50%, -25%, 0) scale(0.88) !important;
                    }
                    .card-responsive {
                        top: 15% !important;
                    }
                }
                `}
                </style>

                <div
                    style={{
                        minHeight: "100vh",
                        width: "100%",
                        position: "relative",
                        backgroundColor: "#060010",
                        overflowX: "hidden",
                    }}
                >
                    <div
                        style={{
                            minHeight: "130vh",
                            position: "relative",
                            overflowY: "auto",
                            overflowX: "hidden",
                            paddingBottom: "300px",
                        }}
                    >
                        {/* LASER FIELD */}
                        <div
                            className="laser-responsive"
                            style={{
                                position: "absolute",
                                top: 0,
                                width: "100%",
                                minWidth: "1200px",
                                left: "50%",
                                transform: "translate(-50%, -20%)",
                                minHeight: "660px",
                                height: "60%",
                                zIndex: 1,
                                clipPath: "inset(20% 0 0 0)",
                            }}
                        >
                            <LaserFlow
                                horizontalBeamOffset={0}
                                color="#FF79C6"
                                dpr={1}
                            />
                        </div>

                        {/* AURA */}
                        <div
                            style={{
                                position: "absolute",
                                top: "30%",
                                left: "50%",
                                transform: "translateX(-50%)",
                                width: "90%",
                                height: "500px",
                                filter: "blur(40px)",
                                background:
                                    "radial-gradient(circle, rgba(255,121,198,0.6), rgba(255,121,198,0) 70%)",
                                zIndex: 5,
                                pointerEvents: "none",
                            }}
                        />

                        {/* CARD CONTAINER */}
                        <div
                            style={{
                                position: "absolute",
                                top: "18%",
                                left: "50%",
                                transform: "translateX(-50%)",
                                width: "94%",
                                maxWidth: "1200px",
                                height: "auto",
                                minHeight: "60%",
                                background: "linear-gradient(to bottom, rgba(6,0,16,0) 0%, rgba(6,0,16,0.8) 40%, #060010 100%)",
                                borderRadius: "0px",
                                borderWidth: "2px",
                                borderStyle: "solid",
                                borderImage: "linear-gradient(to bottom, transparent 0%, #FF79C6 50%) 1",
                                borderTop: "none",
                                zIndex: 10,
                            }}
                            className="flex flex-col lg:flex-row overflow-hidden card-responsive"
                        >
                            {/* Left Side - Branding */}
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

                            {/* Right Side - Auth Form */}
                            <div className="lg:w-1/2 p-8 lg:p-12 bg-black/20 flex flex-col justify-center relative">
                                {/* Glow for form side */}
                                <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-blue-500/5 to-transparent pointer-events-none"></div>

                                <div className="relative z-10 w-full max-w-sm mx-auto">
                                    <div className="mb-8">
                                        <h2 className="text-3xl font-bold text-white mb-2">
                                            {step === 'email' ? 'Welcome' : 'Verify OTP'}
                                        </h2>
                                        <p className="text-white/60">
                                            {step === 'email'
                                                ? 'Sign in or create an account'
                                                : `Enter the 6-digit code sent to ${email}`
                                            }
                                        </p>
                                    </div>

                                    {step === 'email' ? (
                                        <>
                                            <form onSubmit={handleSendOtp} className="space-y-6">
                                                <div>
                                                    <div className="relative group">
                                                        <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-white/70 transition-colors z-10" />
                                                        <input
                                                            type="email"
                                                            placeholder="Enter your email address"
                                                            value={email}
                                                            onChange={(e) => setEmail(e.target.value)}
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

                                            {/* Divider */}
                                            <div className="relative my-6">
                                                <div className="absolute inset-0 flex items-center">
                                                    <div className="w-full border-t border-white/10"></div>
                                                </div>
                                                <div className="relative flex justify-center text-xs uppercase">
                                                    <span className="bg-black/40 px-2 text-white/40">Or</span>
                                                </div>
                                            </div>

                                            {/* Google Login - Custom Luxury Button */}
                                            <div className="relative">
                                                {/* Custom Luxury Button */}
                                                <motion.button
                                                    whileHover={{ scale: googleLoading ? 1 : 1.02 }}
                                                    whileTap={{ scale: googleLoading ? 1 : 0.98 }}
                                                    onClick={() => {
                                                        // Trigger the hidden Google button
                                                        const googleBtn = document.querySelector('[aria-labelledby="button-label"]') as HTMLButtonElement;
                                                        if (googleBtn) googleBtn.click();
                                                    }}
                                                    disabled={googleLoading}
                                                    type="button"
                                                    className="w-full py-4 bg-gradient-to-r from-white/10 via-white/15 to-white/10 border border-white/20 text-white rounded-xl font-semibold hover:from-white/15 hover:via-white/20 hover:to-white/15 hover:border-white/30 transition-all duration-300 flex items-center justify-center gap-3 text-sm relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    {/* Shimmer effect */}
                                                    <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                                                    <FcGoogle className="w-5 h-5 relative z-10" />
                                                    <span className="relative z-10">
                                                        {googleLoading ? 'Connecting...' : 'Continue with Google'}
                                                    </span>
                                                </motion.button>

                                                {/* Hidden Google Login Component */}
                                                <div className="absolute opacity-0 pointer-events-none -z-10">
                                                    <GoogleLogin
                                                        onSuccess={handleGoogleLogin}
                                                        onError={() => {
                                                            setGoogleError("Google login failed. Please try again.");
                                                        }}
                                                        useOneTap={false}
                                                        auto_select={false}
                                                    />
                                                </div>
                                            </div>

                                            {/* Google Error Message */}
                                            {googleError && (
                                                <motion.p
                                                    initial={{ opacity: 0, y: -10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    className="text-red-400 text-xs mt-2 ml-1"
                                                >
                                                    {googleError}
                                                </motion.p>
                                            )}
                                            <div className="mt-8 space-y-4">
                                                <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
                                                    <p className="text-white/80 text-sm leading-relaxed">
                                                        <span className="font-semibold text-white">New to HumanTee?</span> No worries!
                                                        We'll create an account for you automatically.
                                                    </p>
                                                </div>

                                                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                                                    <p className="text-white/60 text-xs leading-relaxed">
                                                        <span className="font-semibold text-white/80">Passwordless login:</span> We'll send
                                                        you a one-time code via email. No passwords needed!
                                                    </p>
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <form onSubmit={handleVerifyOtp} className="space-y-6">
                                                {/* OTP Input - Classic Design */}
                                                <div>
                                                    <label className="block text-white/60 text-sm mb-3 uppercase tracking-wide">
                                                        Enter Verification Code
                                                    </label>
                                                    <input
                                                        type="text"
                                                        placeholder="000000"
                                                        value={otp}
                                                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
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
                                                    <p className="text-red-400 text-sm text-center">
                                                        {error}
                                                    </p>
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
                                                    onClick={handleBackToEmail}
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
                                                            onClick={handleSendOtp}
                                                            className="text-blue-400 hover:text-blue-300 font-semibold"
                                                        >
                                                            Resend OTP
                                                        </button>
                                                    </p>
                                                </div>
                                            </div>
                                        </>
                                    )}

                                    <p className="text-white/40 text-[10px] text-center mt-8 leading-relaxed">
                                        By continuing, you agree to our Terms of Service and Privacy Policy
                                    </p>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </>
        </GoogleOAuthProvider>
    );
}
