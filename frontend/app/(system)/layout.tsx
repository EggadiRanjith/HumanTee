import type { Metadata, Viewport } from "next";
import { PageTransitionProvider } from "../components/transition/PageTransitionProvider";

export const metadata: Metadata = {
  title: "System | Humantee",
  description: "System pages for Humantee",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
};

export default function SystemLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="geist_be2b0aef-module__yoY7uq__variable tanpearl_5d1c8c48-module__jfEZta__v">
      <body className="min-h-screen bg-brand-bg text-brand-text antialiased font-geist overflow-x-hidden">
        <PageTransitionProvider>{children}</PageTransitionProvider>
      </body>
    </html>
  );
}
