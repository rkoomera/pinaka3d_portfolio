import { Metadata, Viewport } from 'next';

export const metadata: Metadata = {
  title: 'Admin Login - Pinaka',
  description: 'Login to the Pinaka admin dashboard'
};
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};


export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-light dark:bg-dark transition-colors duration-200">
      <main className="flex-grow">
        {children}
      </main>
    </div>
  );
} 