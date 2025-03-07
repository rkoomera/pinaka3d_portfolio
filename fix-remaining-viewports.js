// fix-remaining-viewports.js
const fs = require('fs');
const path = require('path');

// List of files that still need fixing
const filesToFix = [
  'app/about/page.tsx',
  'app/not-found.tsx',
  'app/contact/page.tsx',
  'app/styleguide/page.tsx',
  'app/page.tsx',
  'app/admin/login/layout.tsx'
];

// Function to add viewport export to a file
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
    
    // Add viewport export
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
    
    // Write the updated content back to the file
    fs.writeFileSync(filePath, updatedContent, 'utf8');
    console.log(`  Updated ${filePath} successfully`);
  } catch (error) {
    console.error(`  Error processing ${filePath}:`, error.message);
  }
}

// Process each file
filesToFix.forEach(file => {
  const fullPath = path.join(process.cwd(), file);
  
  // Check if file exists
  if (fs.existsSync(fullPath)) {
    fixViewportInFile(fullPath);
  } else {
    console.log(`File not found: ${file}`);
  }
});

console.log('Remaining viewport fixes completed!'); 