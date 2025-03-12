'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { createSupabaseBrowserClient } from '@/lib/supabase/browser-client';
import { v4 as uuidv4 } from 'uuid';

export type MediaCategory = 'gallery' | 'featured' | 'technical' | 'process';
export type MediaType = 'image' | 'video';

export interface GalleryImage {
  id: string;
  url: string;
  path?: string; // Path in Supabase storage, needed for deletion
  alt?: string;
  isFeatured?: boolean;
  type?: MediaType;
  category?: MediaCategory;
  description?: string;
  order?: number;
  isExternal?: boolean; // Flag for externally hosted media
}

interface ProjectGalleryProps {
  images: GalleryImage[];
  onChange: (images: GalleryImage[]) => void;
  onSetFeatured: (imageUrl: string) => void;
  projectId?: number; // Optional project ID for organizing uploads
}

interface UploadProgressEvent {
  loaded: number;
  total: number;
}

export default function ProjectGallery({ 
  images, 
  onChange, 
  onSetFeatured,
  projectId 
}: ProjectGalleryProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [draggedImage, setDraggedImage] = useState<GalleryImage | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const [externalUrl, setExternalUrl] = useState('');
  const [externalAlt, setExternalAlt] = useState('');
  const [activeTab, setActiveTab] = useState<'upload' | 'url'>('upload');
  const [selectedCategory, setSelectedCategory] = useState<MediaCategory>('gallery');
  
  const supabase = createSupabaseBrowserClient();
  
  // Generate a structured storage path based on project ID and category
  const getStoragePath = (fileName: string, category: MediaCategory = 'gallery'): string => {
    // Base folder name: project ID or temp folder
    const projectFolder = projectId ? `project-${projectId}` : 'temp-uploads';
    // Return the complete path with category subfolder
    return `${projectFolder}/${category}/${fileName}`;
  };
  
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    setUploading(true);
    const filesToUpload = Array.from(e.target.files);
    const uploadPromises: Promise<GalleryImage | null>[] = [];
    const tempUploadIds: string[] = [];
    
    // Initialize progress tracking for each file
    filesToUpload.forEach(file => {
      const uploadId = uuidv4();
      tempUploadIds.push(uploadId);
      setUploadProgress(prev => ({ ...prev, [uploadId]: 0 }));
    });
    
    // Upload each file to Supabase Storage
    filesToUpload.forEach((file, index) => {
      const uploadId = tempUploadIds[index];
      const fileExt = file.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      
      // Create a structured path with category subfolder
      const filePath = getStoragePath(fileName, selectedCategory);
      
      const uploadPromise = supabase.storage
        .from('project-galleries')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        })
        .then(({ data, error }) => {
          if (error) {
            console.error('Error uploading file:', error);
            return null;
          }
          
          // Get public URL
          const { data: publicUrlData } = supabase.storage
            .from('project-galleries')
            .getPublicUrl(filePath);
          
          if (!publicUrlData.publicUrl) {
            console.error('Failed to get public URL');
            return null;
          }
          
          // Determine if this is the first image (for featured status)
          const isFirst = images.length === 0 && index === 0;
          
          // Create gallery image object with enhanced metadata
          return {
            id: uploadId,
            url: publicUrlData.publicUrl,
            path: filePath,
            alt: file.name.split('.')[0],
            isFeatured: isFirst,
            type: file.type.startsWith('video/') ? 'video' as MediaType : 'image' as MediaType,
            category: selectedCategory,
            description: '',
            order: images.length + index,
            isExternal: false
          };
        });
      
      uploadPromises.push(uploadPromise);
      
      // Simulate progress for UI feedback since onUploadProgress isn't available
      const simulateProgress = () => {
        let progress = 0;
        const interval = setInterval(() => {
          progress += Math.floor(Math.random() * 10) + 5;
          if (progress > 95) {
            clearInterval(interval);
            progress = 95;
          }
          setUploadProgress(prev => ({ ...prev, [uploadId]: progress }));
        }, 200);
        
        // Clean up interval when upload completes
        uploadPromise.finally(() => {
          clearInterval(interval);
          setUploadProgress(prev => ({ ...prev, [uploadId]: 100 }));
        });
      };
      
      simulateProgress();
    });
    
    try {
      // Wait for all uploads to complete
      const uploadedImages = await Promise.all(uploadPromises);
      const validImages = uploadedImages.filter(img => img !== null) as GalleryImage[];
      
      if (validImages.length > 0) {
        const updatedImages = [...images, ...validImages];
        onChange(updatedImages);
        
        // If this is the first image, set it as featured
        if (images.length === 0 && validImages.length > 0) {
          onSetFeatured(validImages[0].url);
        }
      }
    } catch (error) {
      console.error('Error processing uploads:', error);
    } finally {
      setUploading(false);
      setUploadProgress({});
      
      // Clear the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };
  
  const handleAddExternalUrl = () => {
    if (!externalUrl || !externalUrl.trim()) {
      return;
    }
    
    // Validate URL
    try {
      new URL(externalUrl);
    } catch (e) {
      alert('Please enter a valid URL');
      return;
    }
    
    const newImage: GalleryImage = {
      id: uuidv4(),
      url: externalUrl,
      alt: externalAlt || 'External image',
      isFeatured: images.length === 0,
      type: externalUrl.match(/\.(mp4|mov|avi|wmv)$/i) ? 'video' as MediaType : 'image' as MediaType,
      category: selectedCategory,
      description: '',
      order: images.length,
      isExternal: true
    };
    
    const updatedImages = [...images, newImage];
    onChange(updatedImages);
    
    // If this is the first image, set it as featured
    if (images.length === 0) {
      onSetFeatured(externalUrl);
    }
    
    // Clear the input fields
    setExternalUrl('');
    setExternalAlt('');
  };
  
  const handleRemoveImage = async (id: string) => {
    // Find the image to remove
    const imageToRemove = images.find(image => image.id === id);
    
    if (imageToRemove?.path && !imageToRemove.isExternal) {
      try {
        // Remove from Supabase Storage
        const { error } = await supabase.storage
          .from('project-galleries')
          .remove([imageToRemove.path]);
          
        if (error) {
          console.error('Error removing file from storage:', error);
        }
      } catch (err) {
        console.error('Failed to remove image from storage:', err);
      }
    }
    
    const updatedImages = images.filter(image => image.id !== id);
    onChange(updatedImages);
    
    // If we removed the featured image, set the first available image as featured
    const removedImage = images.find(image => image.id === id);
    if (removedImage?.isFeatured && updatedImages.length > 0) {
      const newFeatured = updatedImages[0];
      handleSetFeatured(newFeatured.id);
    }
  };
  
  const handleSetFeatured = (id: string) => {
    const updatedImages = images.map(image => ({
      ...image,
      isFeatured: image.id === id
    }));
    
    onChange(updatedImages);
    
    // Find the featured image and update the thumbnail
    const featuredImage = updatedImages.find(img => img.id === id);
    if (featuredImage) {
      onSetFeatured(featuredImage.url);
    }
  };
  
  const handleDragStart = (image: GalleryImage) => {
    setDraggedImage(image);
  };
  
  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOverIndex(index);
  };
  
  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    
    if (!draggedImage) return;
    
    const currentIndex = images.findIndex(img => img.id === draggedImage.id);
    if (currentIndex === -1) return;
    
    // Create a new array without the dragged image
    const imagesCopy = [...images];
    imagesCopy.splice(currentIndex, 1);
    
    // Insert the dragged image at the target index
    imagesCopy.splice(targetIndex, 0, draggedImage);
    
    // Update order property for all images
    const reorderedImages = imagesCopy.map((img, idx) => ({
      ...img,
      order: idx
    }));
    
    onChange(reorderedImages);
    setDraggedImage(null);
    setDragOverIndex(null);
  };
  
  const handleUpdateDescription = (id: string, description: string) => {
    const updatedImages = images.map(image => 
      image.id === id ? { ...image, description } : image
    );
    onChange(updatedImages);
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-medium text-gray-900 dark:text-white">Project Gallery</h3>
      </div>
      
      {/* Tabs for choosing upload method */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <div className="flex">
          <button
            className={`px-4 py-2 font-medium text-sm rounded-t-lg ${
              activeTab === 'upload' 
                ? 'bg-brand text-white' 
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
            } transition-colors`}
            onClick={() => setActiveTab('upload')}
          >
            File Upload
          </button>
          <button
            className={`ml-2 px-4 py-2 font-medium text-sm rounded-t-lg ${
              activeTab === 'url' 
                ? 'bg-brand text-white' 
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
            } transition-colors`}
            onClick={() => setActiveTab('url')}
          >
            External URL
          </button>
        </div>
      </div>
      
      {/* Media Category Selection */}
      <div className="flex flex-wrap gap-2">
        <span className="text-sm text-gray-700 dark:text-gray-300 mr-2 my-auto">Category:</span>
        {(['gallery', 'featured', 'technical', 'process'] as MediaCategory[]).map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-3 py-1 text-sm rounded-full ${
              selectedCategory === category
                ? 'bg-brand text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
            }`}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>
      
      {/* Upload Interface */}
      {activeTab === 'upload' && (
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <label 
            htmlFor="gallery-upload" 
            className={`cursor-pointer w-full flex items-center justify-center px-4 py-6 ${
              uploading 
                ? 'bg-gray-400 dark:bg-gray-700' 
                : 'bg-gray-100 dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
            } rounded-lg transition-colors`}
          >
            {uploading ? (
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  Drag and drop files, or click to select
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                  PNG, JPG, GIF, MP4 up to 50MB
                </p>
              </div>
            )}
            <input 
              id="gallery-upload" 
              type="file" 
              multiple 
              accept="image/*,video/*" 
              className="hidden" 
              onChange={handleImageUpload}
              ref={fileInputRef}
              disabled={uploading}
            />
          </label>
        </div>
      )}
      
      {/* External URL Interface */}
      {activeTab === 'url' && (
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <div className="space-y-3">
            <div>
              <label htmlFor="external-url" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                External Media URL
              </label>
              <input
                id="external-url"
                type="url"
                value={externalUrl}
                onChange={(e) => setExternalUrl(e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="block w-full px-4 py-3 text-gray-900 dark:text-white bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-700"
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Enter a valid URL to an image or video file
              </p>
            </div>
            <div>
              <label htmlFor="external-alt" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Alt Text / Description
              </label>
              <input
                id="external-alt"
                type="text"
                value={externalAlt}
                onChange={(e) => setExternalAlt(e.target.value)}
                placeholder="Describe this media"
                className="block w-full px-4 py-3 text-gray-900 dark:text-white bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-700"
              />
            </div>
            <button
              onClick={handleAddExternalUrl}
              disabled={!externalUrl.trim()}
              className={`px-4 py-2 rounded-lg font-medium ${
                !externalUrl.trim()
                  ? 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed text-gray-500 dark:text-gray-400'
                  : 'bg-brand text-white hover:bg-brand-dark'
              } transition-colors`}
            >
              Add External Media
            </button>
          </div>
        </div>
      )}
      
      {/* Upload progress */}
      {uploading && Object.keys(uploadProgress).length > 0 && (
        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Upload Progress</h4>
          <div className="space-y-2">
            {Object.entries(uploadProgress).map(([id, progress]) => (
              <div key={id} className="space-y-1">
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                  <span>Uploading media...</span>
                  <span>{progress}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                  <div
                    className="bg-brand h-1.5 rounded-full"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Gallery */}
      {images.length === 0 && !uploading ? (
        <div className="bg-gray-50 dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-8 text-center">
          <p className="text-gray-500 dark:text-gray-400">No media added yet. Upload files or add external URLs.</p>
        </div>
      ) : (
        <div>
          {/* Category filters */}
          {images.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              <button
                onClick={() => setSelectedCategory('gallery')}
                className="px-3 py-1 text-sm rounded-full bg-gray-100 dark:bg-gray-800"
              >
                All ({images.length})
              </button>
              {(['gallery', 'featured', 'technical', 'process'] as MediaCategory[])
                .filter(cat => images.some(img => img.category === cat))
                .map(category => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className="px-3 py-1 text-sm rounded-full bg-gray-100 dark:bg-gray-800"
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1)} ({images.filter(img => img.category === category).length})
                  </button>
                ))}
            </div>
          )}
          
          {/* Media grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {images
              .filter(img => selectedCategory === 'gallery' || img.category === selectedCategory)
              .sort((a, b) => (a.order || 0) - (b.order || 0))
              .map((image, index) => (
                <div 
                  key={image.id}
                  className={`relative group rounded-lg overflow-hidden border-2 transition-colors 
                    ${dragOverIndex === index ? 'border-brand' : image.isFeatured ? 'border-yellow-500' : image.isExternal ? 'border-blue-500' : 'border-transparent'} 
                    ${image.id === draggedImage?.id ? 'opacity-50' : 'opacity-100'}`}
                  draggable
                  onDragStart={() => handleDragStart(image)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragEnd={() => {setDraggedImage(null); setDragOverIndex(null);}}
                  onDrop={(e) => handleDrop(e, index)}
                >
                  <div className="relative aspect-square">
                    {image.type === 'video' ? (
                      <div className="h-full w-full bg-gray-900 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                    ) : (
                      <Image 
                        src={image.url}
                        alt={image.alt || 'Project image'} 
                        fill
                        className="object-cover"
                      />
                    )}
                  </div>
                  
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="flex space-x-2">
                      <button
                        type="button"
                        onClick={() => handleSetFeatured(image.id)}
                        className={`p-1.5 rounded-full ${image.isFeatured ? 'bg-yellow-500' : 'bg-white'} text-gray-800 hover:bg-yellow-500 transition-colors`}
                        title="Set as featured image"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(image.id)}
                        className="p-1.5 bg-white rounded-full text-red-600 hover:bg-red-600 hover:text-white transition-colors"
                        title="Remove image"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  
                  {/* Featured indicator */}
                  {image.isFeatured && (
                    <div className="absolute top-2 right-2 bg-yellow-500 rounded-full p-1" title="Featured image">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </div>
                  )}
                  
                  {/* External URL indicator */}
                  {image.isExternal && (
                    <div className="absolute top-2 left-2 bg-blue-500 rounded-full p-1" title="External URL">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                        <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                      </svg>
                    </div>
                  )}
                  
                  {/* Media type indicator */}
                  {image.type === 'video' && !image.isExternal && (
                    <div className="absolute bottom-2 right-2 bg-purple-500 rounded-full p-1" title="Video">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                      </svg>
                    </div>
                  )}
                  
                  {/* Category indicator */}
                  <div className="absolute bottom-2 left-2 bg-gray-800 bg-opacity-75 rounded-full px-2 py-0.5">
                    <span className="text-xs text-white">{image.category || 'gallery'}</span>
                  </div>
                  
                  {/* Drag handle */}
                  <div className="absolute top-2 left-10 opacity-0 group-hover:opacity-100 transition-opacity cursor-move">
                    <div className="bg-white dark:bg-gray-800 p-1 rounded text-gray-600 dark:text-gray-400">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M7 2a1 1 0 011 1v1h3a1 1 0 110 2H9.20l-.8 2H12a1 1 0 110 2H8.2l-.8 2H10a1 1 0 110 2H7.2l-.8 2H9a1 1 0 110 2H5a1 1 0 01-.95-.68l-4-11a1 1 0 01.95-1.32H7zM15 2a1 1 0 011 1v1h3a1 1 0 110 2h-3v2h2a1 1 0 110 2h-2v2h3a1 1 0 110 2h-3v2h2a1 1 0 110 2h-4a1 1 0 01-1-1V3a1 1 0 011-1z" />
                      </svg>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
      
      <div className="text-sm text-gray-600 dark:text-gray-400 italic">
        Tip: Drag images to reorder. Click the star icon to set an image as featured.
      </div>
    </div>
  );
} 