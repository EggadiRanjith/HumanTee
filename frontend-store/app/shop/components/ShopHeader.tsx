/**
 * Shop Header Component
 * Page title and description
 */

interface ShopHeaderProps {
    title?: string;
    subtitle?: string;
}

export function ShopHeader({
    title = "All Products",
    subtitle = "Explore our premium collections"
}: ShopHeaderProps) {
    return (
        <div className="mb-6 sm:mb-8 text-center pt-8 sm:pt-10">
            <h1 className="text-[16px] xs:text-[18px] sm:text-[24px] lg:text-[28px] font-light uppercase tracking-[0.16em] brand-text-primary">
                {title}
            </h1>
            <p className="brand-text-muted text-[10px] xs:text-[11px] sm:text-[11px] uppercase tracking-[0.24em] mt-1.5">
                {subtitle}
            </p>
        </div>
    );
}
