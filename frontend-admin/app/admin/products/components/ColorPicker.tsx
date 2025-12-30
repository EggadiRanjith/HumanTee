/**
 * Color Picker Component
 * Color selection with swatches and hex input
 */

'use client';

import { useState } from 'react';

interface ColorPickerProps {
    value: string;
    colorName: string;
    onChange: (colorName: string, colorHex: string) => void;
}

const PRESET_COLORS = [
    { name: 'Black', hex: '#000000' },
    { name: 'White', hex: '#FFFFFF' },
    { name: 'Gray', hex: '#6B7280' },
    { name: 'Red', hex: '#EF4444' },
    { name: 'Orange', hex: '#F97316' },
    { name: 'Yellow', hex: '#EAB308' },
    { name: 'Green', hex: '#22C55E' },
    { name: 'Blue', hex: '#3B82F6' },
    { name: 'Indigo', hex: '#6366F1' },
    { name: 'Purple', hex: '#A855F7' },
    { name: 'Pink', hex: '#EC4899' },
    { name: 'Brown', hex: '#92400E' },
];

export default function ColorPicker({ value, colorName, onChange }: ColorPickerProps) {
    const [isCustom, setIsCustom] = useState(false);
    const [customHex, setCustomHex] = useState(value);

    const handlePresetSelect = (name: string, hex: string) => {
        setIsCustom(false);
        onChange(name, hex);
    };

    const handleCustomChange = (hex: string) => {
        setCustomHex(hex);
        onChange('Custom', hex);
    };

    return (
        <div className="space-y-3">
            {/* Preset Colors */}
            <div className="grid grid-cols-6 gap-2">
                {PRESET_COLORS.map((color) => (
                    <button
                        key={color.hex}
                        type="button"
                        onClick={() => handlePresetSelect(color.name, color.hex)}
                        className={`
              w-full aspect-square rounded-lg border-2 transition-all
              ${value === color.hex && !isCustom
                                ? 'border-black scale-110'
                                : 'border-gray-300 hover:border-gray-400'
                            }
            `}
                        style={{ backgroundColor: color.hex }}
                        title={color.name}
                    >
                        {color.hex === '#FFFFFF' && (
                            <div className="w-full h-full border border-gray-200 rounded-lg" />
                        )}
                    </button>
                ))}
            </div>

            {/* Custom Color */}
            <div className="space-y-2">
                <button
                    type="button"
                    onClick={() => setIsCustom(true)}
                    className="text-sm text-gray-600 hover:text-black font-medium"
                >
                    + Custom Color
                </button>

                {isCustom && (
                    <div className="flex gap-2">
                        <input
                            type="color"
                            value={customHex}
                            onChange={(e: any) => handleCustomChange(e.target.value)}
                            className="w-12 h-10 rounded border border-gray-300 cursor-pointer"
                        />
                        <input
                            type="text"
                            value={customHex}
                            onChange={(e: any) => handleCustomChange(e.target.value)}
                            placeholder="#000000"
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-black focus:border-black outline-none"
                        />
                    </div>
                )}
            </div>

            {/* Selected Color Display */}
            <div className="text-xs text-gray-600">
                Selected: <span className="font-medium text-black">{colorName}</span>{' '}
                <span className="text-gray-500">({value})</span>
            </div>
        </div>
    );
}
