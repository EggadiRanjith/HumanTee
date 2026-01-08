"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/app/context/AuthContext";

type Step = "email" | "otp";

export default function AdminLoginPage() {
    const router = useRouter();
    const { verifyOtp } = useAuth();  // Use verifyOtp from context

    const [step, setStep] = useState<Step>("email");
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: "error" | "success"; text: string } | null>(null);

    const [brandName, setBrandName] = useState("HumanTee");
    const [logo, setLogo] = useState<string>("/images/humantee-logo.png"); // Default to local logo

    // Fetch brand config (non-blocking, silent fail)
    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/public/settings/header-footer`)
            .then(res => res.ok ? res.json() : null)
            .then(data => {
                if (data?.success) {
                    setBrandName(data.data?.brand_name || "HumanTee");
                    // Only override logo if API provides one
                    if (data.data?.logo_url) {
                        setLogo(data.data.logo_url);
                    }
                }
            })
            .catch(() => { });
    }, []);

    const sendOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);

        if (!/\S+@\S+\.\S+/.test(email)) {
            setMessage({ type: "error", text: "Enter a valid email address" });
            return;
        }

        setLoading(true);

        // Send OTP and wait for response before navigating
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/admin/send-otp`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            if (res.ok) {
                const data = await res.json();
                // Only navigate to OTP page if request was successful
                setStep("otp");
                setMessage({ type: "success", text: "Verification code sent to your email" });
            } else {
                // Parse error message from backend
                let errorMessage = "Failed to send code. Please try again.";
                try {
                    const errorData = await res.json();
                    errorMessage = errorData.message || errorMessage;
                } catch {
                    // If JSON parsing fails, use default message
                }

                // Show user-friendly error on current (email) page
                setMessage({
                    type: "error",
                    text: errorMessage
                });
            }
        } catch (error) {
            // Show user-friendly error on current (email) page
            setMessage({
                type: "error",
                text: "Unable to connect to server. Please check your internet connection and try again."
            });
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);

        if (otp.length !== 6) {
            setMessage({ type: "error", text: "Enter the 6-digit code" });
            return;
        }

        setLoading(true);
        try {
            // Use AuthContext's verifyOtp function (handles httpOnly cookies)
            await verifyOtp(email, otp);

            // If successful, redirect to post-login
            // Small delay to ensure cookies are set
            setTimeout(() => {
                router.push("/post-login");
            }, 100);
        } catch (error) {
            setMessage({
                type: "error",
                text: error instanceof Error ? error.message : "Invalid or expired code"
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-300 via-gray-500 to-black flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-xl border border-gray-200 p-6 sm:p-8 shadow-sm">

                    {/* Header */}
                    <div className="text-center mb-6">
                        <div className="mx-auto mb-4 h-16 w-16 rounded-lg bg-black flex items-center justify-center">
                            <img
                                src={logo}
                                alt={brandName}
                                className="w-12 h-12 object-contain"
                            />
                        </div>

                        <h1 className="text-xl font-semibold text-black">{brandName}</h1>
                        <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">
                            Admin Access
                        </p>
                        <p className="text-sm text-gray-600 mt-3">
                            {step === "email" ? "Sign in with your email" : `Code sent to ${email}`}
                        </p>
                    </div>

                    {/* Forms */}
                    {step === "email" ? (
                        <form onSubmit={sendOtp} className="space-y-4">
                            <input
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                placeholder="admin@company.com"
                                disabled={loading}
                                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-black focus:border-black focus:ring-2 focus:ring-black/20 outline-none"
                                autoFocus
                            />

                            {message && (
                                <div className={`rounded-lg px-4 py-3 text-sm ${message.type === "error"
                                    ? "bg-red-50 text-red-700 border border-red-200"
                                    : "bg-green-50 text-green-700 border border-green-200"
                                    }`}>
                                    {message.text}
                                </div>
                            )}

                            <button
                                disabled={loading}
                                className="w-full rounded-lg bg-black py-3 text-white font-medium hover:bg-gray-900 disabled:opacity-60"
                            >
                                {loading ? "Sending…" : "Continue"}
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleVerifyOtp} className="space-y-4">
                            <input
                                type="text"
                                inputMode="numeric"
                                value={otp}
                                onChange={e => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                                placeholder="••••••"
                                disabled={loading}
                                className="w-full text-center text-2xl tracking-widest font-mono rounded-lg border border-gray-300 px-4 py-3 focus:border-black focus:ring-2 focus:ring-black/20 outline-none"
                                autoFocus
                            />

                            {message && (
                                <div className={`rounded-lg px-4 py-3 text-sm ${message.type === "error"
                                    ? "bg-red-50 text-red-700 border border-red-200"
                                    : "bg-green-50 text-green-700 border border-green-200"
                                    }`}>
                                    {message.text}
                                </div>
                            )}

                            <button
                                disabled={loading}
                                className="w-full rounded-lg bg-black py-3 text-white font-medium hover:bg-gray-900 disabled:opacity-60"
                            >
                                {loading ? "Verifying…" : "Verify & Login"}
                            </button>

                            <button
                                type="button"
                                onClick={() => {
                                    setStep("email");
                                    setOtp("");
                                    setMessage(null);
                                }}
                                className="w-full text-sm text-gray-500 hover:text-black"
                            >
                                ← Change email
                            </button>
                        </form>
                    )}
                </div>

                <p className="mt-6 text-center text-xs text-gray-500">
                    Secure Admin Access
                </p>
            </div>
        </div>
    );
}
