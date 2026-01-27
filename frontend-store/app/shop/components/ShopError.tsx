"use client";

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useLoading } from '@/app/contexts/LoadingContext';
import errorAnimation from '@/public/animation/lottie/system-animation/500.json';

const Lottie = dynamic(() => import('lottie-react'), { ssr: false });

export function ShopError() {
    const { setLoading } = useLoading();

    return (
        <div className="flex flex-col items-center justify-center py-20 px-4">
            <div className="w-[250px] sm:w-[320px] lg:w-[380px] mb-8">
                <Lottie
                    animationData={errorAnimation}
                    loop={true}
                    autoplay={true}
                />
            </div>
            <h2 className="text-[22px] sm:text-[28px] lg:text-[34px] font-light uppercase tracking-[0.12em] brand-text-primary mb-4 text-center">
                Unable to Load Products
            </h2>
            <p className="brand-text-muted text-[12px] sm:text-[13px] uppercase tracking-[0.18em] mb-10 text-center max-w-lg">
                We're having trouble connecting to our product catalog. Please try again in a moment.
            </p>
            <div className="flex gap-4">
                <button
                    onClick={() => window.location.reload()}
                    className="
            brand-text-primary text-step--1 tracking-wide font-medium
            border border-white/20 rounded-full
            px-8 py-3 motion-cinematic luxury-glass
            hover:border-white/40 hover:bg-white/5
          "
                >
                    RETRY
                </button>
                <Link
                    href="/"
                    onClick={() => setLoading(true)}
                    className="
            brand-text-muted text-step--1 tracking-wide 
            border border-white/10 rounded-full
            px-8 py-3 motion-cinematic luxury-glass
            hover:border-white/20 hover:brand-text-primary
          "
                >
                    GO HOME
                </Link>
            </div>
        </div>
    );
}
