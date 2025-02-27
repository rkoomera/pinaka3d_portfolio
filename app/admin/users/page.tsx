import { Metadata } from 'next';
import { Section } from '@/components/ui/Section';
import { Container } from '@/components/ui/Container';
import { getAllUsers, requireAdmin } from '@/lib/services/auth';
import { UsersList } from '@/components/admin/UsersList';

export const metadata: Metadata = {
  title: 'User Management',
  description: 'Manage user accounts and permissions',
};

export default async function UsersPage() {
  // Ensure the current user is an admin
  await requireAdmin();
  
  // Get all users
  const users = await getAllUsers();
  
  return (
    <Section>
      <Container>
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-dark dark:text-light transition-colors duration-200">
            User Management
          </h1>
          <div className="text-sm text-dark-secondary dark:text-light-secondary">
            {users.length} user{users.length !== 1 ? 's' : ''}
          </div>
        </div>
        
        <UsersList initialUsers={users} />
      </Container>
    </Section>
  );
} 