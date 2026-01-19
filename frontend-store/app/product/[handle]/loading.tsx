import { ProductDetailSkeleton } from '@/app/components/ui/loaders';
import { GradientOverlay } from '@/app/components/ui/layout';

export default function Loading() {
    return (
        <div className="min-h-screen brand-bg-dusk pt-[var(--header-height)]">
            <GradientOverlay variant="violet" />
            <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-10 pb-8 pt-8">
                <ProductDetailSkeleton />
            </div>
        </div>
    );
}
