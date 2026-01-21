"use client";

import { useEffect, useRef, useState, useCallback, memo, useMemo } from "react";
import { FiMenu, FiX, FiShoppingBag } from "react-icons/fi";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { AnimatePresence } from "framer-motion";

import { useHeaderContext } from "../shared/useHeaderContext";
import { useCartSummary } from "@/app/contexts/CartContext";
import { useAuth } from "@/app/contexts/AuthContext";
import { AuthStatus, AuthStatusMobile } from "./components/AuthStatus";
import { MobileMenu, CartBadge, HeaderSkeleton } from "./components";
import { useHeaderSettings } from "./hooks/useHeaderSettings";
import { HEADER_Z_INDEX, NAV_LINKS, ICON_SIZES } from "./constants";
import { FOCUS_RING } from "../shared/design-tokens";

function Header() {
  const { totalItems } = useCartSummary();
  const { user, isAuthenticated } = useAuth();
  const pathname = usePathname();
  // Get header-footer settings from centralized cache
  const { settings, isLoading } = useHeaderSettings();

  // Hide header on maintenance page
  if (pathname?.startsWith('/maintenance')) {
    return null;
  }

  const ref = useRef<HTMLDivElement>(null);
  const { setHeaderHeight } = useHeaderContext();
  const [open, setOpen] = useState(false);
  const [currentHeight, setCurrentHeight] = useState(60);

  // Sync header height to global CSS var
  useEffect(() => {
    const update = () => {
      if (!ref.current) return;
      const h = ref.current.offsetHeight;
      setHeaderHeight(h);
      setCurrentHeight(h);
      document.documentElement.style.setProperty("--header-height", `${h}px`);
    };

    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [setHeaderHeight]);

  // Auto-close menu on outside click
  useEffect(() => {
    if (!open) return;
    const close = () => setOpen(false);
    window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, [open]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) {
        setOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open]);

  const stopPropagation = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
  }, []);

  const handleMenuToggle = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setOpen(prev => !prev);
  }, []);

  const desktopNavLinks = useMemo(
    () => NAV_LINKS.filter(link => !link.mobileOnly),
    []
  );

  // Protected routes that require authentication
  const protectedRoutes = ['/orders', '/account'];

  // Handle navigation to protected routes (use router.push for proper history)
  const handleProtectedNavigation = useCallback((e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (protectedRoutes.includes(href) && !isAuthenticated) {
      e.preventDefault();
      // Use window.location for navigation to preserve history stack
      window.location.assign(`/login?redirect=${encodeURIComponent(href)}`);
    }
  }, [isAuthenticated]);

  return (
    <div
      ref={ref}
      id="site-header"
      className="fixed top-2 sm:top-3 left-1/2 -translate-x-1/2 w-full max-w-screen-2xl px-3 sm:px-4 md:px-6"
      style={{ zIndex: HEADER_Z_INDEX.CONTAINER }}
    >
      <header
        className="
          h-[54px] xs:h-[56px] sm:h-[60px] md:h-[64px] lg:h-[68px] xl:h-[72px]
          rounded-full luxury-glass backdrop-blur-xl
          bg-black/40
          border border-white/10
          shadow-[0_8px_32px_-12px_rgba(0,0,0,0.6),0_0_0_1px_rgba(255,255,255,0.05)_inset]
          flex items-center justify-between
          px-3 xs:px-4 sm:px-5 md:px-6
          relative
        "
        style={{ zIndex: HEADER_Z_INDEX.HEADER }}
      >
        {isLoading ? (
          <HeaderSkeleton />
        ) : (
          <>
            {/* MOBILE MENU BUTTON */}
            <button
              onClick={handleMenuToggle}
              className="
            md:hidden p-2.5 sm:p-3 text-white 
            hover:text-white/90 hover:bg-white/5 rounded-lg
            active:scale-95 transition-all duration-200
            min-w-[44px] min-h-[44px]
            ${FOCUS_RING.subtle}
          "
              aria-label="Navigation menu"
              aria-expanded={open}
              aria-controls="mobile-nav"
            >
              {open ? (
                <FiX size={ICON_SIZES.mobile} className="sm:w-[22px] sm:h-[22px]" />
              ) : (
                <FiMenu size={ICON_SIZES.mobile} className="sm:w-[22px] sm:h-[22px]" />
              )}
            </button>

            {/* BRAND */}
            <Link
              href="/"
              prefetch={false}
              onClick={stopPropagation}
              className="flex items-center gap-2 sm:gap-3 transition-all duration-300 hover:opacity-90 min-w-0 flex-shrink"
            >
              {settings?.logo_url && settings.logo_url.trim() !== '' && (
                <Image
                  src={settings?.logo_url}
                  alt={settings?.brand_name}
                  width={160}
                  height={40}
                  className="h-[32px] xs:h-[36px] sm:h-[40px] md:h-[44px] lg:h-[48px] w-auto flex-shrink-0"
                  priority
                  onError={(e) => {
                    // Fallback to local logo on error
                    const img = e.target as HTMLImageElement;
                    img.src = '/images/humantee-logo.png';
                  }}
                />
              )}

              {/* Fallback to local logo if no URL from DB */}
              {(!settings?.logo_url || settings.logo_url.trim() === '') && (
                <Image
                  src="/images/humantee-logo.png"
                  alt={settings?.brand_name}
                  width={160}
                  height={40}
                  className="h-[32px] xs:h-[36px] sm:h-[40px] md:h-[44px] lg:h-[48px] w-auto flex-shrink-0"
                  priority
                />
              )}

              <span
                className="
                text-white font-bold uppercase tracking-[0.14em] sm:tracking-[0.16em]
                text-[16px] xs:text-[17px] sm:text-[18px] md:text-[20px] lg:text-[22px] xl:text-[24px]
                select-none leading-none
                max-w-[160px] xs:max-w-[200px] sm:max-w-[240px] md:max-w-none
                overflow-hidden text-ellipsis whitespace-nowrap
              "
                title={settings?.brand_name}
              >
                {settings?.brand_name}
              </span>
            </Link>

            {/* DESKTOP NAV */}
            <nav className="hidden md:flex items-center gap-10 absolute left-1/2 -translate-x-1/2">
              {desktopNavLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  prefetch={link.href === '/shop' ? true : false}
                  onClick={(e) => handleProtectedNavigation(e, link.href)}
                  className={`
                uppercase tracking-[0.20em] transition-all duration-300
                ${pathname === link.href
                      ? 'text-white'
                      : 'text-white/80 hover:text-white hover:drop-shadow-[0_0_6px_rgba(255,255,255,0.3)]'
                    }
                text-[14px] xl:text-[15px] py-1.5
                relative group
                ${FOCUS_RING.glow}
              `}
                >
                  {link.label}
                  <span className={`
                absolute bottom-0 left-0 h-[1px] bg-white transition-all duration-300
                ${pathname === link.href ? 'w-full' : 'w-0 group-hover:w-full'}
              `} />
                </Link>
              ))}
            </nav>

            {/* RIGHT SECTION */}
            <div className="flex items-center gap-6">
              {/* Mobile Icons */}
              <div className="md:hidden flex items-center gap-3 sm:gap-4 flex-shrink-0">
                <div onClick={stopPropagation}>
                  <AuthStatusMobile isAuthenticated={isAuthenticated} customerName={user?.email} />
                </div>

                <Link
                  href="/cart"
                  prefetch={true}
                  onClick={stopPropagation}
                  className="
                relative p-1 
                hover:scale-105 transition-transform duration-200
              "
                  aria-label={`Shopping cart with ${totalItems} ${totalItems === 1 ? 'item' : 'items'}`}
                >
                  <FiShoppingBag size={ICON_SIZES.mobile} className="sm:w-[22px] sm:h-[22px] text-white" />
                  <CartBadge count={totalItems} variant="mobile" />
                </Link>

                {/* Screen reader announcement */}
                <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">
                  {totalItems > 0 && `${totalItems} ${totalItems === 1 ? 'item' : 'items'} in shopping cart`}
                </div>
              </div>

              {/* Desktop Icons */}
              <div className="hidden md:flex items-center gap-6">
                <AuthStatus isAuthenticated={isAuthenticated} customerName={user?.email} />

                <Link
                  href="/cart"
                  prefetch={true}
                  className="
                relative transition-all duration-300
                text-white hover:text-white/90
                hover:scale-110 hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]
                p-1
              "
                  title="Cart"
                >
                  <FiShoppingBag size={ICON_SIZES.desktop} />
                  <CartBadge count={totalItems} variant="desktop" />
                </Link>
              </div>
            </div>
          </>
        )}
      </header>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {open && (
          <MobileMenu
            open={open}
            onClose={() => setOpen(false)}
            headerHeight={currentHeight}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default memo(Header);
