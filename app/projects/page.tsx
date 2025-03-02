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
      <Section className="pt-24 md:pt-32 pb-4 md:pb-16" background="white">
        <SectionHeading
          title="Work"
          subtitle="A collection of my recent work in motion design"
          centered
        />
      </Section>
      
      <Section 
        background="projects" 
        className="py-2 md:py-4" 
        containerSize="full"
      >
        <div className="w-full">
          <FeaturedProjects 
            projects={projects} 
            showHeading={false} 
            showViewAllButton={false}
            background="projects"
            layout="twoCol"
            showLayoutToggle={true}
            useSwiperOnFourCol={true}
          />
        </div>
        
        {projects.length === 0 && (
          <div className="rounded-lg bg-gray-100 dark:bg-gray-900 p-12 text-center transition-colors duration-200">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white transition-colors duration-200">No projects found</h3>
            <p className="mt-2 text-gray-700 dark:text-gray-300 transition-colors duration-200">
              Check back soon for updates to my portfolio.
            </p>
          </div>
        )}
      </Section>
    </>
  );
}