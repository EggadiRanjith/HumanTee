/**
 * Dashboard Error Boundary
 * Catches runtime errors in dashboard and shows fallback UI
 */

'use client';

import { Component, ReactNode } from 'react';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class DashboardErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: any) {
        // TODO: Send to error tracking service (Sentry, etc.)
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-[60vh] flex items-center justify-center p-4">
                    <div className="max-w-md w-full bg-white rounded-lg border border-red-200 p-6 shadow-lg">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold text-gray-900">Dashboard Error</h2>
                                <p className="text-sm text-gray-600">Something went wrong</p>
                            </div>
                        </div>

                        <div className="bg-gray-50 rounded p-3 mb-4 border border-gray-200">
                            <p className="text-xs font-mono text-gray-700 break-words">
                                {this.state.error?.message || 'Unknown error'}
                            </p>
                        </div>

                        <div className="text-sm text-gray-600 mb-4">
                            <p className="mb-2">This error has been logged. Please try:</p>
                            <ul className="list-disc list-inside space-y-1 text-xs">
                                <li>Refreshing the page</li>
                                <li>Clearing your browser cache</li>
                                <li>Checking your network connection</li>
                            </ul>
                        </div>

                        <div className="flex gap-2">
                            <button
                                onClick={() => window.location.reload()}
                                className="flex-1 px-4 py-2 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-900 transition-colors"
                            >
                                Reload Page
                            </button>
                            <button
                                onClick={() => this.setState({ hasError: false, error: null })}
                                className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
                            >
                                Try Again
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
