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
      <Section className="pt-24 md:pt-32 pb-4 md:pb-16" background="gray">
        <SectionHeading
          title="Work"
          subtitle="A collection of my recent work in motion design"
          centered
        />
      </Section>
      
      <Section 
        background="white" 
        className="py-2 md:py-4" 
        containerSize="full"
      >
        <div className="-mt-4 max-w-[1400px] mx-auto">
          <FeaturedProjects 
            projects={projects} 
            showHeading={false} 
            showViewAllButton={false}
            background="white"
            layout="grid"
          />
        </div>
        
        {projects.length === 0 && (
          <div className="rounded-lg bg-gray-50 p-12 text-center">
            <h3 className="text-lg font-medium text-gray-900">No projects found</h3>
            <p className="mt-2 text-gray-600">
              Check back soon for updates to my portfolio.
            </p>
          </div>
        )}
      </Section>
    </>
  );
}