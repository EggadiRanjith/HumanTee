/**
 * Discounts Error Component - ENHANCED
 * Better error categorization and user guidance
 */

interface DiscountsErrorProps {
    error: Error;
    onRetry: () => void;
}

export function DiscountsError({ error, onRetry }: DiscountsErrorProps) {
    const isNetworkError = error.message?.includes('Network') || error.message?.includes('fetch');
    const isServerError = error.message?.includes('500') || error.message?.includes('503');

    return (
        <div className="min-h-[60vh] flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-lg border border-gray-200 p-6 shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                        <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900">
                            {isNetworkError ? 'Connection Failed' : isServerError ? 'Server Error' : 'Failed to Load Discounts'}
                        </h2>
                        <p className="text-sm text-gray-600">
                            {isNetworkError ? 'Check your internet connection' : isServerError ? 'Backend is unavailable' : 'Unable to fetch discounts'}
                        </p>
                    </div>
                </div>

                {error.message && (
                    <div className="bg-red-50 rounded p-3 mb-4 border border-red-200">
                        <p className="text-xs font-mono text-red-800 break-words">
                            {error.message}
                        </p>
                    </div>
                )}

                <div className="flex gap-2">
                    <button
                        onClick={onRetry}
                        className="flex-1 px-4 py-2 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-900 transition-colors flex items-center justify-center gap-2"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        <span>Retry</span>
                    </button>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
                    >
                        Reload Page
                    </button>
                </div>

                {isNetworkError && (
                    <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded text-xs text-blue-800">
                        <strong>Tip:</strong> Check if the backend server is running on the correct port.
                    </div>
                )}
            </div>
        </div>
    );
}
