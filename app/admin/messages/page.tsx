import { Metadata } from 'next';
import { Section } from '@/components/ui/Section';
import { Container } from '@/components/ui/Container';
import { MessageList } from '@/components/admin/MessageList';
import { requireAuth } from '@/lib/services/auth';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Messages | Admin Dashboard',
  description: 'View and manage contact messages'
};

export default async function MessagesPage() {
  // Ensure user is authenticated
  await requireAuth();
  
  return (
    <Section className="py-12 dark:bg-gray-950" background="white">
      <Container>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Messages</h1>
          <p className="text-gray-700 dark:text-gray-300 mt-2">
            View and manage contact form submissions
          </p>
        </div>
        
        <MessageList />
      </Container>
    </Section>
  );
} 