// components/portfolio/FeaturedProjects.tsx
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ProjectCard } from '@/components/portfolio/ProjectCard';
import { Button } from '@/components/ui/Button';
import { Project } from '@/types';

interface FeaturedProjectsProps {
  projects: Project[];
}

export function FeaturedProjects({ projects }: FeaturedProjectsProps) {
  if (!projects || projects.length === 0) {
    return null;
  }

  return (
    <Section background="gray">
      <SectionHeading 
        title="Featured Projects" 
        subtitle="Selected works that showcase my design and development skills"
        centered
      />
      
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project, index) => (
          <ProjectCard 
            key={project.id} 
            project={project}
            priority={index < 3}
          />
        ))}
      </div>
      
      <div className="mt-12 text-center">
        <Button href="/projects" variant="outline">
          View All Projects
        </Button>
      </div>
    </Section>
  );
}