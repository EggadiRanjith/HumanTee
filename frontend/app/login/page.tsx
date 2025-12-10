"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FiMail, FiLock, FiEye, FiEyeOff, FiUser } from "react-icons/fi";
import Link from "next/link";

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
        <div className="min-h-screen brand-bg pt-[var(--header-height)] pb-20 flex items-center justify-center">
            <div className="w-full max-w-md mx-auto px-4 sm:px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="p-6 sm:p-8 md:p-10 rounded-2xl luxury-glass border border-white/10"
                >
                    {/* Logo/Brand */}
                    <div className="text-center mb-8">
                        <h1 className="text-white text-2xl sm:text-3xl font-light uppercase tracking-[0.2em] mb-2">
                            HumanTee
                        </h1>
                        <p className="text-white/60 text-xs sm:text-sm uppercase tracking-wider">
                            {isLogin ? "Welcome Back" : "Create Account"}
                        </p>
                    </div>

                    {/* Toggle Tabs */}
                    <div className="flex gap-2 mb-8 p-1 rounded-xl bg-white/5 border border-white/10">
                        <button
                            onClick={() => setIsLogin(true)}
                            className={`flex-1 py-3 rounded-lg text-sm uppercase tracking-wider transition-all ${isLogin
                                    ? "bg-white text-black font-medium"
                                    : "text-white/60 hover:text-white"
                                }`}
                        >
                            Login
                        </button>
                        <button
                            onClick={() => setIsLogin(false)}
                            className={`flex-1 py-3 rounded-lg text-sm uppercase tracking-wider transition-all ${!isLogin
                                    ? "bg-white text-black font-medium"
                                    : "text-white/60 hover:text-white"
                                }`}
                        >
                            Sign Up
                        </button>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Name Field (Sign Up Only) */}
                        {!isLogin && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                            >
                                <div className="relative">
                                    <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
                                    <input
                                        type="text"
                                        placeholder="Full Name"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/40 focus:border-white/30 focus:outline-none transition-colors min-h-[52px]"
                                    />
                                </div>
                                {errors.name && (
                                    <p className="text-red-400 text-xs mt-1.5 ml-1">{errors.name}</p>
                                )}
                            </motion.div>
                        )}

                        {/* Email Field */}
                        <div>
                            <div className="relative">
                                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
                                <input
                                    type="email"
                                    placeholder="Email Address"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/40 focus:border-white/30 focus:outline-none transition-colors min-h-[52px]"
                                />
                            </div>
                            {errors.email && (
                                <p className="text-red-400 text-xs mt-1.5 ml-1">{errors.email}</p>
                            )}
                        </div>

                        {/* Password Field */}
                        <div>
                            <div className="relative">
                                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full pl-12 pr-12 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/40 focus:border-white/30 focus:outline-none transition-colors min-h-[52px]"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
                                >
                                    {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="text-red-400 text-xs mt-1.5 ml-1">{errors.password}</p>
                            )}
                        </div>

                        {/* Confirm Password (Sign Up Only) */}
                        {!isLogin && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                            >
                                <div className="relative">
                                    <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Confirm Password"
                                        value={formData.confirmPassword}
                                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                        className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/40 focus:border-white/30 focus:outline-none transition-colors min-h-[52px]"
                                    />
                                </div>
                                {errors.confirmPassword && (
                                    <p className="text-red-400 text-xs mt-1.5 ml-1">{errors.confirmPassword}</p>
                                )}
                            </motion.div>
                        )}

                        {/* Forgot Password (Login Only) */}
                        {isLogin && (
                            <div className="flex justify-end">
                                <Link
                                    href="/forgot-password"
                                    className="text-white/60 hover:text-white text-xs uppercase tracking-wider transition-colors"
                                >
                                    Forgot Password?
                                </Link>
                            </div>
                        )}

                        {/* Submit Button */}
                        <motion.button
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            type="submit"
                            className="w-full py-4 bg-white text-black rounded-full text-sm uppercase tracking-wider font-medium hover:bg-white/90 transition-colors mt-8 min-h-[52px]"
                        >
                            {isLogin ? "Sign In" : "Create Account"}
                        </motion.button>
                    </form>

                    {/* Divider */}
                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-white/10"></div>
                        </div>
                        <div className="relative flex justify-center text-xs">
                            <span className="px-4 bg-[var(--bg-dusk)] text-white/40 uppercase tracking-wider">
                                Or continue with
                            </span>
                        </div>
                    </div>

                    {/* Social Login */}
                    <div className="grid grid-cols-2 gap-3">
                        <button className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-white/10 hover:bg-white/5 transition-colors min-h-[48px]">
                            <span className="text-xl">🔗</span>
                            <span className="text-white text-xs uppercase tracking-wider">Google</span>
                        </button>
                        <button className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-white/10 hover:bg-white/5 transition-colors min-h-[48px]">
                            <span className="text-xl">📱</span>
                            <span className="text-white text-xs uppercase tracking-wider">Apple</span>
                        </button>
                    </div>

                    {/* Terms */}
                    <p className="text-white/40 text-[10px] text-center mt-8 leading-relaxed">
                        By continuing, you agree to our{" "}
                        <Link href="/terms-privacy" className="text-white/60 hover:text-white transition-colors">
                            Terms of Service
                        </Link>{" "}
                        and{" "}
                        <Link href="/terms-privacy" className="text-white/60 hover:text-white transition-colors">
                            Privacy Policy
                        </Link>
                    </p>
                </motion.div>

                {/* Back to Home */}
                <div className="text-center mt-6">
                    <Link
                        href="/"
                        className="text-white/60 hover:text-white text-xs uppercase tracking-wider transition-colors"
                    >
                        ← Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
}
