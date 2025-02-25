// components/portfolio/HeroSection.tsx
'use client';

import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { motion } from 'framer-motion';

interface HeroSectionProps {
  title: string;
  subtitle: string;
  ctaText?: string;
  ctaHref?: string;
  secondaryCtaText?: string;
  secondaryCtaHref?: string;
}

export function HeroSection({
  title,
  subtitle,
  ctaText = 'View Projects',
  ctaHref = '/projects',
  secondaryCtaText = 'Contact Me',
  secondaryCtaHref = '/contact',
}: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden bg-white py-20 sm:py-32">
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <motion.h1 
            className="mb-6 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {title}
          </motion.h1>
          
          <motion.p 
            className="mx-auto mb-10 max-w-xl text-lg text-gray-600 sm:text-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {subtitle}
          </motion.p>
          
          <motion.div 
            className="flex flex-col gap-4 sm:flex-row sm:justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Button href={ctaHref} size="lg">
              {ctaText}
            </Button>
            <Button href={secondaryCtaHref} variant="outline" size="lg">
              {secondaryCtaText}
            </Button>
          </motion.div>
        </div>
      </Container>
      
      {/* Background decoration */}
      <div className="absolute -left-20 top-1/4 h-96 w-96 rounded-full bg-blue-50 blur-3xl"></div>
      <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-purple-50 blur-3xl"></div>
    </section>
  );
}