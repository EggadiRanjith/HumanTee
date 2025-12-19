"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavLink({
  href,
  children,
  onClick,
}: {
  href: string;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  const pathname = usePathname();
  const active =
    pathname === href || (href !== "/" && pathname.startsWith(href));

  return (
    <Link
      href={href}
      onClick={onClick}
      className={`
        relative px-1 py-0.5 
        uppercase tracking-[0.14em]
        text-xs 
        ${active ? "text-white" : "text-white/60 hover:text-white"}
      `}
    >
      {children}

      {/* Underline */}
      {active && (
        <span className="absolute bottom-0 left-0 w-full h-[1px] bg-white"></span>
      )}
    </Link>
  );
}
