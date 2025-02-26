// app/projects/page.tsx
import { Metadata } from 'next';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { getAllProjects } from '@/lib/services/projects';
import { FeaturedProjects } from '@/components/portfolio/FeaturedProjects';

export const metadata: Metadata = {
  title: 'Projects - Ravi Koomera',
  description: 'Explore my portfolio of motion design and web development projects.',
};

export default async function ProjectsPage() {
  const projects = await getAllProjects();
  
  return (
    <>
      <Section className="pt-24 md:pt-32 pb-4 md:pb-16" background="light-secondary">
        <SectionHeading
          title="Work"
          subtitle="A collection of my recent work in motion design"
          centered
        />
      </Section>
      
      <Section 
        background="light" 
        className="py-2 md:py-4" 
        containerSize="full"
      >
        <div className="-mt-4 max-w-[1400px] mx-auto">
          <FeaturedProjects 
            projects={projects} 
            showHeading={false} 
            showViewAllButton={false}
            background="light"
            layout="grid"
          />
        </div>
        
        {projects.length === 0 && (
          <div className="rounded-lg bg-light-secondary dark:bg-dark-secondary p-12 text-center transition-colors duration-200">
            <h3 className="text-lg font-medium text-dark dark:text-light transition-colors duration-200">No projects found</h3>
            <p className="mt-2 text-dark-secondary dark:text-gray-300 transition-colors duration-200">
              Check back soon for updates to my portfolio.
            </p>
          </div>
        )}
      </Section>
    </>
  );
}