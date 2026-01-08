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
          rounded-lg border border-white/10
          bg-white/5 hover:bg-white/10
          text-white text-sm
          transition-colors
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
            >
                <div className="flex items-center gap-2">
                    <span className="text-base">{selectedCountry.flag}</span>
                    <span className="font-medium">{selectedCountry.code}</span>
                </div>
                <FiChevronDown
                    className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                />
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 z-50 bg-white/10 backdrop-blur-xl border border-white/20 rounded-lg shadow-lg overflow-hidden">
                    <div className="max-h-60 overflow-y-auto">
                        {countries.map((country) => (
                            <button
                                key={country.code}
                                type="button"
                                onClick={() => handleSelect(country.code)}
                                className={`
                  w-full flex items-center gap-3 px-3 py-2.5
                  text-left text-sm
                  hover:bg-white/10 transition-colors
                  ${country.code === value ? 'bg-white/5' : ''}
                `}
                            >
                                <span className="text-base">{country.flag}</span>
                                <span className="font-medium text-white">{country.code}</span>
                                <span className="text-white/60 text-xs">{country.name}</span>
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
