// app/projects/[slug]/page.tsx
import { Metadata, Viewport } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Section } from '@/components/ui/Section';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import ClientVideoSection from '@/components/project/ClientVideoSection';
import { RichTextContent } from '@/components/project/RichTextContent';
import { FeaturedProjects } from '@/components/portfolio/FeaturedProjects';
import { getAllProjects, getProjectBySlug, getRelatedProjects } from '@/lib/services/sanity';
import { urlForImage } from '@/sanity/lib/image';
import { Project } from '@/types';
import { JsonLd, createProjectSchema } from '@/components/layout/JsonLd';

type Props = {
  params: {
    slug: string;
  };
};

export async function generateViewport(): Promise<Viewport> {
  return {
    width: 'device-width',
    initialScale: 1,
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const project = await getProjectBySlug(params.slug);
  
  if (!project) {
    return { title: 'Project Not Found' };
  }
  
  return {
    title: `${project.title} - Ravi Koomera`,
    description: project.summary || project.description || `Details about ${project.title} project`,
  };
}

export async function generateStaticParams() {
  const projects = await getAllProjects();
  return projects.map((project) => ({
    slug: project.slug,
  }));
}

export default async function Page({ params }: Props) {
  const project = await getProjectBySlug(params.slug);
  
  if (!project) {
    notFound();
  }
  
  const relatedProjects = await getRelatedProjects(project._id, 4);
  const thumbnailUrl = project.thumbnail ? urlForImage(project.thumbnail)?.url() || '' : '';
  
  return (
    <>
      <JsonLd data={createProjectSchema(project)} />
      
      {/* Header Section */}
      <Section className="pt-24 md:pt-32 !pb-0">
        <Container size="lg">
          <div className="max-w-3xl mx-auto text-center pb-16">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl mb-3 transition-colors duration-200">
              {project.title}
            </h1>
            
            {project.subtitle && (
              <p className="text-xl text-gray-700 dark:text-gray-300 transition-colors duration-200">{project.subtitle}</p>
            )}
          </div>
        </Container>
      </Section>
          
      {/* Full-width Video Section */}
      {project.background_video_url ? (
        <div className="w-full overflow-hidden">
          <ClientVideoSection 
            backgroundVideoUrl={project.background_video_url}
            popupVideoUrl={project.project_video_url || ''}
            height="aspect-[16/6]"
            className="shadow-md"
          />
        </div>
      ) : project.thumbnail && (
        <Section className="py-0">
          <Container size="lg">
            <div className="relative aspect-[16/6] w-full overflow-hidden rounded-xl">
              <Image
                src={thumbnailUrl}
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
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6 inline-block pb-2 border-b-2 border-brand transition-colors duration-200">Overview</h2>
            <div className="prose prose-lg max-w-none dark:prose-invert transition-colors duration-200">
              {project.summary && <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed transition-colors duration-200">{project.summary}</p>}
              
              {project.content && (
                <div className="mt-6">
                  <RichTextContent content={project.content} />
                </div>
              )}
            </div>
          </div>
          
          {/* Project Details */}
          <div className="mb-16">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6 inline-block pb-2 border-b-2 border-brand transition-colors duration-200">Project Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                {project.client_name && (
                  <div>
                    <h3 className="text-sm uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-200">Client</h3>
                    <p className="font-medium text-gray-900 dark:text-white transition-colors duration-200">{project.client_name}</p>
                  </div>
                )}
                
                {project.duration && (
                  <div>
                    <h3 className="text-sm uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-200">Duration</h3>
                    <p className="font-medium text-gray-900 dark:text-white transition-colors duration-200">{project.duration}</p>
                  </div>
                )}
                
                {project.role && (
                  <div>
                    <h3 className="text-sm uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-200">My Role</h3>
                    <p className="font-medium text-gray-900 dark:text-white transition-colors duration-200">{project.role}</p>
                  </div>
                )}
                
                {project.client_website && (
                  <div>
                    <h3 className="text-sm uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-200">Website</h3>
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
                    <h3 className="text-sm uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-200">Technologies</h3>
                    <div className="flex flex-wrap gap-2">
                      {project.tech_stack.map((tech) => (
                        <span 
                          key={tech}
                          className="px-3 py-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md text-sm shadow-sm transition-colors duration-200 text-gray-900 dark:text-white"
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
            useSwiperOnFourCol={false}
          />
        </Section>
      )}
      
      {/* Fallback when no related projects */}
      {relatedProjects.length === 0 && (
        <Section className="!pt-12 !pb-16 bg-gray-100 dark:bg-gray-900 transition-colors duration-200">
          <Container size="lg" className="text-center">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 transition-colors duration-200">Explore More Projects</h2>
            <Button href="/projects" variant="outline" size="lg">
              View All Projects
            </Button>
          </Container>
        </Section>
      )}
    </>
  );
}