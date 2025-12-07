"use client";

import { useEffect, useState } from "react";

/* ---------------------------------------------
   HUMANTEE — ADAPTIVE PAGE CONTAINER SYSTEM
   Dynamic Header Height • Responsive Spacing
---------------------------------------------- */

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
  adaptiveSpacing?: boolean;
}

export default function PageContainer({ 
  children, 
  className = "",
  adaptiveSpacing = true 
}: PageContainerProps) {
  const [headerHeight, setHeaderHeight] = useState(72);
  const [isClient, setIsClient] = useState(false);
  const [viewportHeight, setViewportHeight] = useState(0);

  useEffect(() => {
    setIsClient(true);
    
    const updateDimensions = () => {
      // Header height
      const header = document.getElementById("site-header");
      if (header) {
        const height = header.offsetHeight;
        setHeaderHeight(height);
        document.documentElement.style.setProperty("--header-height", `${height}px`);
      }

      // Viewport height
      setViewportHeight(window.innerHeight);
    };

    // Reset scroll to top on mount/refresh
    if (typeof window !== 'undefined') {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }

    updateDimensions();

    // Watch for changes
    const resizeObserver = new ResizeObserver(updateDimensions);
    const header = document.getElementById("site-header");
    if (header) {
      resizeObserver.observe(header);
    }

    window.addEventListener("resize", updateDimensions);
    
    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateDimensions);
    };
  }, []);

  // Separate effect for scroll reset to ensure it happens after mount
  useEffect(() => {
    // Force scroll to top after a short delay to ensure DOM is ready
    const timer = setTimeout(() => {
      if (typeof window !== 'undefined') {
        window.scrollTo(0, 0);
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
        
        // Also reset scroll history to prevent browser restore
        if ('scrollRestoration' in history) {
          history.scrollRestoration = 'manual';
        }
      }
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // Adaptive spacing calculation
  const calculatePadding = () => {
    if (!isClient) return "80px";

    if (!adaptiveSpacing) {
      return `${headerHeight + 12}px`;
    }

    // Mobile: tighter spacing
    if (viewportHeight < 768) {
      return `${headerHeight + 8}px`;
    }
    
    // Tablet: medium spacing
    if (viewportHeight < 1024) {
      return `${headerHeight + 10}px`;
    }
    
    // Desktop: standard spacing
    return `${headerHeight + 12}px`;
  };

  const paddingTop = calculatePadding();

  return (
    <div 
      className={className}
      style={{ paddingTop }}
    >
      {children}
    </div>
  );
}
