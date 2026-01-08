/**
 * Mobile Product Wizard
 * Step-by-step product creation for mobile devices
 * No tabs, no scrolling - one section at a time
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import BasicInfoTab from './tabs/BasicInfoTab';
import MediaTab from './tabs/MediaTab';
import PricingTab from './tabs/PricingTab';
import VariantsTab from './tabs/VariantsTab';
import InventoryTab from './tabs/InventoryTab';
import OrganizationTab from './tabs/OrganizationTab';
import { useBasicInfoStore } from '@/domains/product/basic-info/basic-info.store';
import { usePricingStore } from '@/domains/product/pricing/pricing.store';
import { aggregateProductData, sanitizeProductDataForAPI, markAllDomainsClean } from '@/domains/product/autosave/autosave.service';
import { toast } from 'sonner';
import apiClient from '@/lib/api-client';

const STEPS = [
    { key: 'basic', label: 'Basic Info', component: BasicInfoTab },
    { key: 'media', label: 'Media', component: MediaTab },
    { key: 'pricing', label: 'Pricing', component: PricingTab },
    { key: 'variants', label: 'Variants', component: VariantsTab },
    { key: 'inventory', label: 'Inventory', component: InventoryTab },
    { key: 'organization', label: 'Organization', component: OrganizationTab },
] as const;

export default function MobileProductWizard() {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(0);
    const [isSaving, setIsSaving] = useState(false);

    // Get validation state
    const { name } = useBasicInfoStore();
    const { price } = usePricingStore();

    const CurrentStepComponent = STEPS[currentStep].component;
    const isFirstStep = currentStep === 0;
    const isLastStep = currentStep === STEPS.length - 1;
    const progress = ((currentStep + 1) / STEPS.length) * 100;

    // Validation for current step
    const canContinue = () => {
        if (currentStep === 0) {
            // Basic info validation
            return name.trim().length > 0;
        }
        if (currentStep === 2) {
            // Pricing validation
            return price > 0;
        }
        return true;
    };

    const handleNext = () => {
        if (!canContinue()) {
            toast.error('Please fill in all required fields');
            return;
        }
        if (currentStep < STEPS.length - 1) {
            setCurrentStep(currentStep + 1);
            window.scrollTo(0, 0);
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
            window.scrollTo(0, 0);
        }
    };

    const handleSave = async () => {
        if (!canContinue()) {
            toast.error('Please fill in all required fields');
            return;
        }

        setIsSaving(true);
        try {
            const productData = aggregateProductData();
            const sanitizedData = sanitizeProductDataForAPI(productData);
            const response = await apiClient.post('/admin/products', sanitizedData);
            toast.success('Product created successfully!');
            markAllDomainsClean();
            router.push('/admin/products');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to create product');
            console.error(error);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Header with Progress */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
                <div className="px-4 py-4">
                    {/* Step Indicator */}
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium text-gray-900">
                            Step {currentStep + 1} of {STEPS.length}
                        </span>
                        <span className="text-xs text-gray-500">
                            {STEPS[currentStep].label}
                        </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                            className="bg-black h-2 rounded-full transition-all duration-300"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>
            </div>

            {/* Step Content */}
            <div className="flex-1 overflow-y-auto px-4 py-6">
                <div className="max-w-2xl mx-auto">
                    <h2 className="text-xl font-bold text-black mb-4">
                        {STEPS[currentStep].label}
                    </h2>
                    <CurrentStepComponent />
                </div>
            </div>

            {/* Navigation Buttons */}
            <div className="bg-white border-t border-gray-200 px-4 py-4 sticky bottom-0">
                <div className="max-w-2xl mx-auto flex gap-3">
                    {!isFirstStep && (
                        <button
                            onClick={handleBack}
                            disabled={isSaving}
                            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
                        >
                            ← Back
                        </button>
                    )}

                    {isLastStep ? (
                        <button
                            onClick={handleSave}
                            disabled={isSaving || !canContinue()}
                            className="flex-1 px-4 py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isSaving ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                    Saving...
                                </>
                            ) : (
                                'Save Product'
                            )}
                        </button>
                    ) : (
                        <button
                            onClick={handleNext}
                            disabled={!canContinue()}
                            className="flex-1 px-4 py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Continue →
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
