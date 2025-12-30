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
    message = 'There are no items to display',
    icon = '📭',
    action
}: EmptyStateProps) {
    return (
        <div className="min-h-[400px] flex items-center justify-center">
            <div className="text-center max-w-md">
                <div className="text-6xl mb-4">{icon}</div>
                <h3 className="text-xl font-semibold text-black mb-2">
                    {title}
                </h3>
                <p className="text-gray-600 mb-6">
                    {message}
                </p>
                {action && (
                    <button
                        onClick={action.onClick}
                        className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-900 transition-colors font-medium"
                    >
                        {action.label}
                    </button>
                )}
            </div>
        </div>
    );
}
