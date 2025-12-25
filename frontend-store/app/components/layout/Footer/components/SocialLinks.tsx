/**
 * Social Links Component
 */

"use client";

import Link from "next/link";
import { FiInstagram, FiMapPin } from "react-icons/fi";
import { FOCUS_RING } from "../../shared/design-tokens";

interface SocialLinksProps {
    instagram: string;
    maps: string;
}

export default function SocialLinks({ instagram, maps }: SocialLinksProps) {
    return (
        <div className="flex flex-wrap items-center gap-6 mt-4 sm:mt-2 justify-center sm:justify-start">
            {/* Follow Us */}
            <div className="flex items-center gap-3">
                <span className="text-white/50 text-[11px] tracking-[0.2em] uppercase whitespace-nowrap">
                    Follow Us
                </span>

                <Link
                    href={instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Follow us on Instagram"
                    className="
            w-8 h-8 flex items-center justify-center 
            rounded-full border border-white/10 
            hover:border-white/30 hover:bg-white/5 
            hover:scale-110 hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]
            transition-all duration-300
            ${FOCUS_RING.glow}
          "
                >
                    <FiInstagram size={15} className="text-white/75" aria-hidden="true" />
                </Link>
            </div>

            {/* Separator for desktop */}
            <div className="hidden sm:block w-px h-4 bg-white/10"></div>

            {/* Location */}
            <div className="flex items-center gap-3">
                <span className="text-white/50 text-[11px] tracking-[0.2em] uppercase whitespace-nowrap">
                    Location
                </span>

                <Link
                    href={maps}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="View our location on Google Maps"
                    className="
            w-8 h-8 flex items-center justify-center 
            rounded-full border border-white/10 
            hover:border-white/30 hover:bg-white/5 
            hover:scale-110 hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]
            transition-all duration-300
            ${FOCUS_RING.glow}
          "
                >
                    <FiMapPin size={15} className="text-white/75" aria-hidden="true" />
                </Link>
            </div>
        </div>
    );
}
