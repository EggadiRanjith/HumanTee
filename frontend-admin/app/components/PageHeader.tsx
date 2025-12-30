/**
 * Page Header Component
 * Reusable header for admin pages
 */

import Link from 'next/link';

interface PageHeaderProps {
    title: string;
    description?: string;
    action?: {
        label: string;
        href: string;
        icon?: React.ReactNode;
    };
    breadcrumbs?: Array<{
        label: string;
        href?: string;
    }>;
}

export function PageHeader({ title, description, action, breadcrumbs }: PageHeaderProps) {
    return (
        <div className="mb-6">
            {breadcrumbs && breadcrumbs.length > 0 && (
                <nav className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                    {breadcrumbs.map((crumb, index) => (
                        <span key={index} className="flex items-center gap-2">
                            {crumb.href ? (
                                <Link href={crumb.href} className="hover:text-black transition-colors">
                                    {crumb.label}
                                </Link>
                            ) : (
                                <span className="text-black">{crumb.label}</span>
                            )}
                            {index < breadcrumbs.length - 1 && <span>/</span>}
                        </span>
                    ))}
                </nav>
            )}

            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-black">{title}</h1>
                    {description && (
                        <p className="text-gray-600 mt-1">{description}</p>
                    )}
                </div>

                {action && (
                    <Link
                        href={action.href}
                        className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-900 transition-colors font-medium"
                    >
                        {action.icon}
                        {action.label}
                    </Link>
                )}
            </div>
        </div>
    );
}
