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
        <div className="mb-8 sm:mb-10 text-center pt-12">
            <h1 className="text-[20px] xs:text-[22px] sm:text-[30px] lg:text-[38px] font-light uppercase tracking-[0.14em] brand-text-primary">
                {title}
            </h1>
            <p className="brand-text-muted text-[9px] xs:text-[10px] sm:text-[11px] uppercase tracking-[0.22em] mt-2">
                {subtitle}
            </p>
        </div>
    );
}
