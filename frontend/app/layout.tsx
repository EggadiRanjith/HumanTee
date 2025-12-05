import type { Metadata } from "next";
import "./globals.css";
import Loader from "./components/ui/Loader";
import { PageTransitionProvider } from "./components/transition/PageTransitionProvider";
import localFont from "next/font/local";

const geist = localFont({
  src: [
    {
      path: "../public/fonts/geist/Geist-Light.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "../public/fonts/geist/Geist-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/geist/Geist-SemiBold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-geist",
});

export const metadata: Metadata = {
  title: "Humantee",
  description: "Cinematic luxury experiences",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={geist.variable}>
      <body className="min-h-screen bg-brand-bg text-brand-text antialiased font-geist">
        <Loader duration={3500} variant="cinematic">
          <PageTransitionProvider>{children}</PageTransitionProvider>
        </Loader>
      </body>
    </html>
  );
}