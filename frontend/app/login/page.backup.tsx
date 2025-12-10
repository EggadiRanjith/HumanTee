"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiMail, FiLock, FiEye, FiEyeOff, FiUser, FiArrowRight } from "react-icons/fi";
import { LaserFlow } from "../components/ui/LaserFlow";

export default function LoginPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        name: "",
        confirmPassword: ""
    });
    const [errors, setErrors] = useState<Record<string, string>>({});

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Invalid email format";
        }

        if (!formData.password) {
            newErrors.password = "Password is required";
        } else if (formData.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
        }

        if (!isLogin) {
            if (!formData.name.trim()) {
                newErrors.name = "Name is required";
            }
            if (formData.password !== formData.confirmPassword) {
                newErrors.confirmPassword = "Passwords do not match";
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            console.log("Form submitted:", formData);
            // Authentication logic will be added during integration
        }
    };

    return (
        <div className="min-h-screen w-full relative overflow-hidden bg-[#020205] flex items-start justify-center p-4 pt-32 lg:pt-40">
            {/* Ambient Background Glow & LaserFlow */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(59,130,246,0.1),transparent_70%)]"></div>
                <section
                    id="laser-flow-container"
                    className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] mix-blend-screen overflow-hidden border border-red-500 bg-black/50 pointer-events-auto"
                >
                    <LaserFlow
                        horizontalBeamOffset={0}
                        verticalBeamOffset={0}
                        color="#60A5FA"
                        fogIntensity={0.6}
                        wispDensity={1.2}
                        flowSpeed={0.4}
                    />
                </section>
            </div>

            {/* Main Card Container */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="w-full max-w-[1100px] relative z-10 hidden"
            >
                {/* Glass Effect Wrapper */}
                <div className="relative bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col lg:flex-row min-h-[600px]">

                    {/* Left Side - Branding */}
                    <div className="relative lg:w-1/2 p-8 lg:p-12 flex flex-col justify-between bg-gradient-to-br from-blue-900/20 to-transparent">
                        <div className="absolute inset-0 z-0 bg-black/20 pointer-events-none"></div>

                        {/* Star Field / Particle Effect Placeholder */}
                        {/* Could put LaserFlow here if desired, but might be too heavy for just half. Keeping it clean for now. */}

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

                    {/* Right Side - Login Form */}
                    <div className="lg:w-1/2 p-8 lg:p-12 bg-black/20 flex flex-col justify-center relative">
                        {/* Glow for form side */}
                        <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-blue-500/5 to-transparent pointer-events-none"></div>

                        <div className="relative z-10 w-full max-w-sm mx-auto">
                            <div className="mb-8">
                                <h2 className="text-3xl font-bold text-white mb-2">
                                    {isLogin ? "Welcome Back" : "Start Journey"}
                                </h2>
                                <p className="text-white/60">
                                    {isLogin ? "Sign in to access your account" : "Join the revolution today"}
                                </p>
                            </div>

                            {/* Toggle Tabs */}
                            <div className="flex gap-2 mb-8 p-1.5 rounded-xl bg-black/40 border border-white/5">
                                <button
                                    onClick={() => setIsLogin(true)}
                                    className={`flex-1 py-2.5 rounded-lg text-sm font-medium uppercase tracking-wider transition-all duration-300 ${isLogin
                                        ? "bg-white text-black shadow-lg"
                                        : "text-white/60 hover:text-white"
                                        }`}
                                >
                                    Login
                                </button>
                                <button
                                    onClick={() => setIsLogin(false)}
                                    className={`flex-1 py-2.5 rounded-lg text-sm font-medium uppercase tracking-wider transition-all duration-300 ${!isLogin
                                        ? "bg-white text-black shadow-lg"
                                        : "text-white/60 hover:text-white"
                                        }`}
                                >
                                    Sign Up
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <AnimatePresence>
                                    {!isLogin && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: "auto" }}
                                            exit={{ opacity: 0, height: 0 }}
                                            transition={{ duration: 0.3 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="relative group mb-4">
                                                <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-white/70 transition-colors z-10" />
                                                <input
                                                    type="text"
                                                    placeholder="Full Name"
                                                    value={formData.name}
                                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                    className="w-full pl-10 pr-4 py-3.5 rounded-xl bg-black/40 border border-white/10 text-white placeholder:text-white/40 focus:border-white/30 focus:bg-black/60 focus:outline-none transition-all text-sm"
                                                />
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <div>
                                    <div className="relative group">
                                        <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-white/70 transition-colors z-10" />
                                        <input
                                            type="email"
                                            placeholder="Email Address"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full pl-10 pr-4 py-3.5 rounded-xl bg-black/40 border border-white/10 text-white placeholder:text-white/40 focus:border-white/30 focus:bg-black/60 focus:outline-none transition-all text-sm"
                                        />
                                    </div>
                                    {errors.email && (
                                        <p className="text-red-400 text-xs mt-1 ml-1">{errors.email}</p>
                                    )}
                                </div>

                                <div>
                                    <div className="relative group">
                                        <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-white/70 transition-colors z-10" />
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Password"
                                            value={formData.password}
                                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                            className="w-full pl-10 pr-12 py-3.5 rounded-xl bg-black/40 border border-white/10 text-white placeholder:text-white/40 focus:border-white/30 focus:bg-black/60 focus:outline-none transition-all text-sm"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors z-10"
                                        >
                                            {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                                        </button>
                                    </div>
                                    {errors.password && (
                                        <p className="text-red-400 text-xs mt-1 ml-1">{errors.password}</p>
                                    )}
                                </div>

                                <AnimatePresence>
                                    {!isLogin && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: "auto" }}
                                            exit={{ opacity: 0, height: 0 }}
                                            transition={{ duration: 0.3 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="relative group mt-4">
                                                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-white/70 transition-colors z-10" />
                                                <input
                                                    type={showPassword ? "text" : "password"}
                                                    placeholder="Confirm Password"
                                                    value={formData.confirmPassword}
                                                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                                    className="w-full pl-10 pr-4 py-3.5 rounded-xl bg-black/40 border border-white/10 text-white placeholder:text-white/40 focus:border-white/30 focus:bg-black/60 focus:outline-none transition-all text-sm"
                                                />
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {isLogin && (
                                    <div className="flex justify-end">
                                        <button type="button" className="text-white/60 hover:text-white text-xs transition-colors">
                                            Forgot Password?
                                        </button>
                                    </div>
                                )}

                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    type="submit"
                                    className="w-full py-3.5 bg-white text-black rounded-xl font-bold uppercase tracking-wider hover:bg-white/90 shadow-lg shadow-white/10 transition-all duration-300 flex items-center justify-center gap-2 group mt-2 text-sm"
                                >
                                    {isLogin ? "Sign In" : "Create Account"}
                                    <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                                </motion.button>
                            </form>

                            <div className="relative my-6">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-white/10"></div>
                                </div>
                                <div className="relative flex justify-center text-xs">
                                    <span className="px-4 bg-[#0a0a0f] text-white/40 uppercase tracking-wider rounded-full">
                                        or continue with
                                    </span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-white/10 hover:bg-white/5 hover:border-white/20 transition-all"
                                >
                                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                                        <path fill="#fff" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                        <path fill="#fff" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                        <path fill="#fff" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                        <path fill="#fff" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                    </svg>
                                    <span className="text-white text-xs font-medium">Google</span>
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-white/10 hover:bg-white/5 hover:border-white/20 transition-all"
                                >
                                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="#fff">
                                        <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                                    </svg>
                                    <span className="text-white text-xs font-medium">Apple</span>
                                </motion.button>
                            </div>

                            <p className="text-white/40 text-[10px] text-center mt-6 leading-relaxed">
                                By continuing, you agree to our Terms of Service
                            </p>
                        </div>
                    </div>

                </div>
            </motion.div>
        </div>
    );
}