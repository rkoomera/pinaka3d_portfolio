import { Metadata } from 'next';
import { Section } from '@/components/ui/Section';
import { Container } from '@/components/ui/Container';
import { MessageList } from '@/components/admin/MessageList';

export const metadata: Metadata = {
  title: 'Messages | Admin Dashboard',
  description: 'View and manage contact messages',
};

export default function MessagesPage() {
  return (
    <Section className="py-12">
      <Container>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-dark dark:text-light">Messages</h1>
          <p className="text-dark-secondary dark:text-light-secondary mt-2">
            View and manage contact form submissions
          </p>
        </div>
        
        <MessageList />
      </Container>
    </Section>
  );
} 