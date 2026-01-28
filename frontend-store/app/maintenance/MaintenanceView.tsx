'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FiInstagram, FiMail } from 'react-icons/fi';

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
    const [settings] = useState(initialSettings);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const handleRefresh = () => {
        setIsRefreshing(true);
        window.location.href = '/';
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-[#1a0b2e] via-[#2d1b4e] to-black relative overflow-hidden">
            {/* Animated Background Glow */}
            <div
                className="absolute inset-0 opacity-20 sm:opacity-30 pointer-events-none"
                style={{
                    background: 'radial-gradient(circle at 50% 50%, rgba(140,120,255,0.15), transparent 70%)',
                    filter: 'blur(40px)',
                    animation: 'pulse 8s ease-in-out infinite',
                }}
            />

            {/* Content */}
            <div className="relative z-10 w-full max-w-2xl mx-auto px-4 py-8 sm:px-6 sm:py-12 md:px-8">
                <div className="text-center space-y-6 sm:space-y-8 md:space-y-10">

                    {/* Logo/Brand Section */}
                    <div className="animate-fade-in space-y-3 sm:space-y-4">
                        {settings.logoUrl && (
                            <div className="flex justify-center">
                                <Image
                                    src={settings.logoUrl}
                                    alt={settings.brandName || 'Brand Logo'}
                                    width={256}
                                    height={128}
                                    className="h-14 sm:h-20 md:h-24 lg:h-28 xl:h-32 w-auto drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]"
                                    priority
                                />
                            </div>
                        )}

                        <h1 className="text-white font-bold uppercase leading-tight px-2 text-3xl tracking-[0.12em] xs:text-4xl xs:tracking-[0.14em] sm:text-5xl sm:tracking-[0.16em] md:text-6xl md:tracking-[0.18em] lg:text-7xl lg:tracking-[0.2em] break-words">
                            {settings.brandName || 'HumanTee'}
                        </h1>

                        <p className="text-white/50 uppercase leading-relaxed px-2 text-[10px] tracking-[0.18em] xs:text-xs xs:tracking-[0.2em] sm:text-sm sm:tracking-[0.25em] md:tracking-[0.3em]">
                            {settings.tagline || 'Premium Handcrafted T-Shirts Since 1931'}
                        </p>
                    </div>

                    {/* Maintenance Message */}
                    <div className="animate-fade-in-delay space-y-4 sm:space-y-5 md:space-y-6 px-2">
                        <h2 className="text-white font-bold tracking-wide leading-tight text-2xl xs:text-3xl sm:text-4xl md:text-5xl">
                            {settings.title}
                        </h2>

                        <p className="text-white/70 leading-relaxed max-w-md mx-auto text-base sm:text-lg md:text-xl">
                            {settings.message}
                        </p>

                        {settings.estimatedTime && (
                            <div className="inline-flex items-center gap-2 sm:gap-3 px-4 py-2.5 sm:px-6 sm:py-3 bg-white/5 border border-white/10 rounded-full transition-transform hover:scale-105">
                                <span className="text-xl sm:text-2xl">⏱️</span>
                                <span className="text-white/90 font-medium text-sm sm:text-base">
                                    Back in {settings.estimatedTime}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Social Links */}
                    <div className="animate-fade-in-delay-2 flex items-center justify-center gap-3 sm:gap-4 md:gap-6">
                        <Link
                            href="https://www.instagram.com/humantee"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 active:scale-95 transition-all duration-300"
                            aria-label="Visit our Instagram">
                            <FiInstagram className="w-5 h-5 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white/70 group-hover:text-white/90 transition-colors" />
                        </Link>

                        <Link
                            href={`mailto:${settings.contactEmail}`}
                            className="group flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 active:scale-95 transition-all duration-300"
                            aria-label="Send us an email">
                            <FiMail className="w-5 h-5 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white/70 group-hover:text-white/90 transition-colors" />
                        </Link>
                    </div>

                    {/* Contact Info */}
                    <p className="text-white/40 leading-relaxed px-2 text-xs sm:text-sm">
                        Need help? Contact us at{' '}
                        <Link
                            href={`mailto:${settings.contactEmail}`}
                            className="text-white/60 hover:text-white/80 underline underline-offset-2 transition-colors break-all">
                            {settings.contactEmail}
                        </Link>
                    </p>

                    {/* Refresh Button */}
                    <button
                        onClick={handleRefresh}
                        disabled={isRefreshing}
                        className="inline-flex items-center justify-center gap-2 px-5 py-3 sm:px-6 sm:py-3.5 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 hover:border-white/20 active:scale-95 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px] min-w-[140px] sm:min-w-[160px] touch-manipulation select-none"
                        aria-label={isRefreshing ? 'Refreshing status' : 'Check if maintenance is complete'}>
                        <svg
                            className={`w-4 h-4 sm:w-5 sm:h-5 text-white/70 flex-shrink-0 ${isRefreshing ? 'animate-spin' : ''}`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}>
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                            />
                        </svg>
                        <span className="text-white/70 font-medium text-sm sm:text-base whitespace-nowrap">
                            {isRefreshing ? 'Refreshing...' : 'Check Status'}
                        </span>
                    </button>
                </div>
            </div>

            {/* CSS Animations */}
            <style jsx>{`
                @keyframes fade-in {
                    from {
                        opacity: 0;
                        transform: translateY(15px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes pulse {
                    0%, 100% {
                        opacity: 0.2;
                    }
                    50% {
                        opacity: 0.35;
                    }
                }

                .animate-fade-in {
                    animation: fade-in 0.8s ease-out;
                }

                .animate-fade-in-delay {
                    animation: fade-in 0.8s ease-out 0.2s both;
                }

                .animate-fade-in-delay-2 {
                    animation: fade-in 0.8s ease-out 0.4s both;
                }

                @media (min-width: 640px) {
                    @keyframes pulse {
                        0%, 100% {
                            opacity: 0.3;
                        }
                        50% {
                            opacity: 0.5;
                        }
                    }
                }
            `}</style>
        </div>
    );
}
