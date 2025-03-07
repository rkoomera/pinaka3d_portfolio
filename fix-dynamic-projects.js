const fs = require('fs');
const path = require('path');

// Function to fix the dynamic project page
function fixDynamicProjectPage() {
  const filePath = 'app/projects/[slug]/page.tsx';
  
  try {
    console.log(`Fixing ${filePath}...`);
    
    // Read the file
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Check if generateMetadata function exists
    if (!content.includes('export async function generateMetadata')) {
      console.log(`  Warning: File does not have generateMetadata function`);
      return;
    }
    
    // Make sure Viewport is imported
    let updatedContent = content;
    if (!content.includes('Viewport')) {
      if (content.includes('import { Metadata }')) {
        updatedContent = content.replace('import { Metadata }', 'import { Metadata, Viewport }');
      } else if (content.includes('import type { Metadata }')) {
        updatedContent = content.replace('import type { Metadata }', 'import type { Metadata, Viewport }');
      } else {
        // Add viewport import
        const lines = updatedContent.split('\n');
        const firstImportIndex = lines.findIndex(line => line.includes('import'));
        if (firstImportIndex !== -1) {
          lines.splice(firstImportIndex, 0, "import { Viewport } from 'next';");
          updatedContent = lines.join('\n');
        }
      }
    }
    
    // Verify if generateViewport already exists
    if (updatedContent.includes('export async function generateViewport')) {
      console.log(`  Skipping: File already has generateViewport function`);
    } else {
      // Add generateViewport function before generateMetadata
      const generateViewportFunction = `
export async function generateViewport(): Promise<Viewport> {
  return {
    width: 'device-width',
    initialScale: 1,
  };
}

`;
      
      // Add the function before generateMetadata
      updatedContent = updatedContent.replace('export async function generateMetadata', (match) => {
        return generateViewportFunction + match;
      });
      
      // Write the updated content back to the file
      fs.writeFileSync(filePath, updatedContent, 'utf8');
      console.log(`  Updated ${filePath} successfully`);
    }
  } catch (error) {
    console.error(`  Error processing ${filePath}:`, error.message);
  }
}

// Run the fix
fixDynamicProjectPage();
console.log('Dynamic project page fix completed!'); 