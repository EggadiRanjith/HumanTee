/**
 * Country Code Select Component
 * Compact dropdown for selecting phone country codes
 */

"use client";

import { useState, useRef, useEffect } from 'react';
import { FiChevronDown } from 'react-icons/fi';
import { COUNTRY_PHONE_RULES } from '@/lib/utils/phoneValidation';

interface CountryCodeSelectProps {
    value: string;
    onChange: (code: string) => void;
    className?: string;
    disabled?: boolean;
}

export function CountryCodeSelect({
    value,
    onChange,
    className = '',
    disabled = false,
}: CountryCodeSelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const countries = Object.values(COUNTRY_PHONE_RULES);
    const selectedCountry = countries.find((c) => c.code === value) || countries[0];

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    const handleSelect = (code: string) => {
        onChange(code);
        setIsOpen(false);
    };

    return (
        <div ref={dropdownRef} className={`relative ${className}`}>
            {/* Selected Value Button */}
            <button
                type="button"
                onClick={() => !disabled && setIsOpen(!isOpen)}
                disabled={disabled}
                className={`
                    w-full flex items-center justify-between gap-2
                    px-3 py-2.5 sm:py-3
                    rounded-xl border border-white/10
                    bg-white/5 backdrop-blur-sm
                    hover:bg-white/[0.08] hover:border-white/20
                    text-white text-sm
                    transition-all duration-200
                    ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                    ${isOpen ? 'border-white/30 bg-white/10' : ''}
                `}
            >
                <div className="flex items-center gap-2">
                    <span className="text-base">{selectedCountry.flag}</span>
                    <span className="font-medium">{selectedCountry.code}</span>
                </div>
                <FiChevronDown
                    className={`w-4 h-4 text-white/60 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                />
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 z-50 rounded-xl overflow-hidden border border-white/10 shadow-2xl shadow-black/50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="bg-[#0a0118]/95 backdrop-blur-xl">
                        <div
                            className="max-h-60 overflow-y-auto"
                            style={{
                                scrollbarWidth: 'none', // Firefox
                                msOverflowStyle: 'none', // IE/Edge
                            }}
                        >
                            <style jsx>{`
                                div::-webkit-scrollbar {
                                    display: none; /* Chrome/Safari/Opera */
                                }
                            `}</style>
                            {countries.map((country) => (
                                <button
                                    key={country.code}
                                    type="button"
                                    onClick={() => handleSelect(country.code)}
                                    className={`
                                        w-full flex items-center gap-3 px-4 py-3
                                        text-left text-sm
                                        hover:bg-white/10 transition-all duration-150
                                        border-b border-white/5 last:border-0
                                        ${country.code === value ? 'bg-violet-600/20 border-violet-500/20' : ''}
                                    `}
                                >
                                    <span className="text-base">{country.flag}</span>
                                    <span className="font-medium text-white">{country.code}</span>
                                    <span className="text-white/50 text-xs flex-1 truncate">{country.name}</span>
                                    {country.code === value && (
                                        <span className="text-violet-400 text-xs">✓</span>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
