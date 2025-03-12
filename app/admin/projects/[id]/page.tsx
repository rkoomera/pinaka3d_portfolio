'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ProjectForm from '@/components/admin/ProjectForm';
import { Project } from '@/types';
import Link from 'next/link';

interface EditProjectPageProps {
  params: {
    id: string;
  };
}

export default function EditProjectPage({ params }: EditProjectPageProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const projectId = parseInt(params.id);
  
  const handleSuccess = (project: Project) => {
    // Navigate to the project list
    router.push('/admin/projects');
    router.refresh();
  };
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Edit Project</h1>
          <Link 
            href="/admin/projects"
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            Back to Projects
          </Link>
        </div>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Update project details and content
        </p>
      </div>
      
      <ProjectForm projectId={projectId} onSuccess={handleSuccess} />
    </div>
  );
} 