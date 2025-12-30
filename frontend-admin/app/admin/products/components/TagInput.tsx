/**
 * Tag Input Component
 * Multi-tag input with add/remove functionality
 */

'use client';

import { useState, KeyboardEvent } from 'react';

interface TagInputProps {
    tags: string[];
    onChange: (tags: string[]) => void;
    placeholder?: string;
    maxTags?: number;
}

export default function TagInput({
    tags,
    onChange,
    placeholder = 'Add tags...',
    maxTags = 20,
}: TagInputProps) {
    const [inputValue, setInputValue] = useState('');

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            addTag();
        } else if (e.key === 'Backspace' && inputValue === '' && tags.length > 0) {
            removeTag(tags[tags.length - 1]);
        }
    };

    const addTag = () => {
        const tag = inputValue.trim().toLowerCase();
        if (tag && !tags.includes(tag) && tags.length < maxTags) {
            onChange([...tags, tag]);
            setInputValue('');
        }
    };

    const removeTag = (tagToRemove: string) => {
        onChange(tags.filter((tag) => tag !== tagToRemove));
    };

    return (
        <div className="space-y-2">
            {/* Tags Display */}
            {tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                        <span
                            key={tag}
                            className="inline-flex items-center gap-1 bg-gray-100 text-gray-900 px-3 py-1 rounded-full text-sm"
                        >
                            {tag}
                            <button
                                type="button"
                                onClick={() => removeTag(tag)}
                                className="text-gray-600 hover:text-black"
                            >
                                ×
                            </button>
                        </span>
                    ))}
                </div>
            )}

            {/* Input */}
            <div className="flex gap-2">
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e: any) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onBlur={addTag}
                    placeholder={placeholder}
                    disabled={tags.length >= maxTags}
                    className="flex-1 px-4 py-3 bg-white border-2 border-gray-400 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-black focus:border-black outline-none transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
                <button
                    type="button"
                    onClick={addTag}
                    disabled={!inputValue.trim() || tags.length >= maxTags}
                    className="bg-black hover:bg-gray-900 text-white px-4 py-3 rounded-lg font-medium transition-colors text-sm disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                    Add
                </button>
            </div>

            <p className="text-xs text-gray-500">
                Press Enter or comma to add tags ({tags.length}/{maxTags})
            </p>
        </div>
    );
}
