// app/projects/[slug]/page.tsx
import { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Section } from '@/components/ui/Section';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import ClientVideoSection from '@/components/project/ClientVideoSection';
import { RichTextContent } from '@/components/project/RichTextContent';
import { FeaturedProjects } from '@/components/portfolio/FeaturedProjects';
import { getProjectBySlug, getAllProjects, getRelatedProjects } from '@/lib/services/projects';
import { Project } from '@/types';

type Props = {
  params: {
    slug: string;
  };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const slug = params.slug;
  const project = await getProjectBySlug(slug);
  
  if (!project) {
    return {
      title: 'Project Not Found',
    };
  }
  
  return {
    title: `${project.title} - Ravi Koomera`,
    description: project.summary || `Details about ${project.title} project`,
  };
}

export async function generateStaticParams() {
  const projects = await getAllProjects();
  
  return projects.map((project) => ({
    slug: project.slug,
  }));
}

export default async function Page({ params }: Props) {
  const slug = params.slug;
  const project = await getProjectBySlug(slug);
  
  if (!project) {
    notFound();
  }
  
  // Get related projects only if we have a valid project ID
  let relatedProjects: Project[] = [];
  if (project.id) {
    console.log('Fetching related projects for project ID:', project.id);
    relatedProjects = await getRelatedProjects(String(project.id), 8);
    console.log('Related projects found:', relatedProjects.length);
    console.log('Related projects:', JSON.stringify(relatedProjects.map(p => ({ id: p.id, title: p.title }))));
    
    // Ensure we have exactly 4 projects
    if (relatedProjects.length < 4) {
      // Get all projects to fill in the gaps
      const allProjects = await getAllProjects();
      const additionalProjects = allProjects
        .filter(p => p.id !== project.id && !relatedProjects.some(rp => rp.id === p.id))
        .slice(0, 4 - relatedProjects.length);
      
      relatedProjects = [...relatedProjects, ...additionalProjects];
    }
    
    // Limit to exactly 4 projects
    relatedProjects = relatedProjects.slice(0, 4);
  } else {
    console.log('No project ID available to fetch related projects');
  }
  
  // Debug project video URLs
  console.log('Project data:', {
    slug: project.slug,
    id: project.id,
    background_video_url: project.background_video_url,
    project_video_url: project.project_video_url
  });
  
  return (
    <>
      {/* Header Section */}
      <Section className="pt-24 md:pt-32 !pb-0">
        <Container size="lg">
          <div className="max-w-3xl mx-auto text-center pb-16">
            <h1 className="text-3xl font-bold text-dark dark:text-light sm:text-4xl mb-3 transition-colors duration-200">
              {project.title}
            </h1>
            
            {project.subtitle && (
              <p className="text-xl text-dark-secondary dark:text-light-secondary transition-colors duration-200">{project.subtitle}</p>
            )}
          </div>
        </Container>
      </Section>
          
      {/* Full-width Video Section */}
      {project.background_video_url ? (
        <div className="w-full overflow-hidden">
          <ClientVideoSection 
            backgroundVideoUrl={project.background_video_url}
            popupVideoUrl={project.project_video_url || "https://gyuznawtihohzzdmhvtw.supabase.co/storage/v1/object/public/project-videos/popup-demo.mp4"}
            height="aspect-[16/6]"
            className="shadow-md"
          />
        </div>
      ) : project.thumbnail_url && (
        <Section className="py-0">
          <Container size="lg">
            <div className="relative aspect-[16/6] w-full overflow-hidden rounded-xl">
              <Image
                src={project.thumbnail_url}
                alt={project.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          </Container>
        </Section>
      )}
          
      {/* Content Section */}
      <Section className="!pt-12 !pb-12 md:!pt-16 md:!pb-16">
        <Container size="lg">
          {/* Project Overview */}
          <div className="mb-16">
            <h2 className="text-2xl font-semibold text-dark dark:text-light mb-6 inline-block pb-2 border-b-2 border-brand transition-colors duration-200">Overview</h2>
            <div className="prose prose-lg max-w-none dark:prose-invert transition-colors duration-200">
              {project.summary && <p className="text-lg text-dark-secondary dark:text-light-secondary leading-relaxed transition-colors duration-200">{project.summary}</p>}
              
              {project.content && (
                <div className="mt-6">
                  <RichTextContent content={project.content} />
                </div>
              )}
            </div>
          </div>
          
          {/* Project Details */}
          <div className="mb-16">
            <h2 className="text-2xl font-semibold text-dark dark:text-light mb-6 inline-block pb-2 border-b-2 border-brand transition-colors duration-200">Project Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                {project.client_name && (
                  <div>
                    <h3 className="text-sm uppercase tracking-wider text-dark-secondary dark:text-light-secondary mb-2 transition-colors duration-200">Client</h3>
                    <p className="font-medium text-dark dark:text-light transition-colors duration-200">{project.client_name}</p>
                  </div>
                )}
                
                {project.duration && (
                  <div>
                    <h3 className="text-sm uppercase tracking-wider text-dark-secondary dark:text-light-secondary mb-2 transition-colors duration-200">Duration</h3>
                    <p className="font-medium text-dark dark:text-light transition-colors duration-200">{project.duration}</p>
                  </div>
                )}
                
                {project.role && (
                  <div>
                    <h3 className="text-sm uppercase tracking-wider text-dark-secondary dark:text-light-secondary mb-2 transition-colors duration-200">My Role</h3>
                    <p className="font-medium text-dark dark:text-light transition-colors duration-200">{project.role}</p>
                  </div>
                )}
                
                {project.client_website && (
                  <div>
                    <h3 className="text-sm uppercase tracking-wider text-dark-secondary dark:text-light-secondary mb-2 transition-colors duration-200">Website</h3>
                    <a 
                      href={project.client_website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="font-medium text-brand hover:text-opacity-80 transition-colors"
                    >
                      {(() => {
                        try {
                          const url = new URL(project.client_website);
                          return url.hostname.replace('www.', '');
                        } catch {
                          return project.client_website;
                        }
                      })()}
                    </a>
                  </div>
                )}
              </div>
              
              <div>
                {project.tech_stack && project.tech_stack.length > 0 && (
                  <div>
                    <h3 className="text-sm uppercase tracking-wider text-dark-secondary dark:text-light-secondary mb-2 transition-colors duration-200">Technologies</h3>
                    <div className="flex flex-wrap gap-2">
                      {project.tech_stack.map((tech) => (
                        <span 
                          key={tech}
                          className="px-3 py-1 bg-white dark:bg-dark border border-light-secondary dark:border-light rounded-md text-sm shadow-sm transition-colors duration-200 text-dark dark:text-light"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Back Button */}
          <div className="flex justify-center">
            <Button href="/projects" variant="outline" className="px-8">
              Back to Projects
            </Button>
          </div>
        </Container>
      </Section>
      
      {/* Related Projects Section */}
      {relatedProjects.length > 0 && (
        <Section background="projects" containerSize="full">
          <FeaturedProjects 
            projects={relatedProjects}
            layout="fourCol"
            showLayoutToggle={false}
            showViewAllButton={false}
            showHeading={true}
            useSection={false}
            limit={4}
            title="Related Projects"
            subtitle={`Explore more projects in the ${project.category || 'same'} category`}
            showSubtitle={false}
            alignHeadingLeft={true}
          />
        </Section>
      )}
      
      {/* Fallback when no related projects */}
      {relatedProjects.length === 0 && (
        <Section className="!pt-12 !pb-16 bg-gray-100 dark:bg-gray-900 transition-colors duration-200">
          <Container size="lg" className="text-center">
            <h2 className="text-2xl font-semibold text-dark dark:text-light mb-4 transition-colors duration-200">Explore More Projects</h2>
            <Button href="/projects" variant="outline" size="lg">
              View All Projects
            </Button>
          </Container>
        </Section>
      )}
    </>
  );
}