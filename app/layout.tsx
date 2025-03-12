// app/layout.tsx

import type { Metadata } from "next";
import { Inter, Montserrat } from "next/font/google";
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ThemeProvider } from '@/components/theme/ThemeProvider';
import { JsonLd, createPersonSchema, createWebsiteSchema } from '@/components/layout/JsonLd';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import Script from 'next/script';
import Cursor from '@/components/ui/Cursor';
import "./globals.css";
import AnimatedLayout from "@/components/layout/AnimatedLayout";

// Optimize font loading
const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  preload: true,
  fallback: ['system-ui', 'sans-serif']
})

const montserrat = Montserrat({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-montserrat',
  preload: true,
  weight: ['400'],
  fallback: ['system-ui', 'sans-serif']
});

// Define the primary domain - using www.pinaka3d.com as primary
const PRIMARY_DOMAIN = "https://www.pinaka3d.com";

export const metadata: Metadata = {
  title: {
    default: "Ravi Koomera - Motion Designer & Creative Developer",
    template: "%s - Ravi Koomera",
  },
  description: "Portfolio showcasing motion design and web development projects by Ravi Koomera.",
  keywords: ["motion design", "web development", "portfolio", "3D animation", "Ravi Koomera", "creative developer"],
  authors: [{ name: "Ravi Koomera" }],
  creator: "Ravi Koomera",
  publisher: "Ravi Koomera",
  metadataBase: new URL(PRIMARY_DOMAIN),
  alternates: {
    canonical: "/",
    languages: {
      'en-US': '/',
    },
  },
  openGraph: {
    title: "Ravi Koomera - Motion Designer & Developer",
    description: "Portfolio showcasing motion design and web development projects by Ravi Koomera.",
    url: PRIMARY_DOMAIN,
    siteName: "Ravi Koomera Portfolio",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: `${PRIMARY_DOMAIN}/images/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: "Ravi Koomera - Motion Designer & Developer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ravi Koomera - Motion Designer & Developer",
    description: "Portfolio showcasing motion design and web development projects by Ravi Koomera.",
    creator: "@ravikoomera",
    images: [`${PRIMARY_DOMAIN}/images/twitter-image.jpg`],
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
};

export const viewport = {
  width: "device-width",
  initialScale: 1.0,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html 
      lang="en" 
      className={`${inter.variable} ${montserrat.variable} scroll-smooth`}
    >
      <head>
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
          crossOrigin="anonymous"
        />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
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
            <Cursor />
          </AnimatedLayout>
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
        
        {/* Google Analytics - Load with afterInteractive strategy */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-XXXXXXXXXX');
          `}
        </Script>
      </body>
    </html>
  );
}