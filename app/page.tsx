// app/page.tsx
import { Metadata } from 'next';
import { HeroSection } from '@/components/portfolio/HeroSection';
import { FeaturedProjects } from '@/components/portfolio/FeaturedProjects';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Button } from '@/components/ui/Button';
import { getFeaturedProjects } from '@/lib/services/projects';
import { VideoSection } from '@/components/layout/VideoSection';

export const metadata: Metadata = {
  title: 'Ravi Koomera - Motion Designer & Developer',
  description: 'Portfolio showcasing motion design and web development projects by Ravi Koomera.',
};


export default async function HomePage() {
  const featuredProjects = await getFeaturedProjects();
  
  return (
    <>
      <HeroSection
        title="Motion Design & Development"
        subtitle="I create engaging digital experiences that combine motion design with modern web development"
        ctaText="Work"
        ctaHref="/projects"
        secondaryCtaText="Get in Touch"
        secondaryCtaHref="/contact"
      />
      
      <VideoSection />
      
      <FeaturedProjects projects={featuredProjects} />
      
      <Section>
        <SectionHeading 
          title="Let's Work Together"
          subtitle="Have a project in mind? I'd love to hear about it!"
          centered
        />
        
        <div className="mt-8 flex justify-center">
          <Button href="/contact" size="lg">
            Contact Me
          </Button>
        </div>
      </Section>
    </>
  );
}