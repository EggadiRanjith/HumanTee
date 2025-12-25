/**
 * Reviews Empty State
 * Shows when no reviews are available
 */

import { SectionHeader } from "@/app/components/ui/layout";

export default function ReviewsEmpty() {
    return (
        <section
            className="relative overflow-hidden py-16 sm:py-20 md:py-24 sm:px-6 lg:px-10"
            aria-label="Customer Reviews"
        >
            <div className="px-4 sm:px-0">
                <SectionHeader title="What Our Customers Say" variant="centered" />
            </div>

            <div className="text-center mt-12 px-4">
                <p className="text-gray-500 text-sm">No reviews available at the moment.</p>
            </div>
        </section>
    );
}
