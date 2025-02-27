import { Metadata } from 'next';
import Link from 'next/link';
import { Section } from '@/components/ui/Section';
import { Container } from '@/components/ui/Container';
import { getAllProjects } from '@/lib/services/projects';

export const metadata: Metadata = {
  title: 'Admin - Projects',
  description: 'Manage your portfolio projects',
};

export default async function AdminProjectsPage() {
  const projects = await getAllProjects();
  
  return (
    <Section>
      <Container>
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-dark dark:text-light transition-colors duration-200">
            Projects
          </h1>
          <Link 
            href="#" 
            className="inline-flex items-center px-4 py-2 bg-brand text-white rounded-lg hover:bg-brand/90 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            New Project
          </Link>
        </div>
        
        <div className="border border-light-border dark:border-dark-border rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-light-border dark:divide-dark-border">
              <thead className="bg-light-secondary dark:bg-dark-secondary">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-dark-secondary dark:text-light-secondary uppercase tracking-wider">
                    Title
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-dark-secondary dark:text-light-secondary uppercase tracking-wider">
                    Category
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-dark-secondary dark:text-light-secondary uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-dark-secondary dark:text-light-secondary uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-light-border dark:divide-dark-border">
                {projects.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-dark-secondary dark:text-light-secondary">
                      No projects found
                    </td>
                  </tr>
                ) : (
                  projects.map((project) => (
                    <tr key={project.id} className="hover:bg-light-hover dark:hover:bg-dark-hover transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0 rounded bg-light-secondary dark:bg-dark-secondary overflow-hidden">
                            {project.thumbnail_url && (
                              <img 
                                src={project.thumbnail_url} 
                                alt={project.title} 
                                className="h-full w-full object-cover"
                              />
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-dark dark:text-light">
                              {project.title}
                            </div>
                            <div className="text-sm text-dark-secondary dark:text-light-secondary">
                              {project.slug}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-dark dark:text-light">
                          {project.category}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                          Published
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Link 
                          href={`/projects/${project.slug}`} 
                          className="text-brand hover:text-brand/80 mr-4"
                          target="_blank"
                        >
                          View
                        </Link>
                        <Link 
                          href={`#`} 
                          className="text-brand hover:text-brand/80"
                        >
                          Edit
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </Container>
    </Section>
  );
} 