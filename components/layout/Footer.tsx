// components/layout/Footer.tsx
'use client'

import Link from 'next/link';
import { Container } from '@/components/ui/Container';

export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 py-12">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="mb-2">
              <img 
                src="https://gyuznawtihohzzdmhvtw.supabase.co/storage/v1/object/public/project-images//pinaka_logo.svg" 
                alt="Pinaka Logo" 
                className="h-10" 
              />
            </div>
            <p className="text-gray-700 mb-4">Motion Designer</p>
            <p className="text-gray-600 max-w-md">
              Creating immersive digital experiences through motion design and modern web development.
            </p>
          </div>
          
          <div>
            <h4 className="text-gray-900 mb-4">Navigation</h4>
            <ul className="space-y-2">
              <li><Link href="/" className="text-gray-700 hover:text-blue-600 transition-colors">Home</Link></li>
              <li><Link href="/projects" className="text-gray-700 hover:text-blue-600 transition-colors">Projects</Link></li>
              <li><Link href="/about" className="text-gray-700 hover:text-blue-600 transition-colors">About</Link></li>
              <li><Link href="/contact" className="text-gray-700 hover:text-blue-600 transition-colors">Contact</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-gray-900 mb-4">Social</h4>
            <ul className="space-y-2">
              <li><a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-blue-600 transition-colors">GitHub</a></li>
              <li><a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-blue-600 transition-colors">LinkedIn</a></li>
              <li><a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-blue-600 transition-colors">Twitter</a></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-100 text-center text-gray-600">
          <p className="text-sm">&copy; {new Date().getFullYear()} Pinaka. All rights reserved.</p>
        </div>
      </Container>
    </footer>
  );
}