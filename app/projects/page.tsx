// app/projects/page.tsx
import { Metadata } from 'next';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ProjectCard } from '@/components/portfolio/ProjectCard';
import { getAllProjects } from '@/lib/services/projects';

export const metadata: Metadata = {
  title: 'Projects - Ravi Koomera',
  description: 'Explore my portfolio of motion design and web development projects.',
};

export default async function ProjectsPage() {
  const projects = await getAllProjects();
  
  return (
    <>
      <Section className="pt-24 md:pt-32">
        <SectionHeading
          title="My Projects"
          subtitle="A collection of my recent work in motion design and web development"
          centered
        />
        
        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              priority={index < 6}
            />
          ))}
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