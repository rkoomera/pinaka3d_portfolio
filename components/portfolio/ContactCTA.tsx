'use client';

import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Button } from '@/components/ui/Button';

export function ContactCTA() {
  return (
    <Section background="white" className="relative">
      <div>
        <SectionHeading 
          title="Let's Work Together"
          subtitle="Have a project in mind? I'd love to hear about it!"
          centered
        />
      </div>
      
      <div className="mt-8 flex justify-center">
        <Button href="/contact" size="lg">
          Contact Me
        </Button>
      </div>
    </Section>
  );
} 