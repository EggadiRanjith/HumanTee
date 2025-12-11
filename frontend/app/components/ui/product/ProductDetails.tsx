/**
 * Product Details
 * Description and key details section
 */

interface ProductDetailsProps {
    description: string;
    details: string[];
}

export function ProductDetails({ description, details }: ProductDetailsProps) {
    return (
        <div className="pt-2 space-y-4">
            <div>
                <h3 className="text-white/70 text-xs uppercase tracking-[0.15em] mb-2">
                    Description
                </h3>
                <p className="text-white/65 text-[0.9rem] leading-relaxed">
                    {description}
                </p>
            </div>

            <div>
                <h3 className="text-white/70 text-xs uppercase tracking-[0.15em] mb-2">
                    Key Details
                </h3>
                <ul className="space-y-1.5">
                    {details.map((detail, i) => (
                        <li
                            key={i}
                            className="text-white/60 text-[0.9rem] flex gap-2"
                        >
                            <span className="text-white/30">•</span>
                            {detail}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
