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
    <Section className="py-24 md:py-32" background="white">
      <Container>
        <div className="flex flex-col items-center text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-dark dark:text-light transition-colors duration-200">
            404 - Page Not Found
          </h1>
          <p className="text-lg mb-8 text-dark-secondary dark:text-gray-300 transition-colors duration-200 max-w-2xl">
            The page you are looking for doesn't exist or has been moved.
          </p>
          <Button href="/" variant="primary" size="lg">
            Return Home
          </Button>
        </div>
      </Container>
    </Section>
  );
}