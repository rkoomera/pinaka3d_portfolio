// app/not-found.tsx
// This is a server component
import { Metadata, Viewport } from 'next';
import { Section } from '@/components/ui/Section';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: '404 - Page Not Found',
  description: "The page you are looking for doesn't exist or has been moved.",

  robots: {
    index: false,
    follow: true,
  }
};

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
      <h2 className="text-h2 mb-4">Page Not Found</h2>
      <p className="mb-8 max-w-lg">Sorry, we couldn't find the page you were looking for.</p>
      <Link 
        href="/" 
        className="px-6 py-3 bg-brand hover:bg-brand-dark text-white font-medium rounded-lg transition-colors"
      >
        Return Home
      </Link>
    </div>
  );
}