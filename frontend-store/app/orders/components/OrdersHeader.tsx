/**
 * Orders Header Component
 * Page title and description
 */

export function OrdersHeader() {
    return (
        <div className="mb-10">
            <h1 className="text-[26px] sm:text-[34px] lg:text-[42px] font-light uppercase tracking-[0.14em] text-white">
                Orders
            </h1>
            <p className="text-white/45 text-[11px] uppercase tracking-[0.22em] mt-2">
                Track and manage your previous purchases
            </p>
        </div>
    );
}
