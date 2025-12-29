/**
 * Error Boundary Component
 * Catches React errors and displays fallback UI
 */

'use client';

import React, { Component, ReactNode } from 'react';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        // Log error to error reporting service (e.g., Sentry)
        // console.error('Error boundary caught:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div className="min-h-screen flex items-center justify-center bg-gray-50">
                    <div className="max-w-md w-full bg-white rounded-lg border border-gray-200 p-6 text-center">
                        <div className="text-4xl mb-4">⚠️</div>
                        <h2 className="text-xl font-semibold text-black mb-2">
                            Something went wrong
                        </h2>
                        <p className="text-gray-600 mb-4">
                            An error occurred while rendering this page.
                        </p>
                        <button
                            onClick={() => window.location.reload()}
                            className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-900 transition-colors"
                        >
                            Reload Page
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
