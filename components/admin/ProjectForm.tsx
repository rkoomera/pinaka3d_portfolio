'use client';

import { useState, useEffect, FormEvent } from 'react';
import { createSupabaseBrowserClient } from '@/lib/supabase/browser-client';
import { Project, User } from '@/types';
import { v4 as uuidv4 } from 'uuid';
import ProjectEditor from './ProjectEditor';
import ProjectGallery, { GalleryImage, MediaCategory } from './ProjectGallery';
import { Button } from '@/components/ui/Button';

// Form state interface
interface ProjectFormData extends Omit<Project, 'id' | 'created_at' | 'updated_at'> {
  id?: number;
  gallery_images: GalleryImage[];
}

// Default values for new project
const defaultProject: ProjectFormData = {
  title: '',
  slug: '',
  description: '',
  content: '',
  thumbnail_url: '',
  featured_image_path: null,
  status: 'draft',
  category: 'web',
  user_id: '',
  gallery_images: []
};

interface ProjectFormProps {
  projectId?: number;
  onSuccess?: (project: Project) => void;
}

export default function ProjectForm({ projectId, onSuccess }: ProjectFormProps) {
  const [formData, setFormData] = useState<ProjectFormData>(defaultProject);
  const [loading, setLoading] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadingFeatured, setUploadingFeatured] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  
  const supabase = createSupabaseBrowserClient();
  
  // Fetch project data for editing
  useEffect(() => {
    const fetchProject = async () => {
      if (!projectId) return;
      
      setLoading(true);
      
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .eq('id', projectId)
          .single();
          
        if (error) throw error;
        
        if (data) {
          // Set preview for existing project
          if (data.thumbnail_url) {
            setImagePreview(data.thumbnail_url);
          }
          
          // Initialize gallery images
          let galleryImages: GalleryImage[] = [];
          
          if (data.gallery_images && Array.isArray(data.gallery_images)) {
            galleryImages = data.gallery_images;
          }
          
          setFormData({
            ...data,
            gallery_images: galleryImages,
          });
        }
      } catch (err: any) {
        console.error('Error fetching project:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    const fetchUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data } = await supabase
            .from('users')
            .select('*')
            .eq('id', user.id)
            .single();
            
          if (data) {
            setCurrentUser(data);
            
            // Set user_id for new projects
            if (!projectId) {
              setFormData(prev => ({
                ...prev,
                user_id: data.id
              }));
            }
          }
        }
      } catch (err) {
        console.error('Error fetching user:', err);
      }
    };
    
    fetchUser();
    fetchProject();
  }, [projectId, supabase]);
  
  // Handle form field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Auto-generate slug from title if slug is empty
    if (name === 'title' && (!formData.slug || formData.slug === '')) {
      const slug = value
        .toLowerCase()
        .replace(/[^\w\s]/gi, '')
        .replace(/\s+/g, '-');
        
      setFormData(prev => ({
        ...prev,
        title: value,
        slug
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };
  
  // Handle content changes from the rich text editor
  const handleContentChange = (content: string) => {
    setFormData(prev => ({
      ...prev,
      content
    }));
  };
  
  // Handle featured image uploads using Supabase Storage
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      return;
    }
    
    setUploadingFeatured(true);
    const file = e.target.files[0];
    
    try {
      // Create temporary preview
      const objectUrl = URL.createObjectURL(file);
      setImagePreview(objectUrl);
      
      // Generate a unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      
      // Create a storage path with project ID
      const projectFolder = formData.id ? `project-${formData.id}` : `temp-${uuidv4()}`;
      const filePath = `${projectFolder}/featured/${fileName}`;
      
      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('project-galleries')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });
        
      if (error) throw error;
      
      // Get the public URL
      const { data: publicUrlData } = supabase.storage
        .from('project-galleries')
        .getPublicUrl(filePath);
        
      if (!publicUrlData.publicUrl) {
        throw new Error('Failed to get public URL');
      }
      
      // Update form data with the URL and path
      setFormData(prev => ({
        ...prev,
        thumbnail_url: publicUrlData.publicUrl,
        featured_image_path: filePath
      }));
    } catch (err: any) {
      console.error('Error uploading image:', err);
      setError('Error uploading image: ' + err.message);
    } finally {
      setUploadingFeatured(false);
    }
  };
  
  // Handle external URL for featured image
  const handleExternalFeaturedImage = (url: string) => {
    if (!url.trim()) return;
    
    try {
      // Validate URL
      new URL(url);
      
      setImagePreview(url);
      setFormData(prev => ({
        ...prev,
        thumbnail_url: url,
        featured_image_path: null // No storage path for external URLs
      }));
    } catch (error) {
      setError('Please enter a valid URL');
    }
  };
  
  // Handle gallery image changes
  const handleGalleryChange = (images: GalleryImage[]) => {
    setFormData(prev => ({
      ...prev,
      gallery_images: images
    }));
  };
  
  // Set featured image from gallery
  const handleSetFeatured = (imageUrl: string) => {
    setImagePreview(imageUrl);
    setFormData(prev => ({
      ...prev,
      thumbnail_url: imageUrl
    }));
  };
  
  // Handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.slug) {
      setError('Title and slug are required');
      return;
    }
    
    setSaving(true);
    setError(null);
    
    try {
      // Create or update the project
      const { data, error } = await supabase
        .from('projects')
        .upsert({
          id: formData.id,
          title: formData.title,
          slug: formData.slug,
          description: formData.description,
          content: formData.content,
          thumbnail_url: formData.thumbnail_url,
          featured_image_path: formData.featured_image_path,
          status: formData.status,
          category: formData.category,
          user_id: formData.user_id,
          gallery_images: formData.gallery_images
        }, { onConflict: 'id' });
        
      if (error) throw error;
      
      // Handle success
      if (data && onSuccess) {
        onSuccess(data[0] as Project);
      }
    } catch (err: any) {
      console.error('Error saving project:', err);
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };
  
  if (loading) {
    return <div className="animate-pulse">Loading project data...</div>;
  }
  
  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 p-4 rounded-lg">
          {error}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left column - Basic details */}
        <div className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Project Title
            </label>
            <input
              id="title"
              name="title"
              type="text"
              required
              value={formData.title}
              onChange={handleChange}
              className="block w-full px-4 py-3 text-gray-900 dark:text-white bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-700"
            />
          </div>
          
          <div>
            <label htmlFor="slug" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Slug (URL Path)
            </label>
            <input
              id="slug"
              name="slug"
              type="text"
              required
              value={formData.slug}
              onChange={handleChange}
              className="block w-full px-4 py-3 text-gray-900 dark:text-white bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-700"
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              This will be used in the URL: /projects/{formData.slug}
            </p>
          </div>
          
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Short Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              value={formData.description ?? ''}
              onChange={handleChange}
              className="block w-full px-4 py-3 text-gray-900 dark:text-white bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-700"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Category
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="block w-full px-4 py-3 text-gray-900 dark:text-white bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-700"
              >
                <option value="web">Web Development</option>
                <option value="mobile">Mobile App</option>
                <option value="desktop">Desktop Software</option>
                <option value="ui">UI/UX Design</option>
                <option value="branding">Branding</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Status
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="block w-full px-4 py-3 text-gray-900 dark:text-white bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-700"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>
          
          {/* Featured Image Section */}
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900 dark:text-white">Featured Image</h3>
            
            {/* Tabs for upload or external URL */}
            <div className="border-b border-gray-200 dark:border-gray-700">
              <div className="flex">
                <button
                  type="button"
                  className={`px-4 py-2 font-medium text-sm rounded-t-lg ${
                    !formData.featured_image_path || formData.featured_image_path
                      ? 'bg-brand text-white' 
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                  } transition-colors`}
                  onClick={() => {
                    const fileInput = document.getElementById('featured-image');
                    if (fileInput) (fileInput as HTMLInputElement).click();
                  }}
                >
                  Upload Image
                </button>
                <button
                  type="button"
                  className={`ml-2 px-4 py-2 font-medium text-sm rounded-t-lg ${
                    formData.featured_image_path === null && formData.thumbnail_url
                      ? 'bg-brand text-white' 
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                  } transition-colors`}
                  onClick={() => {
                    const url = prompt('Enter image URL:');
                    if (url) handleExternalFeaturedImage(url);
                  }}
                >
                  External URL
                </button>
              </div>
            </div>
            
            <div className="border rounded-lg overflow-hidden">
              {imagePreview ? (
                <div className="relative aspect-video bg-gray-200 dark:bg-gray-800">
                  <img 
                    src={imagePreview} 
                    alt="Featured image preview" 
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImagePreview(null);
                      setFormData(prev => ({
                        ...prev,
                        thumbnail_url: '',
                        featured_image_path: null
                      }));
                    }}
                    className="absolute top-2 right-2 bg-white dark:bg-gray-800 p-1 rounded-full text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/20"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                  {formData.featured_image_path === null && formData.thumbnail_url && (
                    <div className="absolute top-2 left-2 bg-blue-500 rounded-full p-1" title="External URL">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                        <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                      </svg>
                    </div>
                  )}
                </div>
              ) : (
                <label 
                  htmlFor="featured-image" 
                  className={`cursor-pointer flex items-center justify-center px-4 py-12 ${
                    uploadingFeatured 
                      ? 'bg-gray-400 dark:bg-gray-700' 
                      : 'bg-gray-100 dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                  } transition-colors`}
                >
                  {uploadingFeatured ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span className="text-white">Uploading...</span>
                    </>
                  ) : (
                    <div className="text-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        Upload a featured image
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                        Or drag and drop an image file
                      </p>
                    </div>
                  )}
                </label>
              )}
              <input 
                id="featured-image" 
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={handleImageChange}
                disabled={uploadingFeatured}
              />
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Recommended size: 1200 x 630 pixels (16:9 ratio)
            </p>
          </div>
        </div>
        
        {/* Right column - Content & Gallery */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Project Content
            </label>
            <ProjectEditor 
              initialContent={formData.content || ''}
              onChange={handleContentChange}
            />
          </div>
          
          <ProjectGallery 
            images={formData.gallery_images} 
            onChange={handleGalleryChange}
            onSetFeatured={handleSetFeatured}
            projectId={formData.id as number}
          />
        </div>
      </div>
      
      <div className="flex justify-end space-x-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => window.history.back()}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={saving || loading}
        >
          {saving ? 'Saving...' : projectId ? 'Update Project' : 'Create Project'}
        </Button>
      </div>
    </form>
  );
} 