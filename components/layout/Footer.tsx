// components/layout/Footer.tsx
'use client'

import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import Image from 'next/image';
import { useTheme } from '@/components/theme/ThemeProvider';

export function Footer() {
  const { theme } = useTheme();

  const logoSrc = theme === 'dark' 
    ? "https://gyuznawtihohzzdmhvtw.supabase.co/storage/v1/object/public/project-images//pinaka_logo_dark.svg"
    : "https://gyuznawtihohzzdmhvtw.supabase.co/storage/v1/object/public/project-images//pinaka_logo.svg";

  return (
    <footer className="bg-light dark:bg-dark border-t border-light-secondary dark:border-dark-secondary py-12 transition-colors duration-200">
      <Container>
        <div className="grid grid-cols-1 gap-16 md:grid-cols-3">
          <div>
            <Link href="/" className="mb-4 inline-block">
              <Image 
                src={logoSrc} 
                alt="Pinaka" 
                width={50} 
                height={40} 
                style={{ height: 'auto' }}
                priority
              />
            </Link>
            <h3 className="text-dark-secondary dark:text-light-secondary mb-4 text-4xl font-medium">Pinaka</h3>
            <p className="text-dark-secondary dark:text-light-secondary max-w-md">
              Creating engaging motion design and interactive experiences for brands and products.
            </p>
          </div>
          
          <div>
            <h4 className="text-dark dark:text-light mb-2 text-2xl">Navigation</h4>
            <div className="h-0.5 w-20 mb-4 bg-brand"></div>
            <ul className="space-y-2">
              <li><Link href="/" className="text-dark-secondary dark:text-light-secondary hover:text-brand transition-colors">Home</Link></li>
              <li><Link href="/projects" className="text-dark-secondary dark:text-light-secondary hover:text-brand transition-colors">Projects</Link></li>
              <li><Link href="/about" className="text-dark-secondary dark:text-light-secondary hover:text-brand transition-colors">About</Link></li>
              <li><Link href="/contact" className="text-dark-secondary dark:text-light-secondary hover:text-brand transition-colors">Contact</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-dark dark:text-light mb-2 text-2xl">Social</h4>
            <div className="h-0.5 w-20 mb-4 bg-brand"></div>
            <ul className="space-y-2">
              <li><a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-dark-secondary dark:text-light-secondary hover:text-brand transition-colors">GitHub</a></li>
              <li><a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-dark-secondary dark:text-light-secondary hover:text-brand transition-colors">LinkedIn</a></li>
              <li><a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-dark-secondary dark:text-light-secondary hover:text-brand transition-colors">Twitter</a></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-light-secondary dark:border-dark-secondary text-center text-dark-secondary dark:text-light-secondary">
          <p className="text-sm">&copy; {new Date().getFullYear()} Pinaka. All rights reserved.</p>
        </div>
      </Container>
    </footer>
  );
}