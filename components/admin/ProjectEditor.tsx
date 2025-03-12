'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import { useState } from 'react';

export interface ProjectEditorProps {
  initialContent?: string;
  onChange: (content: string) => void;
}

export default function ProjectEditor({ initialContent = '', onChange }: ProjectEditorProps) {
  const [isLinkMenuOpen, setIsLinkMenuOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-brand hover:text-brand-dark underline',
        },
      }),
      Placeholder.configure({
        placeholder: 'Start writing your project description...',
      }),
    ],
    content: initialContent,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });
  
  const setLink = () => {
    if (!editor) return;
    
    // Check if URL is valid
    try {
      new URL(linkUrl);
    } catch (e) {
      alert('Please enter a valid URL');
      return;
    }
    
    // Check if there's selected text
    if (!editor.isActive('link') && editor.state.selection.empty) {
      alert('Please select some text first');
      return;
    }

    // Update or remove the link
    if (linkUrl === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
    } else {
      editor
        .chain()
        .focus()
        .extendMarkRange('link')
        .setLink({ href: linkUrl })
        .run();
    }
    
    // Close the link menu and reset the url
    setIsLinkMenuOpen(false);
    setLinkUrl('');
  };
  
  const addImage = () => {
    if (!editor) return;
    
    const url = prompt('Enter image URL:');
    if (url) {
      editor.chain().focus().setImage({ src: url, alt: 'Project image' }).run();
    }
  };
  
  if (!editor) {
    return <div>Loading editor...</div>;
  }
  
  return (
    <div className="border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="bg-gray-100 dark:bg-gray-800 p-2 border-b border-gray-300 dark:border-gray-700 flex flex-wrap gap-1 sticky top-0 z-10">
        {/* Text formatting */}
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 rounded ${editor.isActive('bold') ? 'bg-gray-300 dark:bg-gray-700' : 'hover:bg-gray-200 dark:hover:bg-gray-700'}`}
          title="Bold"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M13.2 9.8c-.8-.2-1.5-.4-2.2-.6-1.2-.4-1.8-.9-1.8-1.5 0-.7.6-1.1 1.6-1.1 1.2 0 2.1.4 2.7 1.3l1.6-1.2c-1-1.3-2.4-1.9-4.3-1.9-2.3 0-3.9 1.2-3.9 3 0 1.8 1.3 2.5 3.2 3.1.8.2 1.5.4 2.2.6 1.2.4 1.8.9 1.8 1.5 0 .7-.6 1.2-1.7 1.2-1.4 0-2.5-.5-3.2-1.7l-1.7 1.2c1.1 1.6 2.7 2.5 4.9 2.5 2.4 0 4-1.2 4-3.1 0-1.8-1.3-2.6-3.2-3.2z"/>
          </svg>
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 rounded ${editor.isActive('italic') ? 'bg-gray-300 dark:bg-gray-700' : 'hover:bg-gray-200 dark:hover:bg-gray-700'}`}
          title="Italic"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10.22 6.15l-3.78 8.5h1.8l3.78-8.5h-1.8zM9 3a1 1 0 100 2h2a1 1 0 100-2H9zm10 2a1 1 0 100-2h-2a1 1 0 100 2h2z"/>
          </svg>
        </button>
        
        {/* Headings */}
        <div className="relative inline-block">
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            className={`p-2 rounded ${editor.isActive('heading', { level: 1 }) ? 'bg-gray-300 dark:bg-gray-700' : 'hover:bg-gray-200 dark:hover:bg-gray-700'}`}
            title="Heading 1"
          >
            H1
          </button>
        </div>
        <div className="relative inline-block">
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={`p-2 rounded ${editor.isActive('heading', { level: 2 }) ? 'bg-gray-300 dark:bg-gray-700' : 'hover:bg-gray-200 dark:hover:bg-gray-700'}`}
            title="Heading 2"
          >
            H2
          </button>
        </div>
        <div className="relative inline-block">
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            className={`p-2 rounded ${editor.isActive('heading', { level: 3 }) ? 'bg-gray-300 dark:bg-gray-700' : 'hover:bg-gray-200 dark:hover:bg-gray-700'}`}
            title="Heading 3"
          >
            H3
          </button>
        </div>
        
        <div className="h-6 border-r border-gray-300 dark:border-gray-600 mx-1"></div>
        
        {/* Lists */}
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded ${editor.isActive('bulletList') ? 'bg-gray-300 dark:bg-gray-700' : 'hover:bg-gray-200 dark:hover:bg-gray-700'}`}
          title="Bullet List"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5 4a1 1 0 011-1h10a1 1 0 110 2H6a1 1 0 01-1-1zm0 6a1 1 0 011-1h10a1 1 0 110 2H6a1 1 0 01-1-1zm1 5a1 1 0 100 2h10a1 1 0 100-2H6z" clipRule="evenodd" />
          </svg>
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-2 rounded ${editor.isActive('orderedList') ? 'bg-gray-300 dark:bg-gray-700' : 'hover:bg-gray-200 dark:hover:bg-gray-700'}`}
          title="Numbered List"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M3 3a1 1 0 000 2h7a1 1 0 100-2H3zM3 7a1 1 0 000 2h11a1 1 0 100-2H3zM3 11a1 1 0 100 2h7a1 1 0 100-2H3z" />
            <path d="M3 15a1 1 0 100 2h7a1 1 0 100-2H3z" />
          </svg>
        </button>
        
        <div className="h-6 border-r border-gray-300 dark:border-gray-600 mx-1"></div>
        
        {/* Link */}
        <div className="relative">
          <button
            onClick={() => setIsLinkMenuOpen(!isLinkMenuOpen)}
            className={`p-2 rounded ${editor.isActive('link') ? 'bg-gray-300 dark:bg-gray-700' : 'hover:bg-gray-200 dark:hover:bg-gray-700'}`}
            title="Link"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
            </svg>
          </button>
          
          {isLinkMenuOpen && (
            <div className="absolute left-0 mt-2 bg-white dark:bg-gray-800 rounded shadow-lg p-3 border border-gray-200 dark:border-gray-700 w-72 z-20">
              <div className="flex flex-col space-y-2">
                <input
                  type="text"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-white"
                />
                <div className="flex space-x-2">
                  <button
                    onClick={setLink}
                    className="px-3 py-1 bg-brand text-white rounded hover:bg-brand-dark"
                  >
                    {editor.isActive('link') ? 'Update Link' : 'Add Link'}
                  </button>
                  {editor.isActive('link') && (
                    <button
                      onClick={() => {
                        editor.chain().focus().unsetLink().run();
                        setIsLinkMenuOpen(false);
                      }}
                      className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Image */}
        <button
          onClick={addImage}
          className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700`}
          title="Insert Image"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
      
      {/* Editor Content */}
      <EditorContent 
        editor={editor} 
        className="p-4 min-h-[300px] max-h-[600px] overflow-y-auto prose prose-sm dark:prose-invert max-w-none focus:outline-none"
      />
    </div>
  );
} 