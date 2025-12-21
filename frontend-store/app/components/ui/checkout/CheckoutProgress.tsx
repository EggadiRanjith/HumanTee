/**
 * Professional Checkout Progress Indicator
 * Industry-standard design inspired by leading e-commerce platforms
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
            {/* Desktop & Tablet View */}
            <div className="hidden sm:block">
                <div className="max-w-2xl mx-auto px-4">
                    <div className="relative">
                        {/* Progress Bar Background */}
                        <div className="absolute top-5 left-0 right-0 h-0.5 bg-white/20" />

                        {/* Progress Bar Fill */}
                        <div
                            className="absolute top-5 left-0 h-0.5 bg-white transition-all duration-500 ease-out"
                            style={{
                                width: currentStep === 1 ? '0%' : currentStep === 2 ? '50%' : '100%'
                            }}
                        />

                        {/* Steps */}
                        <div className="relative flex justify-between">
                            {steps.map((step) => {
                                const isCompleted = currentStep > step.number;
                                const isActive = currentStep === step.number;

                                return (
                                    <div key={step.number} className="flex flex-col items-center">
                                        {/* Circle */}
                                        <div
                                            className={`
                                                w-10 h-10 rounded-full flex items-center justify-center
                                                font-semibold text-sm transition-all duration-300
                                                ${isCompleted
                                                    ? 'bg-white text-black'
                                                    : isActive
                                                        ? 'bg-white text-black ring-4 ring-white/30'
                                                        : 'bg-white/10 text-white/40 border-2 border-white/20'
                                                }
                                            `}
                                        >
                                            {isCompleted ? (
                                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                </svg>
                                            ) : (
                                                step.number
                                            )}
                                        </div>

                                        {/* Label */}
                                        <span
                                            className={`
                                                mt-3 text-sm font-medium transition-colors duration-300
                                                ${isCompleted || isActive ? 'text-white' : 'text-white/40'}
                                            `}
                                        >
                                            {step.label}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile View */}
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
                        className="h-full bg-white transition-all duration-500 ease-out rounded-full"
                        style={{ width: `${(currentStep / 3) * 100}%` }}
                    />
                </div>
            </div>
        </div>
    );
}
