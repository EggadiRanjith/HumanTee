/**
 * Premium Checkout Progress Indicator
 * Modern glassmorphism design with gradient animations
 */

interface CheckoutProgressProps {
    currentStep: 1 | 2 | 3;
}

export function CheckoutProgress({ currentStep }: CheckoutProgressProps) {
    const steps = [
        { number: 1, label: 'Shipping' },
        { number: 2, label: 'Payment' },
        { number: 3, label: 'Review' },
    ];

    return (
        <div className="w-full mb-8 sm:mb-12">
            {/* Desktop & Tablet View - Premium Design */}
            <div className="hidden sm:block">
                <div className="max-w-3xl mx-auto px-4">
                    <div className="relative">
                        {/* Background Track with Glassmorphism */}
                        <div className="absolute top-6 left-0 right-0 h-1 bg-gradient-to-r from-white/5 via-white/10 to-white/5 rounded-full backdrop-blur-sm" />

                        {/* Animated Progress Fill with Gradient */}
                        <div
                            className="absolute top-6 left-0 h-1 rounded-full transition-all duration-700 ease-out overflow-hidden"
                            style={{
                                width: currentStep === 1 ? '0%' : currentStep === 2 ? '50%' : '100%'
                            }}
                        >
                            <div className="h-full w-full bg-gradient-to-r from-violet-400 via-purple-400 to-fuchsia-400"
                                style={{
                                    backgroundSize: '200% 100%',
                                    animation: 'shimmer 2s linear infinite'
                                }}
                            />
                        </div>

                        {/* Steps Container */}
                        <div className="relative flex justify-between">
                            {steps.map((step) => {
                                const isCompleted = currentStep > step.number;
                                const isActive = currentStep === step.number;

                                return (
                                    <div key={step.number} className="flex flex-col items-center group">
                                        {/* Step Circle with Enhanced Design */}
                                        <div className="relative">
                                            {/* Glow Effect for Active Step */}
                                            {isActive && (
                                                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-violet-400 to-fuchsia-400 blur-xl opacity-60 animate-pulse" />
                                            )}

                                            {/* Main Circle */}
                                            <div
                                                className={`
                                                    relative w-12 h-12 rounded-full flex items-center justify-center
                                                    font-semibold text-sm transition-all duration-500
                                                    ${isCompleted
                                                        ? 'bg-gradient-to-br from-violet-400 to-fuchsia-400 text-white shadow-lg shadow-violet-500/50 scale-110'
                                                        : isActive
                                                            ? 'bg-gradient-to-br from-white to-gray-100 text-black shadow-2xl shadow-white/30 scale-110'
                                                            : 'bg-white/5 text-white/40 border-2 border-white/20 backdrop-blur-sm'
                                                    }
                                                `}
                                            >
                                                {isCompleted ? (
                                                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                    </svg>
                                                ) : (
                                                    <span className="font-bold">{step.number}</span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Label with Enhanced Typography */}
                                        <div className="mt-4 text-center">
                                            <span
                                                className={`
                                                    block text-sm font-semibold tracking-wide transition-all duration-300
                                                    ${isCompleted || isActive
                                                        ? 'text-white'
                                                        : 'text-white/40'
                                                    }
                                                `}
                                            >
                                                {step.label}
                                            </span>
                                            {isActive && (
                                                <span className="block text-[10px] text-white/60 mt-1 uppercase tracking-widest font-medium">
                                                    Current
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Shimmer Animation Keyframes */}
                <style jsx>{`
                    @keyframes shimmer {
                        0% { background-position: -200% 0; }
                        100% { background-position: 200% 0; }
                    }
                `}</style>
            </div>

            {/* Mobile View - Compact Design */}
            <div className="sm:hidden px-4">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-white/60 text-xs font-medium uppercase tracking-wider">
                        Step {currentStep} of 3
                    </span>
                    <span className="text-white text-sm font-medium">
                        {steps[currentStep - 1].label}
                    </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-violet-400 to-fuchsia-400 transition-all duration-500 ease-out rounded-full"
                        style={{ width: `${(currentStep / 3) * 100}%` }}
                    />
                </div>
            </div>
        </div>
    );
}
