// app/layout.tsx

import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ThemeProvider } from '@/components/theme/ThemeProvider';
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={montserrat.className}>
        <ThemeProvider>
          <AnimatedLayout>
            <div className="flex min-h-screen flex-col">
              <Header />
              <main className="flex-grow">{children}</main>
              <Footer />
            </div>
          </AnimatedLayout>
        </ThemeProvider>
      </body>
    </html>
  );
}