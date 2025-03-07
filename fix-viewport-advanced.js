// fix-viewport-advanced.js
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

// Get a list of files with viewport warnings from the build output
function getAllViewportWarnings(callback) {
  exec('npm run build', (error, stdout) => {
    if (error) {
      console.error('Error running build:', error);
      return callback([]);
    }
    
    // Extract all the files with viewport warnings
    const warnings = [];
    const regex = /Unsupported metadata viewport is configured in metadata export in ([^\.]+)/g;
    let match;
    while ((match = regex.exec(stdout)) !== null) {
      const route = match[1].trim();
      let filePath;
      
      // Convert route to file path
      if (route === '/_not-found') {
        filePath = 'app/not-found.tsx';
      } else if (route === '/') {
        filePath = 'app/page.tsx';
      } else if (route.includes('/projects/') && route !== '/projects/') {
        // For dynamic routes like /projects/[slug]
        const slug = route.replace('/projects/', '');
        filePath = `app/projects/[slug]/page.tsx`;
        if (!warnings.includes(filePath)) {
          warnings.push(filePath);
        }
        continue;
      } else {
        filePath = `app${route}/page.tsx`;
        
        // Check for layout files
        if (!fs.existsSync(filePath)) {
          filePath = `app${route}/layout.tsx`;
        }
        
        // Check for separate metadata files
        if (!fs.existsSync(filePath)) {
          filePath = `app${route}/metadata.ts`;
        }
      }
      
      if (fs.existsSync(filePath) && !warnings.includes(filePath)) {
        warnings.push(filePath);
      }
    }
    
    callback(warnings);
  });
}

// Function to fix a file with viewport warning
function fixViewportInFile(filePath) {
  try {
    console.log(`Processing ${filePath}...`);
    
    // Read the file
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Check if file already has viewport export
    if (content.includes('export const viewport') || content.includes('export function generateViewport')) {
      console.log(`  Skipping: File already has viewport export`);
      return;
    }
    
    // Update imports to include Viewport
    let updatedContent = content;
    if (content.includes('import { Metadata }')) {
      updatedContent = content.replace('import { Metadata }', 'import { Metadata, Viewport }');
    } else if (content.includes('import type { Metadata }')) {
      updatedContent = content.replace('import type { Metadata }', 'import type { Metadata, Viewport }');
    } else if (content.includes('import {')) {
      // Find the first import and add Viewport
      const importRegex = /import {([^}]*)}/;
      const match = content.match(importRegex);
      if (match) {
        updatedContent = content.replace(importRegex, `import { Viewport, $1}`);
      }
    } else if (content.includes('import')) {
      // Add a new import if no appropriate import found
      const lines = content.split('\n');
      const lastImportIndex = lines.findIndex((line, i, arr) => 
        line.startsWith('import') && (i === arr.length - 1 || !arr[i+1].startsWith('import'))
      );
      
      if (lastImportIndex !== -1) {
        lines.splice(lastImportIndex + 1, 0, "import { Viewport } from 'next';");
        updatedContent = lines.join('\n');
      }
    }
    
    // Add viewport based on file type and structure
    if (filePath.includes('[slug]') && content.includes('export async function generateMetadata')) {
      // For dynamic routes with generateMetadata
      const viewportFunction = `
export async function generateViewport(): Promise<Viewport> {
  return {
    width: 'device-width',
    initialScale: 1,
  };
}
`;
      
      // Find the generateMetadata function
      const metadataFunctionRegex = /export async function generateMetadata/;
      if (updatedContent.match(metadataFunctionRegex)) {
        // Add viewport export before generateMetadata
        updatedContent = updatedContent.replace(metadataFunctionRegex, (match) => {
          return viewportFunction + match;
        });
      } else {
        console.log(`  Warning: Could not find appropriate location to add generateViewport function`);
        return;
      }
    } else {
      // Standard viewport export
      const viewportExport = `
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};
`;
      
      // Find the metadata export
      const metadataRegex = /export const metadata[^;]*;/;
      if (updatedContent.match(metadataRegex)) {
        // Add viewport export after metadata
        updatedContent = updatedContent.replace(metadataRegex, (match) => {
          return match + viewportExport;
        });
      } else {
        // If no metadata export, add viewport before the default export
        const defaultExportRegex = /export default function/;
        if (updatedContent.match(defaultExportRegex)) {
          updatedContent = updatedContent.replace(defaultExportRegex, (match) => {
            return viewportExport + match;
          });
        } else {
          console.log(`  Warning: Could not find appropriate location to add viewport export`);
          return;
        }
      }
    }
    
    // Write the updated content back to the file
    fs.writeFileSync(filePath, updatedContent, 'utf8');
    console.log(`  Updated ${filePath} successfully`);
  } catch (error) {
    console.error(`  Error processing ${filePath}:`, error.message);
  }
}

// Main function to fix all viewport warnings
function fixAllViewportWarnings() {
  console.log('Finding files with viewport warnings...');
  getAllViewportWarnings((files) => {
    console.log(`Found ${files.length} files with viewport warnings:`);
    files.forEach(file => console.log(`- ${file}`));
    
    if (files.length === 0) {
      console.log('No viewport warnings found. All good!');
      return;
    }
    
    console.log('\nFixing viewport issues in files...');
    files.forEach(file => fixViewportInFile(file));
    
    console.log('\nAll files processed. Running build again to verify fixes...');
    exec('npm run build', (error, stdout) => {
      if (error) {
        console.error('Error running build:', error);
        return;
      }
      
      // Check if there are still viewport warnings
      if (stdout.includes('Unsupported metadata viewport')) {
        console.log('\nStill have viewport warnings. Some files may need manual fixing.');
      } else {
        console.log('\nSuccess! All viewport warnings have been fixed.');
      }
    });
  });
}

// Run the fix
fixAllViewportWarnings(); 