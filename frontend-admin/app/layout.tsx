import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "./context/AuthContext";
import { QueryProvider } from "./context/QueryProvider";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { Toaster } from "sonner";
import localFont from "next/font/local";
import { getBrandName, BRAND_CONFIG } from "@/lib/config/brand";

// Geist font (matching store)
const geist = localFont({
  src: [
    { path: "../public/fonts/geist/Geist-Light.woff2", weight: "300" },
    { path: "../public/fonts/geist/Geist-Regular.woff2", weight: "400" },
    { path: "../public/fonts/geist/Geist-SemiBold.woff2", weight: "700" },
  ],
  variable: "--font-geist",
  display: "swap",
});

// Generate metadata with dynamic brand name
export async function generateMetadata(): Promise<Metadata> {
  const brandName = await getBrandName();
  return {
    title: `${brandName} ${BRAND_CONFIG.adminSuffix}`,
    description: `${brandName} admin operations panel`,
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={geist.variable}>
      <body className="antialiased font-geist">
        <ErrorBoundary>
          <QueryProvider>
            <AuthProvider>
              {children}
            </AuthProvider>
          </QueryProvider>
        </ErrorBoundary>
        <Toaster position="top-right" richColors expand={true} />
      </body>
    </html>
  );
}
