import React from 'react';

interface JsonLdProps {
  data: Record<string, any>;
}

export const JsonLd: React.FC<JsonLdProps> = ({ data }) => {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
};

export const createPersonSchema = () => {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Ravi Koomera',
    url: 'https://www.pinaka3d.com',
    jobTitle: 'Motion Designer & Developer',
    description: 'Portfolio showcasing motion design and web development projects by Ravi Koomera.',
    sameAs: [
      // Add your social media profiles here
      'https://linkedin.com/in/ravikoomera',
      'https://twitter.com/ravikoomera',
      // Add more as needed
    ],
  };
};

export const createWebsiteSchema = () => {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Ravi Koomera Portfolio',
    url: 'https://www.pinaka3d.com',
    description: 'Portfolio showcasing motion design and web development projects by Ravi Koomera.',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://www.pinaka3d.com/projects?search={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  };
};

export const createProjectSchema = (project: any) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: project.title,
    description: project.summary || `Details about ${project.title} project`,
    creator: {
      '@type': 'Person',
      name: 'Ravi Koomera',
    },
    dateCreated: project.created_at,
    dateModified: project.updated_at || project.created_at,
    url: `https://www.pinaka3d.com/projects/${project.slug}`,
    // Add more project-specific details as needed
  };
}; 