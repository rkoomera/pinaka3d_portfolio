import { Metadata } from 'next';
import { AdminNav } from '@/components/admin/AdminNav';
import { getCurrentUser } from '@/lib/services/auth';

export const metadata: Metadata = {
  title: {
    default: 'Admin Dashboard - Pinaka',
    template: '%s - Pinaka Admin',
  },
  description: 'Admin dashboard for Pinaka portfolio site',
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Get the current user
  const user = await getCurrentUser();
  
  return (
    <div className="admin-page min-h-screen flex flex-col bg-light-card dark:bg-dark transition-colors duration-200">
      {user && <AdminNav user={user} />}
      <main className="flex-grow">
        {children}
      </main>
    </div>
  );
} 