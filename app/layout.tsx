// app/layout.tsx

import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ThemeProvider } from '@/components/theme/ThemeProvider';
import { JsonLd, createPersonSchema, createWebsiteSchema } from '@/components/layout/JsonLd';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import "./globals.css";
import AnimatedLayout from "@/components/layout/AnimatedLayout";

const montserrat = Montserrat({ 
  subsets: ["latin"],
  weight: ["400"],
  display: "swap"
});

export const metadata: Metadata = {
  title: {
    default: "Ravi Koomera - Motion Designer & Developer",
    template: "%s - Ravi Koomera",
  },
  description: "Portfolio showcasing motion design and web development projects by Ravi Koomera.",
  keywords: ["motion design", "web development", "portfolio", "3D animation", "Ravi Koomera", "creative developer"],
  authors: [{ name: "Ravi Koomera" }],
  creator: "Ravi Koomera",
  publisher: "Ravi Koomera",
  metadataBase: new URL("https://www.pinaka3d.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Ravi Koomera - Motion Designer & Developer",
    description: "Portfolio showcasing motion design and web development projects by Ravi Koomera.",
    url: "https://www.pinaka3d.com",
    siteName: "Ravi Koomera Portfolio",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ravi Koomera - Motion Designer & Developer",
    description: "Portfolio showcasing motion design and web development projects by Ravi Koomera.",
    creator: "@ravikoomera",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-video-preview': -1,
      'max-snippet': -1,
    },
  },
  viewport: "width=device-width, initial-scale=1.0",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <JsonLd data={createPersonSchema()} />
        <JsonLd data={createWebsiteSchema()} />
      </head>
      <body className={`${montserrat.className} overflow-x-hidden`}>
        <ThemeProvider>
          <AnimatedLayout>
            <div className="flex min-h-screen flex-col">
              <Header />
              <main className="flex-grow">{children}</main>
              <Footer />
            </div>
          </AnimatedLayout>
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}