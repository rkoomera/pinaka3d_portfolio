// app/page.tsx
import { Metadata } from 'next';
import { HeroSection } from '@/components/portfolio/HeroSection';
import { FeaturedProjects } from '@/components/portfolio/FeaturedProjects';
import { getFeaturedProjects } from '@/lib/services/projects';
import { VideoSection } from '@/components/layout/VideoSection';
import { ContactCTA } from '@/components/portfolio/ContactCTA';

export const metadata: Metadata = {
  title: 'Ravi Koomera - Motion Designer & Developer',
  description: 'Portfolio showcasing motion design and web development projects by Ravi Koomera.',
};


export default async function HomePage() {
  const featuredProjects = await getFeaturedProjects();
  
  return (
    <>
      <HeroSection
        title="Hi, I'm Ravi!"
        subtitle="Motion Designer producing high-quality video content. Based in Frankfurt, Germany."
      />
      
      <VideoSection />
      
      <FeaturedProjects projects={featuredProjects} limit={3} />
      
      <ContactCTA />
    </>
  );
}