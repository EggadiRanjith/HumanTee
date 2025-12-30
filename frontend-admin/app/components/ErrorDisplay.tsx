/**
 * Error Display Component
 * Reusable error UI with retry functionality
 */

interface ErrorDisplayProps {
    error: Error | null;
    onRetry?: () => void;
    message?: string;
}

export function ErrorDisplay({ error, onRetry, message }: ErrorDisplayProps) {
    if (!error) return null;

    return (
        <div className="min-h-[400px] flex items-center justify-center">
            <div className="max-w-md w-full bg-white rounded-lg border border-red-200 p-6 text-center">
                <div className="text-4xl mb-4">⚠️</div>
                <h3 className="text-lg font-semibold text-black mb-2">
                    {message || 'Failed to load data'}
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                    {error.message || 'An error occurred while fetching data'}
                </p>
                {onRetry && (
                    <button
                        onClick={onRetry}
                        className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-900 transition-colors font-medium"
                    >
                        Try Again
                    </button>
                )}
            </div>
        </div>
    );
}
