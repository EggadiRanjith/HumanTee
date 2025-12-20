/**
 * Character Counter Component
 * Display character count with visual feedback
 */

'use client';

interface CharacterCounterProps {
    current: number;
    max: number;
    className?: string;
}

export default function CharacterCounter({
    current,
    max,
    className = '',
}: CharacterCounterProps) {
    const percentage = (current / max) * 100;
    const isWarning = percentage >= 80 && percentage < 100;
    const isError = percentage >= 100;

    return (
        <div className={`text-xs ${className}`}>
            <span
                className={`
          ${isError ? 'text-red-600 font-medium' : ''}
          ${isWarning ? 'text-yellow-600 font-medium' : ''}
          ${!isWarning && !isError ? 'text-gray-500' : ''}
        `}
            >
                {current} / {max}
            </span>
        </div>
    );
}
