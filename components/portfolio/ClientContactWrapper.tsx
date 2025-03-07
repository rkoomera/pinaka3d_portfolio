'use client';

import dynamic from 'next/dynamic';

// Client component import with no SSR
const ContactForm = dynamic(() => import('@/components/portfolio/ContactForm').then((mod) => mod.ContactForm), {
  ssr: false,
});

export function ClientContactWrapper() {
  return <ContactForm />;
} 