// app/not-found.tsx
import Link from 'next/link';
import { Section } from '@/components/ui/Section';
import { Button } from '@/components/ui/Button';

export default function NotFound() {
  return (
    <Section className="flex min-h-[70vh] items-center justify-center">
      <div className="text-center">
        <h1 className="mb-4 text-6xl font-bold text-gray-900">404</h1>
        <h2 className="mb-6 text-3xl font-semibold text-gray-700">Page Not Found</h2>
        <p className="mb-8 text-lg text-gray-600">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Button href="/">
          Back to Home
        </Button>
      </div>
    </Section>
  );
}