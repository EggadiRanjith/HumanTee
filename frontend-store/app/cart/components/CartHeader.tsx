/**
 * Cart Header Component
 * Mobile-first responsive header for cart page
 */

import React from 'react';

interface CartHeaderProps {
    totalItems: number;
}

export function CartHeader({ totalItems }: CartHeaderProps) {
    return (
        <div className="mb-8 sm:mb-10">
            {/* Title - Mobile: 26px, Tablet: 34px, Desktop: 42px */}
            <h1 className="text-[26px] sm:text-[34px] lg:text-[42px] font-light uppercase tracking-[0.14em] text-white">
                Shopping Cart
            </h1>

            {/* Subtitle - Mobile: 11px, Tablet: 12px */}
            <p className="text-white/45 text-[11px] sm:text-[12px] uppercase tracking-[0.22em] mt-2">
                {totalItems} {totalItems === 1 ? "item" : "items"} in your cart
            </p>
        </div>
    );
}
