// app/projects/[slug]/page.tsx
import { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Section } from '@/components/ui/Section';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { VideoPlayer } from '@/components/ui/VideoPlayer';
import { getProjectBySlug, getAllProjects } from '@/lib/services/projects';

type ProjectParams = {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: ProjectParams): Promise<Metadata> {
  const project = await getProjectBySlug(params.slug);
  
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

export default async function ProjectDetailPage({ params }: ProjectParams) {
  const project = await getProjectBySlug(params.slug);
  
  if (!project) {
    notFound();
  }
  
  return (
    <>
      <Section className="pt-24 md:pt-32">
        <Container size="lg">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-3">
              {project.title}
            </h1>
            
            {project.subtitle && (
              <p className="text-xl text-gray-600">{project.subtitle}</p>
            )}
          </div>
          
          {project.thumbnail_url && (
            <div className="relative aspect-video w-full overflow-hidden rounded-xl mb-12">
              <Image
                src={project.thumbnail_url}
                alt={project.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="md:col-span-2">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Overview</h2>
              <div className="prose prose-lg max-w-none">
                {project.summary && <p>{project.summary}</p>}
                
                {project.content && (
                  <div dangerouslySetInnerHTML={{ __html: project.content }} />
                )}
              </div>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Details</h3>
              <dl className="space-y-3">
                {project.client_name && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Client</dt>
                    <dd className="mt-1 text-gray-900">{project.client_name}</dd>
                  </div>
                )}
                
                {project.duration && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Duration</dt>
                    <dd className="mt-1 text-gray-900">{project.duration}</dd>
                  </div>
                )}
                
                {project.role && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">My Role</dt>
                    <dd className="mt-1 text-gray-900">{project.role}</dd>
                  </div>
                )}
                
                {project.tech_stack && project.tech_stack.length > 0 && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Technologies</dt>
                    <dd className="mt-1">
                      <div className="flex flex-wrap gap-2">
                        {project.tech_stack.map((tech) => (
                          <span 
                            key={tech}
                            className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </dd>
                  </div>
                )}
              </dl>
            </div>
          </div>
          
          {project.videos && project.videos.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Project Video</h2>
              <VideoPlayer videoUrl={project.videos[0]} />
            </div>
          )}
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {project.client_website && (
              <a href={project.client_website} target="_blank" rel="noopener noreferrer">
                <Button>Visit Website</Button>
              </a>
            )}
            
            <Button href="/projects" variant="outline">
              Back to Projects
            </Button>
          </div>
        </Container>
      </Section>
    </>
  );
}