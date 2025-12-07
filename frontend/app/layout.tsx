import type { Metadata, Viewport } from "next";
import "./globals.css";

import { Providers } from "./providers"; // client providers isolated

import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";

import localFont from "next/font/local";

/* ------------------------------------------------------------
   Fonts (loaded once, on server)
------------------------------------------------------------ */
const geist = localFont({
  src: [
    { path: "../public/fonts/geist/Geist-Light.woff2", weight: "300" },
    { path: "../public/fonts/geist/Geist-Regular.woff2", weight: "400" },
    { path: "../public/fonts/geist/Geist-SemiBold.woff2", weight: "700" },
  ],
  variable: "--font-geist",
});

const tanPearl = localFont({
  src: [{ path: "../public/fonts/tan-pearl/TAN-PEARL.ttf", weight: "400" }],
  variable: "--font-tan-pearl",
});

/* ------------------------------------------------------------
   Metadata
------------------------------------------------------------ */
export const metadata: Metadata = {
  title: "Humantee",
  description: "Cinematic luxury experiences",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
};

/* ------------------------------------------------------------
   Root Layout (SERVER COMPONENT — FAST)
------------------------------------------------------------ */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geist.variable} ${tanPearl.variable}`}>
      <body className="min-h-screen bg-brand-bg text-brand-text antialiased font-geist overflow-x-hidden">

        {/* Client providers moved OUT of layout for performance */}
        <Providers>

          <Header />

          {/* Page Content */}
          <div style={{ paddingTop: "var(--header-height)" }}>
            {children}
          </div>
          <Footer />

        </Providers>

      </body>
    </html>
  );
}
