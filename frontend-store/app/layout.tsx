import type { Metadata, Viewport } from "next";
import "./globals.css";

import { Providers } from "./providers";
import { validateEnvironment } from "@/lib/config/env-validator";

import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import MainContentWrapper from "./components/layout/MainContentWrapper";

import localFont from "next/font/local";
import { Darker_Grotesque, Meddon, Bonheur_Royale } from "next/font/google";

/* ------------------------------------------------------------
   Environment validation (SERVER)
------------------------------------------------------------ */
validateEnvironment();

/* ------------------------------------------------------------
   Fonts (SERVER — loaded once)
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
   METADATA — SINGLE SOURCE OF TRUTH
------------------------------------------------------------ */
export const metadata: Metadata = {
  metadataBase: new URL("https://humantee.in"),

  title: {
    default: "Premium Heavyweight Handcrafted T-Shirts | HumanTee",
    template: "%s | HumanTee",
  },

  description:
    "Heavyweight handcrafted t-shirts designed for everyday wear and long life. Limited designs, premium fabric, and free shipping above ₹2000.",

  keywords: [
    "heavyweight t-shirts",
    "premium t-shirts",
    "handcrafted apparel",
    "durable tees",
    "luxury everyday wear",
  ],

  authors: [{ name: "HumanTee" }],
  creator: "HumanTee",
  publisher: "HumanTee",

  icons: {
    icon: "/metaimages/favicon.png",
    shortcut: "/favicon.ico",
    apple: "/metaimages/apple-touch-icon.png",
  },

  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://humantee.in",
    siteName: "HumanTee",
    title: "Premium Heavyweight Handcrafted T-Shirts | HumanTee",
    description: "Built for comfort, durability, and everyday luxury.",
    images: [
      {
        url: "/metaimages/seoimage.webp",
        width: 1200,
        height: 630,
        alt: "HumanTee Premium Collection",
      },
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
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

/* ------------------------------------------------------------
   VIEWPORT
------------------------------------------------------------ */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
};

/* ------------------------------------------------------------
   ROOT LAYOUT (SERVER)
------------------------------------------------------------ */
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`
          min-h-screen
          bg-brand-bg
          text-brand-text
          antialiased
          overflow-x-hidden
          ${geist.variable}
          ${zalandoSans.variable}
          ${meddon.variable}
          ${bonheurRoyale.variable}
          ${benzin.variable}
        `}
      >
        <Providers>
          <Header />

          <main className="flex-1 min-h-[calc(100vh-400px)]">
            <MainContentWrapper>{children}</MainContentWrapper>
          </main>

          <Footer />
        </Providers>
      </body>
    </html>
  );
}
