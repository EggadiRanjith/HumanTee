/**
 * Form Section Component
 * Reusable section wrapper with title and description
 */

'use client';

import { ReactNode } from 'react';

interface FormSectionProps {
    title: string;
    description?: string;
    children: React.ReactNode;
    className?: string;
}

export default function FormSection({
    title,
    description,
    children,
    className = '',
}: FormSectionProps) {
    return (
        <div className={`space-y-2 md:space-y-3 lg:space-y-4 ${className}`}>
            <div>
                <h3 className="text-sm md:text-base lg:text-lg font-semibold text-gray-900">{title}</h3>
                {description && (
                    <p className="mt-1 text-xs md:text-sm text-gray-600">{description}</p>
                )}
            </div>
            <div className="space-y-3 md:space-y-4 lg:space-y-5">
                {children}
            </div>
        </div>
    );
}
