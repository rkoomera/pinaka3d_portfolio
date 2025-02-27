import { Metadata } from 'next';
import { Section } from '@/components/ui/Section';
import { Container } from '@/components/ui/Container';
import { DashboardStats } from '@/components/admin/DashboardStats';
import { DashboardCard } from '@/components/admin/DashboardCard';
import { getUnreadCount } from '@/lib/services/contact';
import { getProjectCount } from '@/lib/services/projects';
import { getAllUsers, requireAuth } from '@/lib/services/auth';

export const metadata: Metadata = {
  title: 'Admin Dashboard',
  description: 'Admin dashboard for Pinaka portfolio site',
};

export default async function AdminDashboardPage() {
  // Ensure user is authenticated
  const user = await requireAuth();
  
  const unreadCount = await getUnreadCount();
  const projectCount = await getProjectCount();
  const users = await getAllUsers();
  const userCount = users.length;
  
  return (
    <Section>
      <Container>
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-dark dark:text-light transition-colors duration-200">
            Admin Dashboard
          </h1>
          <div className="text-sm text-text-light dark:text-light-secondary">
            Last updated: {new Date().toLocaleString()}
          </div>
        </div>
        
        {/* Stats Overview */}
        <DashboardStats />
        
        {/* Main Cards */}
        <h2 className="text-xl font-semibold text-dark dark:text-light mb-4 transition-colors duration-200">
          Manage Content
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <DashboardCard
            title="Contact Messages"
            description={
              unreadCount > 0 ? (
                <>
                  You have <span className="text-brand font-medium">{unreadCount} unread</span> message{unreadCount !== 1 ? 's' : ''}
                </>
              ) : (
                'No new messages'
              )
            }
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            }
            href="/admin/messages"
            count={unreadCount}
            countLabel="unread"
            color="blue"
          />
          
          <DashboardCard
            title="Projects"
            description="Manage your portfolio projects"
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            }
            href="/admin/projects"
            count={projectCount}
            countLabel="projects"
            color="green"
          />
          
          <DashboardCard
            title="Users"
            description="Manage user accounts and permissions"
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            }
            href="/admin/users"
            count={userCount}
            countLabel="users"
            color="orange"
          />
        </div>
        
        {/* Additional Cards */}
        <h2 className="text-xl font-semibold text-dark dark:text-light mb-4 transition-colors duration-200">
          Coming Soon
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <DashboardCard
            title="Analytics"
            description="View site analytics and visitor data"
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            }
            href="#"
            color="purple"
          />
          
          <DashboardCard
            title="Blog Articles"
            description="Manage your blog content"
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            }
            href="#"
            color="red"
          />
        </div>
      </Container>
    </Section>
  );
} 