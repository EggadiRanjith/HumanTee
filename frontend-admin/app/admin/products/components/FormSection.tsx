/**
 * Form Section Component
 * Reusable section wrapper with title and description
 */

'use client';

import { ReactNode } from 'react';

interface FormSectionProps {
    title: string;
    description?: string;
    children: ReactNode;
    className?: string;
}

export default function FormSection({
    title,
    description,
    children,
    className = '',
}: FormSectionProps) {
    return (
        <div className={`bg-white rounded-lg border border-gray-200 p-4 sm:p-6 ${className}`}>
            <div className="mb-4 sm:mb-6">
                <h2 className="text-base sm:text-lg font-semibold text-black">{title}</h2>
                {description && (
                    <p className="text-sm text-gray-600 mt-1">{description}</p>
                )}
            </div>
            {children}
        </div>
    );
}
