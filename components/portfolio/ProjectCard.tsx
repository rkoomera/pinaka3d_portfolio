// components/portfolio/ProjectCard.tsx
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Project } from '@/types';

interface ProjectCardProps {
  project: Project;
  className?: string;
  priority?: boolean;
}

export function ProjectCard({ project, className, priority = false }: ProjectCardProps) {
  return (
    <Link href={`/projects/${project.slug}`} className={cn('group block', className)}>
      <div className="overflow-hidden rounded-xl bg-white shadow-sm transition-all duration-300 hover:shadow-md">
        <div className="relative aspect-video overflow-hidden">
          {project.thumbnail_url ? (
            <Image
              src={project.thumbnail_url}
              alt={project.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              priority={priority}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gray-100">
              <span className="text-2xl font-bold text-gray-400">
                {project.title[0]}
              </span>
            </div>
          )}
          {project.category && (
            <span className="absolute right-3 top-3 rounded-full bg-black/70 px-3 py-1 text-xs font-medium text-white">
              {project.category.replace('_', ' ')}
            </span>
          )}
        </div>

        <div className="p-5">
          <div className="mb-3">
            <h3 className="text-lg font-semibold text-gray-900">{project.title}</h3>
            {project.client_name && (
              <p className="text-sm text-gray-600">{project.client_name}</p>
            )}
          </div>

          {project.summary && (
            <p className="mb-4 line-clamp-2 text-sm text-gray-700">{project.summary}</p>
          )}

          {project.tech_stack && project.tech_stack.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {project.tech_stack.slice(0, 3).map((tech) => (
                <span key={tech} className="rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700">
                  {tech}
                </span>
              ))}
              {project.tech_stack.length > 3 && (
                <span className="rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700">
                  +{project.tech_stack.length - 3}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}