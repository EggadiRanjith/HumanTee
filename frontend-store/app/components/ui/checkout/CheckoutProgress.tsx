/**
 * Checkout Progress Indicator
 * Shows current step in checkout flow (Shipping -> Payment -> Confirmation)
 */

interface CheckoutProgressProps {
    currentStep: 1 | 2 | 3;
}

export function CheckoutProgress({ currentStep }: CheckoutProgressProps) {
    const steps = [
        { number: 1, label: 'Ship' },
        { number: 2, label: 'Pay' },
        { number: 3, label: 'Done' },
    ];

    return (
        <div className="mb-4 sm:mb-6">
            <div className="flex items-center justify-between sm:justify-center gap-1 sm:gap-4 max-w-2xl mx-auto">
                {steps.map((step, index) => (
                    <div key={step.number} className="flex items-center flex-shrink-0">
                        {/* Step Circle */}
                        <div className="flex items-center">
                            <div
                                className={`
                  w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full
                  flex items-center justify-center
                  text-xs sm:text-sm md:text-base font-medium
                  ${currentStep >= step.number
                                        ? 'bg-white text-black shadow-lg'
                                        : 'bg-white/10 border border-white/20 text-white/40'
                                    }
                `}
                            >
                                {step.number}
                            </div>
                            <span
                                className={`
                  ml-1.5 sm:ml-2
                  text-[10px] xs:text-xs sm:text-sm
                  uppercase tracking-wider
                  ${currentStep >= step.number
                                        ? 'text-white font-medium'
                                        : 'text-white/40'
                                    }
                `}
                            >
                                {step.label}
                            </span>
                        </div>

                        {/* Connector Line */}
                        {index < steps.length - 1 && (
                            <div className="flex-1 h-px bg-white/20 min-w-[20px] max-w-[60px] sm:max-w-[80px] mx-1 sm:mx-2" />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
