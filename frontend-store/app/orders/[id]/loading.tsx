import { ProductDetailSkeleton } from '@/app/components/ui/loaders';
import { GradientOverlay } from '@/app/components/ui/layout';

export default function Loading() {
    return (
        <div className="min-h-screen brand-bg-dusk pt-[var(--header-height)]">
            <GradientOverlay variant="dusk" />
            <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-10 pb-8 pt-8">
                <div className="space-y-6">
                    {/* Order detail skeleton (reusing product skeleton for now) */}
                    <div className="animate-pulse space-y-4">
                        <div className="h-8 bg-white/10 rounded w-1/3" />
                        <div className="h-4 bg-white/5 rounded w-1/4" />
                    </div>
                    <ProductDetailSkeleton />
                </div>
            </div>
        </div>
    );
}
