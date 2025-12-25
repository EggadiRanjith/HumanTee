/**
 * Brand Section Component
 */

"use client";

import SocialLinks from "./SocialLinks";

interface BrandSectionProps {
    brandName: string;
    logoUrl: string | null;
    tagline: string;
    socialLinks: {
        instagram: string;
        maps: string;
    };
}

export default function BrandSection({ brandName, logoUrl, tagline, socialLinks }: BrandSectionProps) {
    return (
        <div className="flex flex-col gap-2 items-center sm:items-start text-center sm:text-left">
            {/* Logo + Brand Name */}
            <div className="flex items-center gap-2 sm:gap-3">
                {logoUrl && logoUrl.trim() !== '' && (
                    <img
                        src={logoUrl}
                        alt={brandName || 'Brand Logo'}
                        className="h-[32px] sm:h-[36px] w-auto flex-shrink-0 border border-white/20 rounded p-1.5"
                    />
                )}

                <h2
                    className="text-[14px] text-white tracking-[0.15em] uppercase font-semibold"
                    style={{ fontFamily: "var(--font-tan-pearl)" }}
                >
                    {brandName}
                </h2>
            </div>

            <p className="text-white/60 text-[12px] leading-relaxed max-w-xs">
                {tagline}
            </p>

            <SocialLinks instagram={socialLinks.instagram} maps={socialLinks.maps} />
        </div>
    );
}
