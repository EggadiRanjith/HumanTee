/**
 * Loading Spinner Component
 * Reusable loading indicator for the admin app
 */

export function LoadingSpinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
    const sizeClasses = {
        sm: 'h-4 w-4 border-2',
        md: 'h-8 w-8 border-2',
        lg: 'h-12 w-12 border-4'
    };

    return (
        <div className="flex items-center justify-center min-h-[200px]">
            <div className={`${sizeClasses[size]} border-black/20 border-t-black rounded-full animate-spin`}></div>
        </div>
    );
}
