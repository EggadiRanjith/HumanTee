/**
 * Settings Skeleton - PROFESSIONAL QUALITY
 * Generic skeleton for settings pages with form sections
 */

export function SettingsSkeleton() {
    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
            {/* Shimmer effect CSS */}
            <style jsx>{`
                @keyframes shimmer {
                    0% {
                        background-position: -1000px 0;
                    }
                    100% {
                        background-position: 1000px 0;
                    }
                }
                .shimmer {
                    animation: shimmer 2s infinite;
                    background: linear-gradient(
                        to right,
                        #f0f0f0 0%,
                        #f8f8f8 20%,
                        #f0f0f0 40%,
                        #f0f0f0 100%
                    );
                    background-size: 1000px 100%;
                }
            `}</style>

            <div className="max-w-4xl mx-auto">
                {/* Back Button */}
                <div className="h-5 w-32 bg-gray-200 rounded shimmer mb-6"></div>

                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <div className="h-8 md:h-10 w-48 bg-gray-200 rounded shimmer mb-2"></div>
                        <div className="h-4 w-64 bg-gray-200 rounded shimmer"></div>
                    </div>
                    <div className="h-10 w-24 bg-gray-200 rounded-lg shimmer"></div>
                </div>

                {/* Settings Sections */}
                <div className="space-y-6">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                            {/* Section Title */}
                            <div className="h-6 w-40 bg-gray-200 rounded shimmer mb-4"></div>

                            {/* Form Fields */}
                            <div className="space-y-4">
                                {[1, 2, 3].map((j) => (
                                    <div key={j}>
                                        <div className="h-4 w-32 bg-gray-200 rounded shimmer mb-2"></div>
                                        <div className="h-10 bg-gray-100 rounded-lg shimmer"></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
