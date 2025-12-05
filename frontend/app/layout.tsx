import type { Metadata } from "next";
import "./globals.css";
import SplashScreen from "./components/ui/SplashScreen";

export const metadata: Metadata = {
  title: "Frontend",
  description: "Minimal blank page",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-screen flex flex-col">
        <SplashScreen />
        <main className="flex-grow">
          {children}
        </main>
      </body>
    </html>
  );
}
