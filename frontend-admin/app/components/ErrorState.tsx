/**
 * Reusable Error State Component
 * Displays user-friendly error messages with retry functionality
 */

'use client';

interface ErrorStateProps {
    error?: Error | null;
    message?: string;
    onRetry?: () => void;
    showDetails?: boolean;
}

export function ErrorState({
    error,
    message = 'Something went wrong',
    onRetry,
    showDetails = false,
}: ErrorStateProps) {
    const errorMessage = error?.message || message;

    return (
        <div className="flex items-center justify-center p-8">
            <div className="max-w-md w-full text-center">
                {/* Error Icon */}
                <div className="mb-4">
                    <div className="w-16 h-16 mx-auto rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                        <svg
                            className="w-8 h-8 text-red-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                            />
                        </svg>
                    </div>
                </div>

                {/* Error Message */}
                <h3 className="text-lg font-semibold text-black mb-2">
                    {message}
                </h3>

                {showDetails && error && (
                    <p className="text-sm text-gray-600 mb-4 font-mono bg-gray-50 p-3 rounded border border-gray-200">
                        {errorMessage}
                    </p>
                )}

                {!showDetails && (
                    <p className="text-sm text-gray-600 mb-4">
                        An unexpected error occurred. Please try again.
                    </p>
                )}

                {/* Retry Button */}
                {onRetry && (
                    <button
                        onClick={onRetry}
                        className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-900 transition-colors font-medium"
                    >
                        Try Again
                    </button>
                )}
            </div>
        </div>
    );
}

/**
 * Empty State Component
 * Displays when no data is available
 */
interface EmptyStateProps {
    title?: string;
    message?: string;
    icon?: string;
    action?: {
        label: string;
        onClick: () => void;
    };
}

export function EmptyState({
    title = 'No data found',
    message = 'There is nothing to display here yet.',
    icon = '📭',
    action,
}: EmptyStateProps) {
    return (
        <div className="flex items-center justify-center p-12">
            <div className="max-w-md w-full text-center">
                <div className="text-5xl mb-4">{icon}</div>
                <h3 className="text-lg font-semibold text-black mb-2">
                    {title}
                </h3>
                <p className="text-sm text-gray-600 mb-6">
                    {message}
                </p>
                {action && (
                    <button
                        onClick={action.onClick}
                        className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-900 transition-colors font-medium"
                    >
                        {action.label}
                    </button>
                )}
            </div>
        </div>
    );
}
