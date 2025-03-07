/**
 * Resource Loader - Tracks loading status of critical resources
 * This utility helps ensure all required assets are loaded before showing the website
 */

// Resource loading states
type ResourceStatus = 'pending' | 'loading' | 'loaded' | 'error';

// Resource definition
interface Resource {
  id: string;
  status: ResourceStatus;
  weight: number; // Importance weight for progress calculation (higher = more important)
  errorCount: number;
  retryCount: number;
}

// Resource registry to track all resources
class ResourceRegistry {
  private resources: Map<string, Resource> = new Map();
  private listeners: Set<(progress: number) => void> = new Set();
  private isInitialized: boolean = false;
  
  // Register a new resource to track
  registerResource(id: string, weight: number = 1): void {
    if (this.resources.has(id)) {
      return; // Already registered
    }
    
    this.resources.set(id, {
      id,
      status: 'pending',
      weight,
      errorCount: 0,
      retryCount: 0
    });
    
    this.notifyListeners();
  }
  
  // Start loading a specific resource
  startLoading(id: string): void {
    const resource = this.resources.get(id);
    if (resource) {
      resource.status = 'loading';
      this.notifyListeners();
    }
  }
  
  // Mark a resource as loaded
  resourceLoaded(id: string): void {
    const resource = this.resources.get(id);
    if (resource) {
      resource.status = 'loaded';
      this.notifyListeners();
    }
  }
  
  // Mark a resource as errored
  resourceError(id: string, willRetry: boolean = false): void {
    const resource = this.resources.get(id);
    if (resource) {
      resource.status = willRetry ? 'loading' : 'error';
      resource.errorCount++;
      this.notifyListeners();
    }
  }
  
  // Register a resource and immediately mark it as loading
  registerAndStartLoading(id: string, weight: number = 1): void {
    this.registerResource(id, weight);
    this.startLoading(id);
  }
  
  // Calculate loading progress (0-100)
  getProgress(): number {
    if (this.resources.size === 0) return 100;
    
    let totalWeight = 0;
    let loadedWeight = 0;
    
    this.resources.forEach(resource => {
      totalWeight += resource.weight;
      if (resource.status === 'loaded') {
        loadedWeight += resource.weight;
      }
    });
    
    return Math.round((loadedWeight / totalWeight) * 100);
  }
  
  // Check if all resources are loaded
  areAllResourcesLoaded(): boolean {
    if (this.resources.size === 0) return true;
    
    let allLoaded = true;
    this.resources.forEach(resource => {
      if (resource.status !== 'loaded') {
        allLoaded = false;
      }
    });
    
    return allLoaded;
  }
  
  // Get count of pending, loading, loaded, and error resources
  getResourceCounts(): { pending: number; loading: number; loaded: number; error: number } {
    let pending = 0;
    let loading = 0;
    let loaded = 0;
    let error = 0;
    
    this.resources.forEach(resource => {
      switch (resource.status) {
        case 'pending': pending++; break;
        case 'loading': loading++; break;
        case 'loaded': loaded++; break;
        case 'error': error++; break;
      }
    });
    
    return { pending, loading, loaded, error };
  }
  
  // Listen for progress updates
  addProgressListener(callback: (progress: number) => void): () => void {
    this.listeners.add(callback);
    
    // Return cleanup function
    return () => {
      this.listeners.delete(callback);
    };
  }
  
  // Notify all listeners of progress changes
  private notifyListeners(): void {
    const progress = this.getProgress();
    this.listeners.forEach(listener => listener(progress));
  }
  
  // Initialize with basic page resources
  initialize(): void {
    if (this.isInitialized) return;
    
    // Register standard resources
    this.registerResource('dom', 5); // DOM content
    this.registerResource('images', 3); // Images
    this.registerResource('fonts', 2); // Fonts
    this.registerResource('css', 1); // CSS
    
    // Mark DOM as loading
    this.startLoading('dom');
    
    // Set up page load listeners
    if (typeof window !== 'undefined') {
      // Listen for DOMContentLoaded event
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
          this.resourceLoaded('dom');
        });
      } else {
        this.resourceLoaded('dom');
      }
      
      // Listen for fonts loaded event
      if ((document as any).fonts && (document as any).fonts.ready) {
        this.startLoading('fonts');
        (document as any).fonts.ready.then(() => {
          this.resourceLoaded('fonts');
        });
      } else {
        // If font API not available, just mark as loaded
        this.resourceLoaded('fonts');
      }
      
      // Count and wait for images
      window.addEventListener('load', () => {
        const images = document.querySelectorAll('img');
        if (images.length > 0) {
          this.startLoading('images');
          
          let loadedImages = 0;
          let totalImages = images.length;
          
          images.forEach(img => {
            if (img.complete) {
              loadedImages++;
            } else {
              img.addEventListener('load', () => {
                loadedImages++;
                if (loadedImages >= totalImages) {
                  this.resourceLoaded('images');
                }
              });
              
              img.addEventListener('error', () => {
                loadedImages++;
                if (loadedImages >= totalImages) {
                  this.resourceLoaded('images');
                }
              });
            }
          });
          
          // If all images already loaded
          if (loadedImages >= totalImages) {
            this.resourceLoaded('images');
          }
        } else {
          this.resourceLoaded('images');
        }
        
        // Mark CSS as loaded
        this.resourceLoaded('css');
      });
    }
    
    this.isInitialized = true;
  }
  
  // Reset the resource registry
  reset(): void {
    this.resources.clear();
    this.isInitialized = false;
    this.initialize();
  }
}

// Create singleton instance
export const resourceRegistry = new ResourceRegistry();

// Initialize on import
if (typeof window !== 'undefined') {
  resourceRegistry.initialize();
}

// Helper for 3D model loading
export const track3DModel = (modelUrl: string, weight: number = 3): Promise<void> => {
  return new Promise((resolve, reject) => {
    const resourceId = `model:${modelUrl}`;
    
    resourceRegistry.registerAndStartLoading(resourceId, weight);
    
    // Create a temporary loader
    const image = new Image();
    image.onload = () => {
      resourceRegistry.resourceLoaded(resourceId);
      resolve();
    };
    
    image.onerror = () => {
      resourceRegistry.resourceError(resourceId);
      // Resolve anyway to not block the loading process
      resolve();
    };
    
    // Start loading the model (this is just a ping to verify the resource exists)
    image.src = `${modelUrl}?ping=${Date.now()}`;
  });
};

// Helper to track a custom resource
export const trackResource = (id: string, weight: number = 1): {
  start: () => void;
  complete: () => void;
  error: () => void;
} => {
  const resourceId = `custom:${id}`;
  resourceRegistry.registerResource(resourceId, weight);
  
  return {
    start: () => resourceRegistry.startLoading(resourceId),
    complete: () => resourceRegistry.resourceLoaded(resourceId),
    error: () => resourceRegistry.resourceError(resourceId)
  };
};

// Export default tracking functions
export default resourceRegistry; 