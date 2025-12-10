import type { Metadata, Viewport } from "next";
import "./globals.css";

import { Providers } from "./providers"; // client providers isolated

import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";

import localFont from "next/font/local";
import { Darker_Grotesque, Meddon, Bonheur_Royale } from "next/font/google";

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

const zalandoSans = Darker_Grotesque({
  weight: "300",
  subsets: ["latin"],
  variable: "--font-zalando-sans",
});

const meddon = Meddon({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-meddon",
});

const bonheurRoyale = Bonheur_Royale({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bonheur-royale",
});

const benzin = localFont({
  src: [{ path: "../public/fonts/benzin/Benzin-ExtraBold.ttf", weight: "900" }],
  variable: "--font-benzin",
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
    <html lang="en" className={`${geist.variable} ${tanPearl.variable} ${zalandoSans.variable} ${meddon.variable} ${bonheurRoyale.variable} ${benzin.variable}`}>
      <body className="min-h-screen bg-brand-bg text-brand-text antialiased font-geist overflow-x-hidden">

        {/* Client providers moved OUT of layout for performance */}
        <Providers>

          <Header />

          {/* Page Content */}
          <div>
            {children}
          </div>
          <Footer />

        </Providers>

      </body>
    </html>
  );
}
