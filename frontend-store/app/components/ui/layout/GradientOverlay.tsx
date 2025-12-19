/**
 * GradientOverlay Component
 * Decorative gradient overlay for ambient background effects
 * 
 * @example
 * <GradientOverlay variant="aurora" />
 * <GradientOverlay variant="violet" opacity={0.3} />
 */

interface GradientOverlayProps {
    variant?: 'aurora' | 'violet' | 'cyan' | 'custom';
    opacity?: number;
    position?: string;
    blur?: number;
    customGradient?: string;
    className?: string;
}

export default function GradientOverlay({
    variant = 'aurora',
    opacity = 0.4,
    position = '50% 10%',
    blur = 120,
    customGradient,
    className = '',
}: GradientOverlayProps) {
    const gradients = {
        aurora: 'radial-gradient(circle at 50% 10%, rgba(183,164,255,0.18), transparent 70%)',
        violet: 'radial-gradient(circle at 50% 50%, rgba(139,92,246,0.15), transparent 70%)',
        cyan: 'radial-gradient(circle at 50% 50%, rgba(34,211,238,0.15), transparent 70%)',
        custom: customGradient || '',
    };

    return (
        <div
            className={`absolute inset-0 pointer-events-none ${className}`}
            style={{
                background: gradients[variant],
                filter: `blur(${blur}px)`,
                opacity,
            }}
            aria-hidden="true"
        />
    );
}
