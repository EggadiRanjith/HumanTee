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
            {/* Unified Progress Bar - Same on Mobile and Desktop */}
            <div className="px-4 max-w-3xl mx-auto">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-white/60 text-[12px] font-medium uppercase tracking-wider">
                        Step {currentStep} of 3
                    </span>
                    <span className="text-white text-[13px] sm:text-[14px] font-medium">
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
