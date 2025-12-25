'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FiInstagram, FiMail } from 'react-icons/fi';

// Update interface
interface MaintenanceSettings {
    enabled: boolean;
    title: string;
    message: string;
    estimatedTime: string | null;
    contactEmail: string;
    brandName?: string;
    logoUrl?: string | null;
    tagline?: string;
}

export default function MaintenanceView({ initialSettings }: { initialSettings: MaintenanceSettings }) {
    // Start with server data, but allow client-side updates if needed (optional)
    const [settings] = useState(initialSettings);

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-[#1a0b2e] via-[#2d1b4e] to-black relative overflow-hidden">
            {/* Animated Background Glow */}
            <div
                className="absolute inset-0 opacity-30 pointer-events-none"
                style={{
                    background: 'radial-gradient(circle at 50% 50%, rgba(140,120,255,0.15), transparent 70%)',
                    filter: 'blur(100px)',
                    animation: 'pulse 8s ease-in-out infinite',
                }}
            />

            {/* Content */}
            <div className="relative z-10 max-w-2xl mx-auto px-6 text-center">
                {/* Logo/Brand - Matching Header/Footer Pattern */}
                <div className="mb-12 animate-fade-in flex flex-col items-center justify-center gap-4">
                    {/* Logo (if exists) */}
                    {settings.logoUrl && (
                        <img
                            src={settings.logoUrl}
                            alt={settings.brandName || 'Brand Logo'}
                            className="h-24 md:h-32 w-auto drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]"
                        />
                    )}

                    {/* Brand Name (always shown) */}
                    <h1 className="text-white font-bold text-5xl sm:text-6xl md:text-7xl tracking-[0.2em] uppercase">
                        {settings.brandName || 'HumanTee'}
                    </h1>

                    {/* Tagline (from Footer settings) */}
                    <p className="text-white/50 text-sm tracking-[0.3em] uppercase">
                        {settings.tagline || 'Premium Handcrafted T-Shirts Since 1931'}
                    </p>
                </div>

                {/* Maintenance Message */}
                <div className="space-y-6 mb-12 animate-fade-in-delay">
                    <h2 className="text-white text-4xl sm:text-5xl font-bold tracking-wide">
                        {settings.title}
                    </h2>

                    <p className="text-white/70 text-lg sm:text-xl max-w-md mx-auto leading-relaxed">
                        {settings.message}
                    </p>

                    {settings.estimatedTime && (
                        <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/5 border border-white/10 rounded-full">
                            <span className="text-2xl">⏱️</span>
                            <span className="text-white/90 font-medium">
                                Back in {settings.estimatedTime}
                            </span>
                        </div>
                    )}
                </div>

                {/* Social Links */}
                <div className="flex items-center justify-center gap-6 mb-8 animate-fade-in-delay-2">
                    <Link
                        href="https://www.instagram.com/humantee"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center w-12 h-12 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300"
                        aria-label="Instagram"
                    >
                        <FiInstagram className="w-5 h-5 text-white/70" />
                    </Link>

                    <Link
                        href={`mailto:${settings.contactEmail}`}
                        className="flex items-center justify-center w-12 h-12 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300"
                        aria-label="Email"
                    >
                        <FiMail className="w-5 h-5 text-white/70" />
                    </Link>
                </div>

                {/* Contact Info */}
                <p className="text-white/40 text-sm">
                    Need help? Contact us at{' '}
                    <Link
                        href={`mailto:${settings.contactEmail}`}
                        className="text-white/60 hover:text-white/80 underline transition-colors"
                    >
                        {settings.contactEmail}
                    </Link>
                </p>
            </div>

            {/* CSS Animations */}
            <style jsx>{`
                @keyframes fade-in {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes pulse {
                    0%, 100% {
                        opacity: 0.3;
                    }
                    50% {
                        opacity: 0.5;
                    }
                }

                .animate-fade-in {
                    animation: fade-in 1s ease-out;
                }

                .animate-fade-in-delay {
                    animation: fade-in 1s ease-out 0.3s both;
                }

                .animate-fade-in-delay-2 {
                    animation: fade-in 1s ease-out 0.6s both;
                }
            `}</style>
        </div>
    );
}
