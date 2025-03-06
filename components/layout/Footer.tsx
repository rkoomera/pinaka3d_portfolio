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
    <footer className="bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800 py-8 transition-colors duration-200">
      <Container size="full">
        <div className="flex flex-col md:flex-row items-center justify-between">
          {/* Logo and Name - Always at top on mobile, center on desktop */}
          <div className="flex items-center mb-6 md:mb-0 order-1 md:order-2">
            <Link href="/" className="flex items-center">
              <div className="relative" data-hover style={{ width: '35px', height: '32px' }}>
                <div data-hover-bounds className="absolute inset-0 pointer-events-none"></div>
                <Image 
                  src={logoSrc} 
                  alt="Pinaka" 
                  width={35} 
                  height={32} 
                  style={{ height: 'auto' }}
                  priority
                />
              </div>
              <h3 className="text-gray-800 dark:text-gray-200 ml-3 text-4xl font-medium">Pinaka</h3>
            </Link>
          </div>
          
          {/* Social Links - Middle on mobile, right on desktop */}
          <div className="flex items-center space-x-6 mb-6 md:mb-0 order-2 md:order-3">
            <div className="relative" data-hover>
              <div data-hover-bounds className="absolute inset-0 pointer-events-none"></div>
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-700 dark:text-gray-300 hover:text-brand dark:hover:text-brand-light transition-colors text-lg"
              >
                LinkedIn
              </a>
            </div>
            
            <div className="relative" data-hover>
              <div data-hover-bounds className="absolute inset-0 pointer-events-none"></div>
              <a 
                href="https://behance.net" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-700 dark:text-gray-300 hover:text-brand dark:hover:text-brand-light transition-colors text-lg"
              >
                Behance
              </a>
            </div>
            
            <div className="relative" data-hover>
              <div data-hover-bounds className="absolute inset-0 pointer-events-none"></div>
              <a 
                href="https://youtube.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-700 dark:text-gray-300 hover:text-brand dark:hover:text-brand-light transition-colors text-lg"
              >
                YouTube
              </a>
            </div>
          </div>
          
          {/* Copyright - Bottom on mobile, left on desktop */}
          <div className="text-gray-600 dark:text-gray-400 order-3 md:order-1">
            <p className="text-lg">&copy; {new Date().getFullYear()} Pinaka. All rights reserved.</p>
          </div>
        </div>
      </Container>
    </footer>
  );
}