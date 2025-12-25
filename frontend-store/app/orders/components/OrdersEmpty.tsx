/**
 * Orders Empty State Component
 * Displayed when user has no orders
 */

"use client";

import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';

const Lottie = dynamic(() => import('lottie-react'), { ssr: false });

export function OrdersEmpty() {
    const [animation, setAnimation] = useState<object | null>(null);

    useEffect(() => {
        fetch('/animation/lottie/Empty_order.json')
            .then(res => res.json())
            .then(data => setAnimation(data))
            .catch(err => console.error('Failed to load empty order animation:', err));
    }, []);

    return (
        <div className="flex flex-col items-center justify-center py-16 sm:py-20 lg:py-24 min-h-[60vh]">
            {animation && (
                <div className="w-[200px] sm:w-[280px] lg:w-[320px] mb-6">
                    <Lottie animationData={animation} loop={true} />
                </div>
            )}
            <h3 className="text-[18px] sm:text-[22px] lg:text-[26px] font-light uppercase tracking-[0.12em] text-white mb-3">
                No Orders Yet
            </h3>
            <p className="text-white/45 text-[11px] sm:text-[12px] uppercase tracking-[0.18em] mb-8 text-center max-w-md">
                Start shopping to see your order history here
            </p>
            <Link
                href="/shop"
                className="
          text-white/60 text-step--1 tracking-wide 
          border border-white/10 rounded-full
          px-8 py-3 motion-cinematic luxury-glass
          hover:border-white/20 hover:text-white
        "
            >
                START SHOPPING
            </Link>
        </div>
    );
}
