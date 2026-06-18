import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "AI SaaS — The platform built for scale",
  description:
    "Ship AI-powered products faster. Unified API, real-time analytics, and enterprise-grade security — trusted by 2,400+ teams.",
  keywords: ["AI", "SaaS", "platform", "API", "machine learning"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased" suppressHydrationWarning>{children}</body>
    </html>
  );
}
