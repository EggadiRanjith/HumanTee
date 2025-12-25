/**
 * Tickets Header Component
 * Page title and description
 */

interface TicketsHeaderProps {
    orderId?: string;
}

export function TicketsHeader({ orderId }: TicketsHeaderProps) {
    return (
        <div className="space-y-1 mb-10">
            <h1 className="text-[28px] sm:text-[36px] font-light tracking-[0.14em] uppercase text-white leading-tight">
                Support Tickets
            </h1>
            <p className="text-white/45 text-[11px] sm:text-[12px] uppercase tracking-[0.22em]">
                {orderId ? `Viewing tickets for order #${orderId.slice(0, 8)}` : 'Manage your support requests'}
            </p>
        </div>
    );
}
