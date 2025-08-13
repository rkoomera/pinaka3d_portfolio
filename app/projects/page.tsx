// app/projects/page.tsx
import { Metadata, Viewport } from 'next';
import { getAllProjects } from '@/lib/services/sanity';
import { FeaturedProjects } from '@/components/portfolio/FeaturedProjects';
import { Section } from '@/components/ui/Section';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: 'Projects - Ravi Koomera',
  description: 'Browse my creative portfolio of motion design and web development projects.'
};

export default async function ProjectsPage() {
  // Get all published projects
  const allProjects = await getAllProjects();
  
  return (
    <>
      
      <FeaturedProjects 
        projects={allProjects} 
        background="white"
        layout="twoCol"
        showLayoutToggle={true}
        useSwiperOnFourCol={true}
        showHeading={true}
        title="All Projects"
        subtitle="A collection of my work in motion design and development"
      />
      
      {allProjects.length === 0 && (
        <Section background="projects">
          <div className="rounded-lg bg-gray-100 dark:bg-gray-900 p-12 text-center transition-colors duration-200">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white transition-colors duration-200">No projects found</h3>
            <p className="mt-2 text-gray-700 dark:text-gray-300 transition-colors duration-200">
              Check back soon for updates to my portfolio.
            </p>
          </div>
        </Section>
      )}
    </>
  );
}