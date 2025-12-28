import type { Metadata, Viewport } from "next";
import "./globals.css";

import { Providers } from "./providers"; // client providers isolated
import { validateEnvironment } from "@/lib/config/env-validator"; // Environment validation

import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import MainContentWrapper from "./components/layout/MainContentWrapper";

import localFont from "next/font/local";
import { Darker_Grotesque, Meddon, Bonheur_Royale } from "next/font/google";

// Validate environment on app startup
validateEnvironment();

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
  display: "swap",
});


const zalandoSans = Darker_Grotesque({
  weight: "300",
  subsets: ["latin"],
  variable: "--font-zalando-sans",
  display: "swap",
});

const meddon = Meddon({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-meddon",
  display: "swap",
});

const bonheurRoyale = Bonheur_Royale({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bonheur-royale",
  display: "swap",
});

const benzin = localFont({
  src: [{ path: "../public/fonts/benzin/Benzin-ExtraBold.ttf", weight: "900" }],
  variable: "--font-benzin",
  display: "swap",
});

/* ------------------------------------------------------------
   Metadata
------------------------------------------------------------ */
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'),
  title: {
    default: "HumanTee - Premium Handcrafted T-Shirts | Since 1931",
    template: "%s | HumanTee"
  },
  description: "Discover luxury premium craftsmanship with HumanTee. Handcrafted heavyweight tees with bespoke designs. Free shipping on orders above ₹2000.",
  keywords: ["premium t-shirts", "luxury clothing", "handcrafted apparel", "heavyweight tees", "sustainable fashion", "limited edition"],
  authors: [{ name: "HumanTee" }],
  creator: "HumanTee",
  publisher: "HumanTee",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://humantee.com",
    title: "HumanTee - Premium Handcrafted T-Shirts",
    description: "Luxury fashion since 1931. Handcrafted with precision.",
    siteName: "HumanTee",
    images: [
      {
        url: "/images/banner1.png",
        width: 1200,
        height: 630,
        alt: "HumanTee Premium Collection"
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "HumanTee - Premium Handcrafted T-Shirts",
    description: "Luxury fashion since 1931. Handcrafted with precision.",
    images: ["/images/banner1.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
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
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Preload critical fonts for faster FCP */}

        {/* Preconnect to external domains for faster loading */}
        <link rel="preconnect" href="https://www.instagram.com" />
        <link rel="preconnect" href="https://maps.google.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://www.instagram.com" />
        <link rel="dns-prefetch" href="https://maps.google.com" />
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://images.unsplash.com" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />

        {/* Preload critical assets */}
        <link rel="preload" href="/videos/hero-video.mp4" as="video" type="video/mp4" />

      </head>
      <body className="min-h-screen bg-brand-bg text-brand-text antialiased font-sans overflow-x-hidden">

        {/* Client providers moved OUT of layout for performance */}
        <Providers>

          <Header />

          {/* Page Content - Wrapper controls padding based on route */}
          <MainContentWrapper>
            {children}
          </MainContentWrapper>

          <Footer />

        </Providers>

      </body>
    </html>
  );
}

