"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavbarProps {
  large?: boolean;
}

export default function Navbar({ large = false }: NavbarProps) {
  const pathname = usePathname();

  const items = [
    { href: "/shop", label: "SHOP" },
    { href: "/orders", label: "ORDERS" },
    { href: "/profile", label: "PROFILE" },
  ];

  return (
    <nav className={`flex items-center ${large ? "gap-12 xl:gap-16" : "gap-10 xl:gap-14"}`}>
      {items.map((item) => {
        const active =
          pathname === item.href ||
          (item.href !== "/" && pathname.startsWith(item.href));

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`
              relative
              uppercase
              tracking-[0.20em]
              transition-all duration-200
              ${active ? "text-white" : "text-white/60 hover:text-white"}
              ${large ? "text-[15px] xl:text-[16px]" : "text-[14px] xl:text-[15px]"}
              py-1.5
            `}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
