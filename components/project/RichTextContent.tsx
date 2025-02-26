'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import type { Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import { cn } from '@/lib/utils';

interface RichTextContentProps {
  content: string;
  className?: string;
}

export function RichTextContent({ content, className }: RichTextContentProps) {
  // Define custom components for markdown rendering
  const components: Components = {
    // Custom rendering for images
    img: (props) => {
      const { src, alt } = props;
      
      // Handle video embeds that might be in img tags with video extensions
      if (typeof src === 'string' && (
        src.endsWith('.mp4') || 
        src.endsWith('.webm') || 
        src.endsWith('.ogg')
      )) {
        return (
          <div className="my-8 w-full overflow-hidden rounded-lg">
            <video 
              src={src} 
              controls 
              className="w-full" 
              playsInline
              preload="metadata"
            >
              Your browser does not support the video tag.
            </video>
          </div>
        );
      }
      
      // Handle YouTube embeds that might be in img tags with youtube URLs
      if (typeof src === 'string' && (
        src.includes('youtube.com') || 
        src.includes('youtu.be')
      )) {
        // Extract video ID from YouTube URL
        let videoId = '';
        if (src.includes('youtube.com/watch')) {
          videoId = new URL(src).searchParams.get('v') || '';
        } else if (src.includes('youtu.be/')) {
          videoId = src.split('youtu.be/')[1].split('?')[0];
        } else if (src.includes('youtube.com/embed/')) {
          videoId = src.split('youtube.com/embed/')[1].split('?')[0];
        }
        
        if (videoId) {
          return (
            <div className="my-8 aspect-video w-full overflow-hidden rounded-lg">
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${videoId}`}
                title={alt || "YouTube video"}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="aspect-video"
              ></iframe>
            </div>
          );
        }
      }
      
      // Regular images
      return (
        <div className="my-8 w-full overflow-hidden rounded-lg">
          <img
            src={src || ''}
            alt={alt || ''}
            className="w-full h-auto"
            loading="lazy"
          />
        </div>
      );
    },
    
    // Custom rendering for links
    a: (props) => {
      const { href, children } = props;
      return (
        <a 
          href={href} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 transition-colors"
        >
          {children}
        </a>
      );
    },
    
    // Custom rendering for code blocks
    code: (props) => {
      const { className, children, ...rest } = props;
      const match = /language-(\w+)/.exec(className || '');
      const isInline = !match && (rest as { inline?: boolean }).inline;
      
      if (!isInline && match) {
        return (
          <div className="my-6 overflow-hidden rounded-lg bg-gray-800 text-white">
            <div className="px-4 py-2 bg-gray-900 text-xs font-mono">{match[1]}</div>
            <pre className="p-4 overflow-auto">
              <code className={className}>
                {children}
              </code>
            </pre>
          </div>
        );
      }
      
      return (
        <code className="bg-gray-100 px-1.5 py-0.5 rounded text-gray-800 font-mono text-sm">
          {children}
        </code>
      );
    },
    
    // Custom rendering for headings
    h1: (props) => <h1 className="text-3xl font-bold mt-8 mb-4 text-gray-900" {...props} />,
    h2: (props) => <h2 className="text-2xl font-bold mt-8 mb-3 text-gray-900" {...props} />,
    h3: (props) => <h3 className="text-xl font-bold mt-6 mb-3 text-gray-900" {...props} />,
    h4: (props) => <h4 className="text-lg font-bold mt-6 mb-2 text-gray-900" {...props} />,
    
    // Custom rendering for paragraphs
    p: (props) => <p className="my-4 text-gray-700 leading-relaxed" {...props} />,
    
    // Custom rendering for lists
    ul: (props) => <ul className="my-4 pl-6 list-disc space-y-2" {...props} />,
    ol: (props) => <ol className="my-4 pl-6 list-decimal space-y-2" {...props} />,
    li: (props) => <li className="text-gray-700" {...props} />,
    
    // Custom rendering for blockquotes
    blockquote: (props) => (
      <blockquote className="my-6 border-l-4 border-blue-500 pl-4 italic text-gray-600" {...props} />
    ),
    
    // Custom rendering for horizontal rules
    hr: (props) => <hr className="my-8 border-gray-200" {...props} />,
    
    // Custom rendering for tables
    table: (props) => (
      <div className="my-6 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg" {...props} />
      </div>
    ),
    thead: (props) => <thead className="bg-gray-50" {...props} />,
    tbody: (props) => <tbody className="divide-y divide-gray-200" {...props} />,
    tr: (props) => <tr {...props} />,
    th: (props) => <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" {...props} />,
    td: (props) => <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500" {...props} />,
  };

  return (
    <div className={cn('rich-text-content', className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, rehypeSanitize]}
        components={components}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
} 