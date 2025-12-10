"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiMail, FiLock, FiEye, FiEyeOff, FiUser, FiArrowRight } from "react-icons/fi";

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

    const toggleMode = () => {
        setIsLogin(!isLogin);
        setErrors({});
        setFormData({ email: "", password: "", name: "", confirmPassword: "" });
    };

    return (
        <div className="min-h-screen w-full relative overflow-hidden bg-black">
            {/* Animated Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-black via-zinc-900 to-black">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(59,130,246,0.15),transparent_50%)]"></div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(96,165,250,0.1),transparent_50%)]"></div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(147,197,253,0.08),transparent_50%)]"></div>
            </div>

            {/* Floating Orbs */}
            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.5, 0.3],
                }}
                transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                className="absolute top-20 left-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl"
            />
            <motion.div
                animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.2, 0.4, 0.2],
                }}
                transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1
                }}
                className="absolute bottom-20 right-10 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl"
            />

            {/* Main Content */}
            <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-12">
                <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-12 items-center">

                    {/* Left Side - Branding */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="hidden lg:block space-y-8"
                    >
                        <div>
                            <motion.h1
                                className="text-7xl font-bold text-white mb-4 tracking-tight"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                            >
                                HUMANTEE
                            </motion.h1>
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: "200px" }}
                                transition={{ delay: 0.5, duration: 0.8 }}
                                className="h-1 bg-gradient-to-r from-blue-500 via-blue-400 to-blue-300"
                            />
                        </div>

                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6 }}
                            className="text-2xl text-white/70 leading-relaxed"
                        >
                            Where style meets <span className="text-white font-semibold">authenticity</span>.
                            <br />
                            Express yourself through premium streetwear.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.8 }}
                            className="flex gap-6 pt-4"
                        >
                            <div className="space-y-2">
                                <div className="text-3xl font-bold text-white">10K+</div>
                                <div className="text-sm text-white/60 uppercase tracking-wider">Happy Customers</div>
                            </div>
                            <div className="w-px bg-white/20"></div>
                            <div className="space-y-2">
                                <div className="text-3xl font-bold text-white">All India</div>
                                <div className="text-sm text-white/60 uppercase tracking-wider">Shipping</div>
                            </div>
                            <div className="w-px bg-white/20"></div>
                            <div className="space-y-2">
                                <div className="text-3xl font-bold text-white">3-7 Days</div>
                                <div className="text-sm text-white/60 uppercase tracking-wider">Delivery</div>
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* Right Side - Login Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="w-full max-w-md mx-auto"
                    >
                        {/* Glass Card */}
                        <div className="relative">
                            {/* Glow Effect */}
                            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 rounded-3xl blur-xl opacity-20"></div>

                            {/* Card Content */}
                            <div className="relative bg-zinc-900/80 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 md:p-10 shadow-2xl">

                                {/* Mobile Logo */}
                                <div className="lg:hidden text-center mb-8">
                                    <h1 className="text-4xl font-bold text-white mb-2">HUMANTEE</h1>
                                    <div className="h-0.5 w-20 mx-auto bg-gradient-to-r from-blue-500 via-blue-400 to-blue-300"></div>
                                </div>

                                {/* Header */}
                                <div className="mb-8">
                                    <h2 className="text-3xl font-bold text-white mb-2">
                                        {isLogin ? "Sign In" : "Create Account"}
                                    </h2>
                                    <p className="text-white/60">
                                        {isLogin ? "Enter your credentials to continue" : "Join the HumanTee community"}
                                    </p>
                                </div>

                                {/* Toggle Tabs */}
                                <div className="flex gap-2 mb-8 p-1.5 rounded-2xl bg-black/40 border border-white/5">
                                    <button
                                        onClick={() => setIsLogin(true)}
                                        className={`flex-1 py-3 rounded-xl text-sm font-medium uppercase tracking-wider transition-all duration-300 ${isLogin
                                            ? "bg-white text-black shadow-lg"
                                            : "text-white/60 hover:text-white"
                                            }`}
                                    >
                                        Login
                                    </button>
                                    <button
                                        onClick={() => setIsLogin(false)}
                                        className={`flex-1 py-3 rounded-xl text-sm font-medium uppercase tracking-wider transition-all duration-300 ${!isLogin
                                            ? "bg-white text-black shadow-lg"
                                            : "text-white/60 hover:text-white"
                                            }`}
                                    >
                                        Sign Up
                                    </button>
                                </div>

                                {/* Form */}
                                <form onSubmit={handleSubmit} className="space-y-5">

                                    {/* Name Field (Sign Up Only) */}
                                    <AnimatePresence>
                                        {!isLogin && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: "auto" }}
                                                exit={{ opacity: 0, height: 0 }}
                                                transition={{ duration: 0.3 }}
                                            >
                                                <div className="relative group">
                                                    <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-white/70 transition-colors z-10" />
                                                    <input
                                                        type="text"
                                                        placeholder="Full Name"
                                                        value={formData.name}
                                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                        className="w-full pl-12 pr-4 py-4 rounded-xl bg-black/40 border border-white/10 text-white placeholder:text-white/40 focus:border-white/30 focus:bg-black/60 focus:outline-none transition-all"
                                                    />
                                                </div>
                                                {errors.name && (
                                                    <motion.p
                                                        initial={{ opacity: 0, y: -10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        className="text-red-400 text-xs mt-2 ml-1"
                                                    >
                                                        {errors.name}
                                                    </motion.p>
                                                )}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    {/* Email Field */}
                                    <div>
                                        <div className="relative group">
                                            <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-white/70 transition-colors z-10" />
                                            <input
                                                type="email"
                                                placeholder="Email Address"
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                className="w-full pl-12 pr-4 py-4 rounded-xl bg-black/40 border border-white/10 text-white placeholder:text-white/40 focus:border-white/30 focus:bg-black/60 focus:outline-none transition-all"
                                            />
                                        </div>
                                        {errors.email && (
                                            <motion.p
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="text-red-400 text-xs mt-2 ml-1"
                                            >
                                                {errors.email}
                                            </motion.p>
                                        )}
                                    </div>

                                    {/* Password Field */}
                                    <div>
                                        <div className="relative group">
                                            <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-white/70 transition-colors z-10" />
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                placeholder="Password"
                                                value={formData.password}
                                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                                className="w-full pl-12 pr-12 py-4 rounded-xl bg-black/40 border border-white/10 text-white placeholder:text-white/40 focus:border-white/30 focus:bg-black/60 focus:outline-none transition-all"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors z-10"
                                            >
                                                {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                                            </button>
                                        </div>
                                        {errors.password && (
                                            <motion.p
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="text-red-400 text-xs mt-2 ml-1"
                                            >
                                                {errors.password}
                                            </motion.p>
                                        )}
                                    </div>

                                    {/* Confirm Password (Sign Up Only) */}
                                    <AnimatePresence>
                                        {!isLogin && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: "auto" }}
                                                exit={{ opacity: 0, height: 0 }}
                                                transition={{ duration: 0.3 }}
                                            >
                                                <div className="relative group">
                                                    <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-white/70 transition-colors z-10" />
                                                    <input
                                                        type={showPassword ? "text" : "password"}
                                                        placeholder="Confirm Password"
                                                        value={formData.confirmPassword}
                                                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                                        className="w-full pl-12 pr-4 py-4 rounded-xl bg-black/40 border border-white/10 text-white placeholder:text-white/40 focus:border-white/30 focus:bg-black/60 focus:outline-none transition-all"
                                                    />
                                                </div>
                                                {errors.confirmPassword && (
                                                    <motion.p
                                                        initial={{ opacity: 0, y: -10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        className="text-red-400 text-xs mt-2 ml-1"
                                                    >
                                                        {errors.confirmPassword}
                                                    </motion.p>
                                                )}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    {/* Forgot Password (Login Only) */}
                                    {isLogin && (
                                        <div className="flex justify-end">
                                            <button
                                                type="button"
                                                className="text-white/60 hover:text-white text-sm transition-colors"
                                            >
                                                Forgot Password?
                                            </button>
                                        </div>
                                    )}

                                    {/* Submit Button */}
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        type="submit"
                                        className="w-full py-4 bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 text-white rounded-xl font-semibold uppercase tracking-wider hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-300 flex items-center justify-center gap-2 group mt-6"
                                    >
                                        {isLogin ? "Sign In" : "Create Account"}
                                        <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                                    </motion.button>
                                </form>

                                {/* Divider */}
                                <div className="relative my-8">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-white/10"></div>
                                    </div>
                                    <div className="relative flex justify-center text-xs">
                                        <span className="px-4 bg-zinc-900 text-white/40 uppercase tracking-wider">
                                            Or continue with
                                        </span>
                                    </div>
                                </div>

                                {/* Social Login */}
                                <div className="grid grid-cols-2 gap-4">
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="flex items-center justify-center gap-3 py-3.5 px-4 rounded-xl border border-white/10 hover:bg-white/5 hover:border-white/20 transition-all"
                                    >
                                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                                            <path fill="#fff" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                            <path fill="#fff" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                            <path fill="#fff" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                            <path fill="#fff" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                        </svg>
                                        <span className="text-white text-sm font-medium">Google</span>
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="flex items-center justify-center gap-3 py-3.5 px-4 rounded-xl border border-white/10 hover:bg-white/5 hover:border-white/20 transition-all"
                                    >
                                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#fff">
                                            <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                                        </svg>
                                        <span className="text-white text-sm font-medium">Apple</span>
                                    </motion.button>
                                </div>

                                {/* Terms */}
                                <p className="text-white/40 text-xs text-center mt-8 leading-relaxed">
                                    By continuing, you agree to our Terms of Service and Privacy Policy
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
