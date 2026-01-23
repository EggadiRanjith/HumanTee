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
    default: "Premium Heavyweight Handcrafted T-Shirts | HumanTee",
    template: "%s | HumanTee"
  },
  description: "Heavyweight handcrafted t-shirts designed for everyday wear and long life. Limited designs, premium fabric, and free shipping above ₹2000.",
  keywords: ["heavyweight t-shirts", "premium t-shirts", "handcrafted apparel", "durable tees", "limited edition clothing", "luxury everyday wear"],
  authors: [{ name: "HumanTee" }],
  creator: "HumanTee",
  publisher: "HumanTee",
  alternates: {
    canonical: "https://humantee.in",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://humantee.com",
    title: "Premium Heavyweight Handcrafted T-Shirts | HumanTee",
    description: "Built for comfort, durability, and everyday luxury.",
    siteName: "HumanTee",
    images: [
      {
        url: "/images/banner1.webp",
        width: 1200,
        height: 630,
        alt: "HumanTee Premium Collection"
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Premium Heavyweight Handcrafted T-Shirts | HumanTee",
    description: "Everyday luxury tees made with premium heavyweight fabric.",
    images: ["/images/banner1.webp"],
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
  maximumScale: 1, // Prevent accidental zoom for better mobile UX
  viewportFit: "cover",
};

/* ------------------------------------------------------------
   Root Layout (SERVER COMPONENT — FAST)
------------------------------------------------------------ */
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Favicons and App Icons */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#000000" />

        {/* Preload critical fonts for faster FCP */}

        {/* Preconnect to external domains for faster loading */}
        <link rel="preconnect" href="https://res.cloudinary.com" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
        <link rel="preconnect" href="https://www.instagram.com" />
        <link rel="preconnect" href="https://maps.google.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://www.instagram.com" />
        <link rel="dns-prefetch" href="https://maps.google.com" />
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://images.unsplash.com" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />

        {/* Preload critical assets */}
        <link rel="preload" href="/images/humantee-logo.png" as="image" type="image/png" />
        <link rel="preload" href="/videos/hero-video.mp4" as="video" type="video/mp4" />

      </head>
      <body className="min-h-screen bg-brand-bg text-brand-text antialiased font-sans overflow-x-hidden">

        {/* Client providers moved OUT of layout for performance */}
        <Providers>

          <Header />

          {/* Page Content with min-height to prevent collapse during loading */}
          <div className="flex-1 min-h-[calc(100vh-400px)]">
            <MainContentWrapper>
              {children}
            </MainContentWrapper>
          </div>

          <Footer />

        </Providers>

      </body>
    </html>
  );
}

