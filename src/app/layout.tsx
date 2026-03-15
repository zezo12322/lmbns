import type { Metadata } from "next";
import { Cairo, Lato } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

// Cairo: closest free alternative to DIN Next LT Arabic (brand font)
const arabicFont = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-arabic",
  display: "swap",
});

// Lato: closest free alternative to Calibri (brand font)
const englishFont = Lato({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-english",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Life Makers - Beni Suef",
  description: "Official Platform for Life Makers Foundation - Beni Suef Branch",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Use RTL layout globally
  return (
    <html lang="ar" dir="rtl">
      <body className={cn(arabicFont.variable, englishFont.variable, "font-arabic antialiased")}>
        {children}
      </body>
    </html>
  );
}
