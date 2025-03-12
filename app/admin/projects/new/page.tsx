'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ProjectForm from '@/components/admin/ProjectForm';
import { Project } from '@/types';
import Link from 'next/link';

export default function NewProjectPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  
  const handleSuccess = (project: Project) => {
    // Navigate to the project list or edit page
    router.push(`/admin/projects/${project.id}`);
    router.refresh();
  };
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Create New Project</h1>
        <Link
          href="/admin/projects"
          className="px-4 py-2 text-sm flex items-center rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-4 w-4 mr-2" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Projects
        </Link>
      </div>
      <ProjectForm onSuccess={handleSuccess} />
    </div>
  );
} 