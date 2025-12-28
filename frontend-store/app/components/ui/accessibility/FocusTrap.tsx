/**
 * Reusable Focus Trap Component
 * Traps keyboard focus within a container (for modals, dropdowns, etc.)
 */

import { useEffect, useRef } from 'react';

interface FocusTrapProps {
    children: React.ReactNode;
    isActive: boolean;
    onEscape?: () => void;
}

export function FocusTrap({ children, isActive, onEscape }: FocusTrapProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!isActive || !containerRef.current) return;

        const container = containerRef.current;
        const focusableElements = container.querySelectorAll<HTMLElement>(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        // Focus first element on mount
        firstElement?.focus();

        const handleKeyDown = (e: KeyboardEvent) => {
            // Handle Escape key
            if (e.key === 'Escape' && onEscape) {
                onEscape();
                return;
            }

            // Handle Tab key
            if (e.key === 'Tab') {
                if (e.shiftKey) {
                    // Shift + Tab
                    if (document.activeElement === firstElement) {
                        lastElement?.focus();
                        e.preventDefault();
                    }
                } else {
                    // Tab
                    if (document.activeElement === lastElement) {
                        firstElement?.focus();
                        e.preventDefault();
                    }
                }
            }
        };

        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isActive, onEscape]);

    return (
        <div ref={containerRef} role="dialog" aria-modal="true">
            {children}
        </div>
    );
}
