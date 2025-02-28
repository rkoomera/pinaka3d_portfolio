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
    <footer className="bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800 py-12 transition-colors duration-200">
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
            <h3 className="text-gray-800 dark:text-gray-200 mb-4 text-4xl font-medium">Pinaka</h3>
            <p className="text-gray-700 dark:text-gray-300 max-w-md">
              Creating engaging motion design and interactive experiences for brands and products.
            </p>
          </div>
          
          <div>
            <h4 className="text-gray-900 dark:text-white mb-2 text-2xl">Navigation</h4>
            <div className="h-0.5 w-20 mb-4 bg-brand"></div>
            <ul className="space-y-2">
              <li><Link href="/" className="text-gray-700 dark:text-gray-300 hover:text-brand dark:hover:text-brand-light transition-colors">Home</Link></li>
              <li><Link href="/projects" className="text-gray-700 dark:text-gray-300 hover:text-brand dark:hover:text-brand-light transition-colors">Projects</Link></li>
              <li><Link href="/about" className="text-gray-700 dark:text-gray-300 hover:text-brand dark:hover:text-brand-light transition-colors">About</Link></li>
              <li><Link href="/contact" className="text-gray-700 dark:text-gray-300 hover:text-brand dark:hover:text-brand-light transition-colors">Contact</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-gray-900 dark:text-white mb-2 text-2xl">Social</h4>
            <div className="h-0.5 w-20 mb-4 bg-brand"></div>
            <ul className="space-y-2">
              <li><a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-gray-700 dark:text-gray-300 hover:text-brand dark:hover:text-brand-light transition-colors">GitHub</a></li>
              <li><a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-700 dark:text-gray-300 hover:text-brand dark:hover:text-brand-light transition-colors">LinkedIn</a></li>
              <li><a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-700 dark:text-gray-300 hover:text-brand dark:hover:text-brand-light transition-colors">Twitter</a></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800 text-center text-gray-600 dark:text-gray-400">
          <p className="text-sm">&copy; {new Date().getFullYear()} Pinaka. All rights reserved.</p>
        </div>
      </Container>
    </footer>
  );
}